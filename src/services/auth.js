export default {
  getToken() {
    return localStorage.getItem('token');
  },
  
  setToken(token) {
    // Validate token before storing
    if (typeof token !== 'string' || token.trim() === '') {
      console.error('Invalid token format');
      return false;
    }
    localStorage.setItem('token', token);
    return true;
  },
  
  removeToken() {
    localStorage.removeItem('token');
  },
  
  getUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.removeUser();
      return null;
    }
  },
  
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  removeUser() {
    localStorage.removeItem('user');
  },
  
  logout() {
    this.removeToken();
    this.removeUser();
  },
  
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }
};