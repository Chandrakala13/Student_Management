const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class AuthService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/auth`;
  }

  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
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

  async login(credentials) {
    const url = `${this.baseUrl}/login`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    const url = `${this.baseUrl}/signup`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    const url = `${this.baseUrl}/profile`;
    const token = localStorage.getItem('token');
    return this.request(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async updateProfile(userData) {
    const url = `${this.baseUrl}/profile`;
    const token = localStorage.getItem('token');
    return this.request(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
