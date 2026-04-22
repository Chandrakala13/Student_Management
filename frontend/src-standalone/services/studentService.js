// Real API Service Layer - Connects to Node.js + Express + MongoDB backend
// Replaces mockStudentService.js with actual API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class StudentService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/students`;
  }

  // Get auth header
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Helper method for making API requests
  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
          ...options.headers,
        },
        ...options,
      });

      // Handle different response statuses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // GET /api/students - Fetch all students
  async getStudents(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const url = `${this.baseUrl}?${params}`;
    return this.request(url);
  }

  // GET /api/students/:id - Fetch single student by ID
  async getStudentById(id) {
    const url = `${this.baseUrl}/${id}`;
    return this.request(url);
  }

  // POST /api/students - Create new student
  async createStudent(studentData) {
    const url = this.baseUrl;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  // PUT /api/students/:id - Update existing student
  async updateStudent(id, studentData) {
    const url = `${this.baseUrl}/${id}`;
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  // DELETE /api/students/:id - Delete student
  async deleteStudent(id) {
    const url = `${this.baseUrl}/${id}`;
    return this.request(url, {
      method: 'DELETE',
    });
  }

  // Retry mechanism for failed requests
  async requestWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.request(url, options);
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (error.message.includes('404') || error.message.includes('validation')) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError;
  }
}

export default new StudentService();
