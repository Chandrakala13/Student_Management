const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class StudentService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/students`;
  }

  async request(url, options = {}) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        headers,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check if the backend server is running.');
      }
      throw error;
    }
  }

  async getStudents(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const url = `${this.baseUrl}?${params}`;
    return this.request(url);
  }

  async getStudentById(id) {
    const url = `${this.baseUrl}/${id}`;
    return this.request(url);
  }

  async createStudent(studentData) {
    const url = this.baseUrl;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id, studentData) {
    const url = `${this.baseUrl}/${id}`;
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id) {
    const url = `${this.baseUrl}/${id}`;
    return this.request(url, {
      method: 'DELETE',
    });
  }
}

export default new StudentService();
