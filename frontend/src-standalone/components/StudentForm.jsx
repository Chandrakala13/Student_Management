import React, { useState, useEffect } from 'react'
import Button from './Button'

// This demonstrates useState, useEffect, and form handling
const StudentForm = ({ 
  initialData = null, 
  onSubmit, 
  isLoading = false,
  mode = 'add' 
}) => {
  // useState for form data management
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: ''
  })
  
  // useState for validation errors
  const [errors, setErrors] = useState({})

  // useEffect to populate form when editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        age: initialData.age || '',
        course: initialData.course || ''
      })
    }
  }, [initialData, mode])

  // This demonstrates closures - validateForm captures current formData
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.age) {
      newErrors.age = 'Age is required'
    } else {
      const ageNum = parseInt(formData.age)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
        newErrors.age = 'Age must be between 1 and 150'
      }
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course is required'
    } else if (formData.course.trim().length < 2) {
      newErrors.course = 'Course must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // This demonstrates closures - the handler captures the field name
  const handleInputChange = (fieldName) => (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        age: parseInt(formData.age)
      }
      onSubmit(submitData)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      course: ''
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Name Field */}
        <div className="form-group">
          <label 
            htmlFor="name" 
            className="form-label"
          >
            Name <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Enter student name"
            className={`form-input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isLoading}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Age Field */}
        <div className="form-group">
          <label 
            htmlFor="age" 
            className="form-label"
          >
            Age <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange('age')}
            placeholder="Enter age"
            min="1"
            max="150"
            className={`form-input ${errors.age ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isLoading}
            aria-invalid={errors.age ? 'true' : 'false'}
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {errors.age && (
            <p id="age-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.age}
            </p>
          )}
        </div>

        {/* Course Field */}
        <div className="form-group">
          <label 
            htmlFor="course" 
            className="form-label"
          >
            Course <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange('course')}
            placeholder="Enter course"
            className={`form-input ${errors.course ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isLoading}
            aria-invalid={errors.course ? 'true' : 'false'}
            aria-describedby={errors.course ? 'course-error' : undefined}
          />
          {errors.course && (
            <p id="course-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.course}
            </p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant={mode === 'edit' ? 'success' : 'primary'}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : mode === 'edit' ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </form>
  )
}

export default StudentForm
