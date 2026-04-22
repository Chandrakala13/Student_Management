import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import StudentForm from '../components/StudentForm'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import studentService from '../services/studentService'

// This demonstrates useEffect for data loading, useState for state management,
// and how to handle both create and edit modes in one component
const FormPage = ({ mode }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  
  // useState hooks for managing component state
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [notFound, setNotFound] = useState(false)

  // useEffect hook - runs when component mounts or when id/mode changes
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadStudent()
    } else {
      setFetchLoading(false)
    }
  }, [mode, id])

  // This demonstrates async/await with real API calls
  const loadStudent = async () => {
    try {
      setFetchLoading(true)
      setError('')
      
      // Real API call to backend
      const student = await studentService.getStudentById(id)
      
      setInitialData(student)
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('404')) {
        setNotFound(true)
      } else {
        setError(err.message)
      }
    } finally {
      setFetchLoading(false)
    }
  }

  // This demonstrates closures - handleSubmit captures the mode and navigate
  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (mode === 'edit') {
        // Real API call for update
        await studentService.updateStudent(id, formData)
      } else {
        // Real API call for create
        await studentService.createStudent(formData)
      }

      setSuccess(`Student ${mode === 'edit' ? 'updated' : 'created'} successfully!`)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  // Loading state for edit mode
  if (fetchLoading) {
    return (
      <div className="page-transition max-w-2xl mx-auto">
        <Navbar />
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Edit Student</h1>
            <Link to="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </header>
        
        <div className="card text-center py-12">
          <div className="loading-spinner mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    )
  }

  // Not found state for edit mode
  if (notFound) {
    return (
      <div className="page-transition max-w-2xl mx-auto">
        <Navbar />
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Student Not Found</h1>
            <Link to="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </header>
        
        <div className="card text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Student Not Found</h2>
          <p className="text-gray-500 mb-6">
            The student you're trying to edit doesn't exist or has been deleted.
          </p>
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-transition max-w-2xl mx-auto">
      <Navbar />
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {mode === 'edit' ? 'Edit Student' : 'Add New Student'}
            </h1>
            <p className="text-gray-600">
              {mode === 'edit' 
                ? 'Update the student information below' 
                : 'Fill in the details to add a new student'
              }
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg flex justify-between items-center" role="alert">
          <span>{error}</span>
          <button 
            onClick={clearMessages}
            className="text-red-600 hover:text-red-800 font-bold text-xl"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg flex justify-between items-center" role="status">
          <span>{success}</span>
          <button 
            onClick={clearMessages}
            className="text-green-600 hover:text-green-800 font-bold text-xl"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      {/* Form */}
      <div className="card">
        <StudentForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={loading}
          mode={mode}
        />
      </div>

      {/* Help Section */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {mode === 'edit' ? 'Editing Tips' : 'Quick Tips'}
        </h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">-</span>
            <p className="text-gray-600">
              All fields marked with <span className="text-red-500 font-medium">*</span> are required
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">-</span>
            <p className="text-gray-600">
              Age must be a number between 1 and 150 years
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">-</span>
            <p className="text-gray-600">
              Name and course must be at least 2 characters long
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">-</span>
            <p className="text-gray-600">
              {mode === 'edit' 
                ? 'After successful update, you\'ll be redirected to the dashboard'
                : 'After successful creation, you\'ll be redirected to the dashboard'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info for Edit Mode */}
      {mode === 'edit' && initialData && (
        <div className="card mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Name</p>
              <p className="font-medium text-gray-800">{initialData.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Age</p>
              <p className="font-medium text-gray-800">{initialData.age}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Course</p>
              <p className="font-medium text-gray-800">{initialData.course}</p>
            </div>
          </div>
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Student Since</p>
            <p className="font-medium text-gray-800">
              {new Date(initialData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormPage
