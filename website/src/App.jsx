import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import AuthGuard from './components/auth/AuthGuard'
import './App.css'

// Create Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Enable/disable button based on form validation
  useEffect(() => {
    if (email.length > 0 && password.length > 0 && termsAccepted) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email, password, termsAccepted])

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
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const fullEmail = `${email}@byui.edu`
      console.log('Attempting authentication with email:', fullEmail)
      
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email: fullEmail, 
        password: password 
      })
      
      if (signInData && !signInError) {
        console.log('Sign in successful:', signInData)
        setIsAuthenticated(signInData)
        return
      }

      console.log('Sign in failed, trying to create account. Error:', signInError)

      // If sign in failed, try to create account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email: fullEmail, 
        password: password 
      })

      console.log('Sign up result:', { signUpData, signUpError })

      if (signUpError) {
        console.log("error creating account: ", signUpError)
        if (signUpError.message.includes('email_address_invalid')) {
          setError('Email domain not allowed. Please contact administrator.')
        } else if (signUpError.message.includes('email_not_confirmed')) {
          setError('Please check your email to confirm your account.')
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
        setIsAuthenticated(finalSignInData)
      } else {
        setError('Account creation failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Authentication error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    return <AuthGuard />
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="title">i eat</h1>
      </div>
      
      <div className="bottom-content">
        <div className="email-portion">
          <input
            type="text"
            placeholder="sum23003"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />
          <span className="email-end-portion">@byui.edu</span>
        </div>
        
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
        
        <div className="terms-wrapper">
          <div className="terms-container">
            <div className="term">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="term-checkbox"
              />
              <label htmlFor="terms" className="term-text">
                By creating an account, you agree to our <span className="term-link">Terms of Service</span>
              </label>
            </div>
            <div className="term">
              <input
                type="checkbox"
                id="newsletter"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="term-checkbox"
              />
              <label htmlFor="newsletter" className="term-text">
                I would like to receive marketing emails and other updates
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          className={`sign-in-button ${disabled ? 'disabled' : ''}`}
          onClick={handleSignIn}
          disabled={disabled || isLoading}
        >
          {isLoading ? 'Creating...' : 'create'}
        </button>
      </div>
    </div>
  )
}

export default App
