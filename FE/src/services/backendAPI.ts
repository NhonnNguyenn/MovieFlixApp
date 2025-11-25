// THAY localhost BẰNG IP 192.168.1.70
const BACKEND_API_URL = 'http://192.168.1.70:3000/api';

// Backend API calls
export const backendAPI = {
  // Register new user
  async register(email: string, password: string, username: string) {
    try {
      console.log('Register API call to:', `${BACKEND_API_URL}/auth/register`);
      const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });
      const result = await response.json();
      console.log('Register response:', result);
      return result;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Login user
  async login(email: string, password: string) {
    try {
      console.log('Login API call to:', `${BACKEND_API_URL}/auth/login`);
      const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      console.log('Login response:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get user profile - SỬA ENDPOINT TỪ /auth/me THÀNH /auth/profile
  async getProfile(token: string) {
    try {
      console.log('Get profile API call to:', `${BACKEND_API_URL}/auth/profile`);
      const response = await fetch(`${BACKEND_API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Profile response status:', response.status);
      const result = await response.json();
      console.log('Profile response data:', result);
      
      return result;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};