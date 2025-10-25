import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom'
import AuthGuard from './components/auth/AuthGuard'
import JoinClass from './components/student/JoinClass'
import { authService } from './services/auth'
import { supabase } from './services/api'
import './App.css'

// Wrapper component to handle URL parameters
function AppContent() {
  const [searchParams] = useSearchParams()
  const joinClassId = searchParams.get('joinClass')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [authMode, setAuthMode] = useState('signin') // 'signin' or 'signup'

  // Enable/disable button based on form validation
  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      if (authMode === 'signup' && termsAccepted) {
        setDisabled(false)
      } else if (authMode === 'signin') {
        setDisabled(false)
      } else {
        setDisabled(true)
      }
    } else {
      setDisabled(true)
    }
  }, [email, password, termsAccepted, authMode])

  // Check auth state and listen for changes
  useEffect(() => {
    // Check if user is already signed in
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(session)
      }
    }
    
    getSession()

    // Listen for auth state changes (e.g., when user confirms email)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(session)
        setError('') // Clear any error messages
        
        // If user came from a join class link, redirect them back
        if (joinClassId) {
          window.location.href = `/join-class/${joinClassId}`
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [joinClassId])

  const handleAuthentication = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const fullEmail = `${email}@byui.edu`
      console.log(`Attempting ${authMode} with email:`, fullEmail)
      
      if (authMode === 'signin') {
        // Handle sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
          email: fullEmail, 
          password: password 
        })
        
        if (signInError) {
          console.log('Sign in failed:', signInError)
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please check your credentials and try again.')
          } else if (signInError.message.includes('Email not confirmed')) {
            setError('Please check your email and click the confirmation link to activate your account.')
          } else {
            setError(`Sign in failed: ${signInError.message}`)
          }
          return
        }
        
        if (signInData && signInData.user) {
          console.log('Sign in successful:', signInData)
          
          // Check if user already has a role
          try {
            const currentRole = await authService.getUserRole()
            console.log('User role check result:', currentRole)
            
            if (currentRole) {
              // User already has a role, proceed to dashboard
              console.log('Existing user with role:', currentRole)
              setIsAuthenticated(signInData)
              
              // If user came from a join class link, redirect them back
              if (joinClassId) {
                window.location.href = `/join-class/${joinClassId}`
              }
            } else {
              // User doesn't have a role yet, they need to select one
              console.log('New user without role, proceeding to role selection')
              setIsAuthenticated(signInData)
              
              // If user came from a join class link, assign student role and redirect them back
              if (joinClassId) {
                try {
                  console.log('Assigning student role for join class flow...')
                  await authService.selectRole('student')
                  console.log('Student role assigned successfully')
                } catch (roleError) {
                  console.error('Error with role assignment:', roleError)
                  // Continue anyway, the user can still join the class
                }
                window.location.href = `/join-class/${joinClassId}`
              }
            }
          } catch (roleError) {
            console.error('Error checking user role:', roleError)
            // If we can't check the role, still proceed but show error
            setError('Unable to verify your account status. Please try again.')
            return
          }
        }
      } else {
        // Handle sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
          email: fullEmail, 
          password: password 
        })

        console.log('Sign up result:', { signUpData, signUpError })

        if (signUpError) {
          console.log("Error creating account: ", signUpError)
          if (signUpError.message.includes('email_address_invalid')) {
            setError('Email domain not allowed. Please contact administrator.')
          } else if (signUpError.message.includes('email_not_confirmed')) {
            setError('Please check your email to confirm your account.')
          } else if (signUpError.message.includes('User already registered')) {
            setError('An account with this email already exists. Please sign in instead.')
          } else {
            setError(`Error creating account: ${signUpError.message}`)
          }
          return
        }

        if (signUpData.user) {
          console.log('Account created successfully')
          
          // Check if email confirmation is required
          if (signUpData.user.email_confirmed_at === null) {
            setError('Account created! Please check your email and click the confirmation link to activate your account. You can then sign in.')
            return
          }
          
          // If email is already confirmed, sign in immediately
          const { data: finalSignInData, error: finalSignInError } = await supabase.auth.signInWithPassword({ 
            email: fullEmail, 
            password: password 
          })
          
          if (finalSignInError) {
            console.log('Final sign in error:', finalSignInError)
            if (finalSignInError.message.includes('Email not confirmed')) {
              setError('Account created! Please check your email and click the confirmation link to activate your account.')
            } else {
              setError('Account created but sign in failed. Please try again.')
            }
            return
          }
          
          console.log('Final sign in successful:', finalSignInData)
          
          // Check if user already has a role (shouldn't happen for new signups, but just in case)
          try {
            const currentRole = await authService.getUserRole()
            console.log('New user role check result:', currentRole)
            
            if (currentRole) {
              // User already has a role (unexpected for new signup)
              console.log('Existing user with role:', currentRole)
              setIsAuthenticated(finalSignInData)
              
              // If user came from a join class link, redirect them back
              if (joinClassId) {
                window.location.href = `/join-class/${joinClassId}`
              }
            } else {
              // New user without role, they need to select one
              console.log('New user without role, proceeding to role selection')
              setIsAuthenticated(finalSignInData)
              
              // If user came from a join class link, assign student role and redirect them back
              if (joinClassId) {
                try {
                  console.log('Assigning student role for join class flow...')
                  await authService.selectRole('student')
                  console.log('Student role assigned successfully')
                } catch (roleError) {
                  console.error('Error assigning student role:', roleError)
                  // Continue anyway, the user can still join the class
                }
                window.location.href = `/join-class/${joinClassId}`
              }
            }
          } catch (roleError) {
            console.error('Error checking user role:', roleError)
            // If we can't check the role, still proceed but show error
            setError('Unable to verify your account status. Please try again.')
            return
          }
        } else {
          setError('Account creation failed. Please try again.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Authentication error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // If user is authenticated, show the main app
  if (isAuthenticated) {
    return <AuthGuard />
  }

  // If user is trying to join a class, show join class page
  if (joinClassId) {
    return <JoinClass classId={joinClassId} />
  }

  // Show login/signup form
  return (
    <div className="app-container">
      <div className="auth-header">
        <h1>i eat</h1>
      </div>
      
      <div className="auth-card">
        <div className="auth-form">
          <div className="email-container">
            <input
              type="text"
              placeholder="sum23003"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
            <span className="email-suffix">@byui.edu</span>
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {authMode === 'signup' && (
            <>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms">
                  By creating an account, you agree to our <a href="#">Terms of Service</a>
                </label>
              </div>
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
                <label htmlFor="newsletter">
                  I would like to receive marketing emails and other updates
                </label>
              </div>
            </>
          )}

          <div className="auth-mode-toggle">
            {authMode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => {
                    setAuthMode('signup')
                    setError('')
                  }}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => {
                    setAuthMode('signin')
                    setError('')
                  }}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          <button
            className={`submit-button ${disabled ? 'disabled' : ''}`}
            onClick={handleAuthentication}
            disabled={disabled || isLoading}
          >
            {isLoading ? (authMode === 'signin' ? 'Signing In...' : 'Creating Account...') : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/join-class/:classId" element={<JoinClass />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}

export default App
