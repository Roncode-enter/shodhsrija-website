import ApiService from './api';

const authEndpoint = '/auth/';

const auth = {
  register: async (userData) => {
    // userData = { username, email, password, first_name, last_name }
    try {
      const response = await ApiService.post(authEndpoint + 'register/', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    // credentials = { username, password }
    try {
      const response = await ApiService.post(authEndpoint + 'login/', credentials);
      // Store token if received
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await ApiService.post(authEndpoint + 'logout/');
      localStorage.removeItem('authToken');
    } catch (error) {
      throw error;
    }
  },

  fetchCurrentUser: async () => {
    try {
      const response = await ApiService.get(authEndpoint + 'me/');
      return response.user;
    } catch (error) {
      throw error;
    }
  }
};

export default auth;
