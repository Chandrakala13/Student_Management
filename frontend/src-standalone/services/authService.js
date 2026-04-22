// Authentication Service - Handles JWT tokens and auth API calls
// This service manages user authentication state and token storage

class AuthService {
  constructor() {
    this.token = this.getToken()
    this.user = this.getUser()
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token')
  }

  // Get user from localStorage
  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  // Save token and user to localStorage
  setAuthData(token, user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.token = token
    this.user = user
  }

  // Clear auth data (logout)
  clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.token = null
    this.user = null
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token
  }

  // Get authorization header for API calls
  getAuthHeader() {
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` }
    }
    return {}
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        this.setAuthData(data.data.token, data.data.user)
        return { success: true, user: data.data.user }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Register user
  async signup(name, email, password) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        this.setAuthData(data.data.token, data.data.user)
        return { success: true, user: data.data.user }
      } else {
        return { success: false, message: data.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update user data in localStorage
        this.user = data.data.user
        localStorage.setItem('user', JSON.stringify(data.data.user))
        return { success: true, user: data.data.user }
      } else {
        return { success: false, message: data.message || 'Failed to fetch profile' }
      }
    } catch (error) {
      console.error('Get profile error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Update user profile
  async updateProfile(name) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify({ name })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update user data in localStorage
        this.user = data.data.user
        localStorage.setItem('user', JSON.stringify(data.data.user))
        return { success: true, user: data.data.user }
      } else {
        return { success: false, message: data.message || 'Failed to update profile' }
      }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Logout user
  logout() {
    this.clearAuthData()
  }

  // Check if token is expired (basic check)
  isTokenExpired() {
    if (!this.token) return true

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true // If token is invalid, consider it expired
    }
  }

  // Auto-logout if token is expired
  checkTokenExpiration() {
    if (this.isTokenExpired()) {
      this.logout()
      return true
    }
    return false
  }
}

export default new AuthService()
