// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
// import { createClient } from '@supabase/supabase-js'
// import './App.css'

// // Vite uses import.meta.env instead of process.env
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )

// function App() {
//   return (
//     <div className="App">
//       <h1>Supabase Auth Demo</h1>
//       <Auth
//         supabaseClient={supabase}
//         appearance={{ theme: ThemeSupa }}
//         theme="dark"
//       />
//     </div>
//   )
// }

// export default App

import { useState } from 'react'
import './App.css'

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        setStatusMessage('Demo: Signed in successfully! (This is a demo - no real authentication)')
        setStatusType('success')
        setIsAuthenticated(true)
      } else {
        setStatusMessage('Demo: Signup successful! (This is a demo - no real authentication)')
        setStatusType('success')
        setIsAuthenticated(true)
      }
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setFormData({ email: '', password: '', confirmPassword: '' })
    setStatusMessage('')
    setStatusType('')
  }

  if (isAuthenticated) {
    return (
      <div className="app-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome to I-Eat!</h1>
          <p className="auth-subtitle">Hello {formData.email}!</p>
          <p className="demo-notice">🎉 This is a demo version - no real authentication required!</p>
          <button onClick={handleSignOut} className="submit-btn">
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
        </p>
        <p className="demo-notice">🎉 Demo Mode - No real Supabase connection required!</p>

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
