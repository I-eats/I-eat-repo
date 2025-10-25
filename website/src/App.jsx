import { useState } from 'react'
import './App.css'
import { supabase } from './lib/supabaseClient.js'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage('')
    setStatusType('')

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setStatusMessage('Passwords do not match.')
      setStatusType('error')
      return
    }

    setIsSubmitting(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) {
          throw error
        }

        setStatusMessage('Signed in successfully. Session details are available in the Supabase dashboard.')
        setStatusType('success')
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        })

        if (error) {
          throw error
        }

        setStatusMessage('Signup successful. Check your email for confirmation instructions.')
        setStatusType('success')
      }
    } catch (error) {
      setStatusMessage(error.message || 'Unexpected error from Supabase.')
      setStatusType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-container">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {statusMessage && (
          <div className={`status-message ${statusType}`}>
            {statusMessage}
          </div>
        )}

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="toggle-btn"
              disabled={isSubmitting}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
