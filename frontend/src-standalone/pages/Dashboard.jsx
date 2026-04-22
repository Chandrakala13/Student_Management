import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StudentCard from '../components/StudentCard'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import studentService from '../services/studentService'

// This demonstrates useEffect for data loading and useState for state management
const Dashboard = () => {
  // useState hooks for managing component state
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  // useEffect hook - runs once when component mounts
  useEffect(() => {
    loadStudents()
  }, [])

  // This demonstrates async/await with real API calls
  const loadStudents = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Real API call to backend
      const response = await studentService.getStudents()
      
      // Handle different response formats from backend
      if (response.data && Array.isArray(response.data)) {
        setStudents(response.data)
      } else if (response.students && Array.isArray(response.students)) {
        setStudents(response.students)
      } else {
        setStudents([])
      }
    } catch (err) {
      setError(err.message)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  // This demonstrates closures - handleDelete captures the student id
  const handleDelete = async (studentId) => {
    try {
      setDeleteLoading(studentId)
      setError('')
      
      // Real API call to backend
      await studentService.deleteStudent(studentId)
      
      // Optimistic UI update - remove student immediately
      setStudents(prev => prev.filter(student => student._id !== studentId))
      setSuccess('Student deleted successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      // Reload students to restore correct state if deletion failed
      loadStudents()
    } finally {
      setDeleteLoading(null)
    }
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="page-transition">
      {/* Navigation */}
      <Navbar />
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">
              Manage all your students in one place ({students.length} total)
            </p>
          </div>
          <Link to="/add">
            <Button variant="primary" className="w-full sm:w-auto">
              + Add New Student
            </Button>
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="loading-spinner mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && students.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Students Yet</h2>
          <p className="text-gray-500 mb-6">Get started by adding your first student!</p>
          <Link to="/add">
            <Button variant="primary">Add Your First Student</Button>
          </Link>
        </div>
      )}

      {/* Students Grid */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleDelete}
              isLoading={deleteLoading === student.id}
            />
          ))}
        </div>
      )}

      {/* Statistics Section */}
      {!loading && students.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Age</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.round(students.reduce((sum, s) => sum + s.age, 0) / students.length)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {[...new Set(students.map(s => s.course))].length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {students.filter(s => {
                      const created = new Date(s.createdAt)
                      const thisMonth = new Date()
                      return created.getMonth() === thisMonth.getMonth() && 
                             created.getFullYear() === thisMonth.getFullYear()
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Dashboard
