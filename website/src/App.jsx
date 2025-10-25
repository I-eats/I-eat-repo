import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
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

  const handleSignIn = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const fullEmail = `${email}@byui.edu`
      
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email: fullEmail, 
        password: password 
      })
      
      if (signInData && !signInError) {
        // Sign in successful
        setIsAuthenticated(signInData)
        return
      }

      // If sign in failed, try to create account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email: fullEmail, 
        password: password 
      })

      if (signUpError) {
        console.log("error creating account: ", signUpError)
        setError('Error creating account. Please try again.')
        return
      }

      if (signUpData.user) {
        // Account created successfully, sign in
        const { data: finalSignInData, error: finalSignInError } = await supabase.auth.signInWithPassword({ 
          email: fullEmail, 
          password: password 
        })
        
        if (finalSignInError) {
          setError('Account created but sign in failed. Please try again.')
          return
        }
        
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

  const handleSignOut = () => {
    supabase.auth.signOut()
    setIsAuthenticated(false)
    setEmail('')
    setPassword('')
    setTermsAccepted(false)
    setNewsletter(false)
    setError('')
  }

  if (isAuthenticated) {
    return (
      <div className="app-container">
        <div className="dashboard">
          <h1>Welcome to I-Eat!</h1>
          <p>Hello {isAuthenticated.user?.email}!</p>
          <p>🎉 You're successfully logged in!</p>
          <button onClick={handleSignOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      </div>
    )
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