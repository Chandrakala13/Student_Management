import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import authService from '../services/authService'

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      const isAuth = authService.isAuthenticated()
      
      if (!isAuth) {
        setLoading(false)
        setAuthenticated(false)
        return
      }

      // Check if token is expired
      const isExpired = authService.checkTokenExpiration()
      
      if (isExpired) {
        setLoading(false)
        setAuthenticated(false)
        return
      }

      // User is authenticated
      setAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
