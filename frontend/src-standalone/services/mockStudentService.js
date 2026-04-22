// Mock data service - simulates API calls with async/await and setTimeout
// This demonstrates how we would structure API calls for future backend integration

// Initial mock data
let mockStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    age: 20,
    course: 'Computer Science',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Bob Smith',
    age: 22,
    course: 'Mathematics',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 3,
    name: 'Carol Williams',
    age: 19,
    course: 'Physics',
    createdAt: '2024-02-01T09:45:00Z'
  },
  {
    id: 4,
    name: 'David Brown',
    age: 21,
    course: 'Chemistry',
    createdAt: '2024-02-10T16:20:00Z'
  },
  {
    id: 5,
    name: 'Emma Davis',
    age: 20,
    course: 'Biology',
    createdAt: '2024-02-15T11:30:00Z'
  }
]

let nextId = 6

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Simulate random errors (10% chance)
const simulateRandomError = () => {
  if (Math.random() < 0.1) {
    throw new Error('Network error: Please try again later')
  }
}

class MockStudentService {
  // Simulate GET /api/students
  async getStudents() {
    await delay(800) // Simulate network delay
    simulateRandomError()
    
    return {
      success: true,
      data: [...mockStudents],
      message: 'Students retrieved successfully'
    }
  }

  // Simulate GET /api/students/:id
  async getStudentById(id) {
    await delay(500)
    simulateRandomError()
    
    const student = mockStudents.find(s => s.id === parseInt(id))
    
    if (!student) {
      throw new Error('Student not found')
    }
    
    return {
      success: true,
      data: student,
      message: 'Student retrieved successfully'
    }
  }

  // Simulate POST /api/students
  async createStudent(studentData) {
    await delay(1000)
    simulateRandomError()
    
    // Validate data
    if (!studentData.name || !studentData.age || !studentData.course) {
      throw new Error('Missing required fields')
    }
    
    const newStudent = {
      id: nextId++,
      ...studentData,
      createdAt: new Date().toISOString()
    }
    
    mockStudents.push(newStudent)
    
    return {
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    }
  }

  // Simulate PUT /api/students/:id
  async updateStudent(id, studentData) {
    await delay(900)
    simulateRandomError()
    
    const studentIndex = mockStudents.findIndex(s => s.id === parseInt(id))
    
    if (studentIndex === -1) {
      throw new Error('Student not found')
    }
    
    // Validate data
    if (!studentData.name || !studentData.age || !studentData.course) {
      throw new Error('Missing required fields')
    }
    
    mockStudents[studentIndex] = {
      ...mockStudents[studentIndex],
      ...studentData,
      updatedAt: new Date().toISOString()
    }
    
    return {
      success: true,
      data: mockStudents[studentIndex],
      message: 'Student updated successfully'
    }
  }

  // Simulate DELETE /api/students/:id
  async deleteStudent(id) {
    await delay(600)
    simulateRandomError()
    
    const studentIndex = mockStudents.findIndex(s => s.id === parseInt(id))
    
    if (studentIndex === -1) {
      throw new Error('Student not found')
    }
    
    const deletedStudent = mockStudents[studentIndex]
    mockStudents.splice(studentIndex, 1)
    
    return {
      success: true,
      data: deletedStudent,
      message: 'Student deleted successfully'
    }
  }

  // Utility method to reset mock data (useful for testing)
  resetMockData() {
    mockStudents = [
      {
        id: 1,
        name: 'Alice Johnson',
        age: 20,
        course: 'Computer Science',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Bob Smith',
        age: 22,
        course: 'Mathematics',
        createdAt: '2024-01-20T14:15:00Z'
      },
      {
        id: 3,
        name: 'Carol Williams',
        age: 19,
        course: 'Physics',
        createdAt: '2024-02-01T09:45:00Z'
      },
      {
        id: 4,
        name: 'David Brown',
        age: 21,
        course: 'Chemistry',
        createdAt: '2024-02-10T16:20:00Z'
      },
      {
        id: 5,
        name: 'Emma Davis',
        age: 20,
        course: 'Biology',
        createdAt: '2024-02-15T11:30:00Z'
      }
    ]
    nextId = 6
  }
}

export default new MockStudentService()
