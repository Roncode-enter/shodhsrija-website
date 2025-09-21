import { useState, useEffect, useContext, createContext } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await ApiService.get('/auth/me/');
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await ApiService.post('/auth/login/', credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      await fetchUser();
    }
    return response;
  };

  const logout = async () => {
    await ApiService.post('/auth/logout/');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
