import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    const errors = []

    // Name validation
    if (!formData.name.trim()) {
      errors.push('Name is required')
    } else if (formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!formData.email.trim()) {
      errors.push('Email is required')
    } else if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address')
    }

    // Password validation
    if (!formData.password) {
      errors.push('Password is required')
    } else if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.push('Please confirm your password')
    } else if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match')
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      // Make API call to signup
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store JWT token in localStorage
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        setSuccess('Account created successfully! Redirecting...')
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center" role="alert">
                <span>{error}</span>
                <button 
                  type="button"
                  onClick={clearMessages}
                  className="text-red-600 hover:text-red-800 font-bold text-xl"
                  aria-label="Close message"
                >
                  ×
                </button>
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex justify-between items-center" role="status">
                <span>{success}</span>
                <button 
                  type="button"
                  onClick={clearMessages}
                  className="text-green-600 hover:text-green-800 font-bold text-xl"
                  aria-label="Close message"
                >
                  ×
                </button>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="form-label">
                Full Name <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange('name')}
                className="form-input"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                Email address <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange('email')}
                className="form-input"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                Password <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange('password')}
                className="form-input"
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className="form-input"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium text-gray-900 mb-2">Password Requirements:</h4>
              <ul className="space-y-1">
                <li>At least 6 characters long</li>
                <li>Can include letters, numbers, and symbols</li>
                <li>Passwords are securely encrypted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
