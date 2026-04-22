import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import studentService from '../services/studentService'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    loadStudents()
  }, [currentPage, search])

  const loadStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await studentService.getStudents(currentPage, 10, search)
      setStudents(response.data)
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (err) {
      setError(err.message)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      setDeleteLoading(id)
      await studentService.deleteStudent(id)
      
      // Optimistic UI update - remove student immediately
      setStudents(prev => prev.filter(student => student._id !== id))
      setSuccess('Student deleted successfully!')
      
      // Reload after a short delay to ensure consistency
      setTimeout(() => {
        loadStudents()
      }, 500)
    } catch (err) {
      setError(err.message)
      // Reload to restore correct state if deletion failed
      loadStudents()
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadStudents()
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header with User Info and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">All Students</h2>
          <span className="text-sm text-gray-600">
            Welcome, {user?.name || user?.email || 'User'}
          </span>
        </div>
        <div className="flex gap-3">
          <Link to="/create" className="btn btn-primary">
            + Add New Student
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="message message-error">
          {error}
          <button onClick={clearMessages} className="ml-4 text-red-600 hover:text-red-800">
            ×
          </button>
        </div>
      )}
      
      {success && (
        <div className="message message-success">
          {success}
          <button onClick={clearMessages} className="ml-4 text-green-600 hover:text-green-800">
            ×
          </button>
        </div>
      )}

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input flex-1"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {search && (
            <button 
              type="button" 
              onClick={() => {
                setSearch('')
                setCurrentPage(1)
              }}
              className="btn btn-secondary"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Students Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner"></div>
            <p className="mt-2 text-gray-600">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {search ? 'No students found matching your search.' : 'No students found.'}
            </p>
            <p className="text-gray-400 mt-2">
              {search ? 'Try a different search term or' : 'Get started by'}{' '}
              <Link to="/create" className="text-blue-600 hover:text-blue-800 font-semibold">
                adding a new student
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Age</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.age}</td>
                      <td className="py-3 px-4 text-gray-600">{student.course}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/edit/${student._id}`}
                            className="btn btn-warning text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(student._id)}
                            disabled={deleteLoading === student._id}
                            className="btn btn-danger text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteLoading === student._id ? (
                              <>
                                <div className="loading-spinner"></div>
                                Deleting...
                              </>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn ${
                      currentPage === page 
                        ? 'btn-primary' 
                        : 'btn-secondary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
