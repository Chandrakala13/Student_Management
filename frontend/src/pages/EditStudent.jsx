import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import studentService from '../services/studentService'

const EditStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [notFound, setNotFound] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadStudent()
  }, [id])

  const loadStudent = async () => {
    try {
      setFetchLoading(true)
      setError('')
      const student = await studentService.getStudentById(id)
      
      setFormData({
        name: student.name,
        age: student.age.toString(),
        course: student.course
      })
    } catch (err) {
      if (err.message.includes('404') || err.message.includes('not found')) {
        setNotFound(true)
      } else {
        setError(err.message)
      }
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) {
      errors.push('Name is required')
    } else if (formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    if (!formData.age) {
      errors.push('Age is required')
    } else {
      const ageNum = parseInt(formData.age)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
        errors.push('Age must be a number between 1 and 150')
      }
    }

    if (!formData.course.trim()) {
      errors.push('Course is required')
    } else if (formData.course.trim().length < 2) {
      errors.push('Course must be at least 2 characters long')
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

      const studentData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        course: formData.course.trim()
      }

      await studentService.updateStudent(id, studentData)
      setSuccess('Student updated successfully!')
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/')
      }, 1500)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Student</h2>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="card">
          <div className="text-center py-8">
            <div className="loading-spinner"></div>
            <p className="mt-2 text-gray-600">Loading student data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Student Not Found</h2>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="card">
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-4">
              The student you're trying to edit doesn't exist or has been deleted.
            </p>
            <Link to="/" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Student</h2>
        <Link to="/" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="card">
        {/* Messages */}
        {error && (
          <div className="message message-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="message message-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter student name"
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            {/* Age Field */}
            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter age"
                min="1"
                max="150"
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            {/* Course Field */}
            <div className="form-group">
              <label htmlFor="course" className="form-label">
                Course <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                placeholder="Enter course"
                className="form-input"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Updating...
                </>
              ) : (
                'Update Student'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Editing Tips</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">-</span>
            All fields marked with <span className="text-red-500">*</span> are required
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">-</span>
            Age must be between 1 and 150 years
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">-</span>
            Name and course must be at least 2 characters long
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">-</span>
            After successful update, you'll be redirected to the dashboard
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EditStudent
