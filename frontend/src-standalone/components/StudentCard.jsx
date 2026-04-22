import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

// This demonstrates props and component reusability
const StudentCard = ({ 
  student, 
  onDelete, 
  isLoading = false 
}) => {
  // This demonstrates closures - the handleDelete function captures the student id
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      onDelete(student._id)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="student-card bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {student.name}
          </h3>
          <div className="space-y-1">
            <p className="text-gray-600">
              <span className="font-medium">Age:</span> {student.age}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Course:</span> {student.course}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Joined:</span> {formatDate(student.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {student.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Link 
          to={`/edit/${student._id}`}
          className="flex-1"
        >
          <Button 
            variant="warning" 
            size="small" 
            className="w-full"
          >
            Edit
          </Button>
        </Link>
        <Button 
          variant="danger" 
          size="small" 
          onClick={handleDelete}
          loading={isLoading}
          disabled={isLoading}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default StudentCard
