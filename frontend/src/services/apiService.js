// API service for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Register a new user
  async register(email, fullname, password, role) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fullname, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.fullname);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.fullname);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, message: 'No token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  },

  // Stats
  async getTeacherStats(teacherId) {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/teacher/${teacherId}`);
      return await response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  },

  // Sessions
  async getTeacherSessions(teacherId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/teacher/${teacherId}`);
      return await response.json();
    } catch (error) {
      console.error('Get sessions error:', error);
      return [];
    }
  },

  async createSession(sessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create session error:', error);
      return null;
    }
  },

  async updateSession(sessionId, sessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update session error:', error);
      return null;
    }
  },

  async deleteSession(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete session error:', error);
      return { success: false };
    }
  },

  // Content
  async getTeacherContent(teacherId) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/teacher/${teacherId}`);
      return await response.json();
    } catch (error) {
      console.error('Get content error:', error);
      return null;
    }
  },

  async uploadContent(contentData) {
    try {
      const isFormData = contentData instanceof FormData;
      const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? contentData : JSON.stringify(contentData);

      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: headers,
        body: body,
      });
      return await response.json();
    } catch (error) {
      console.error('Upload content error:', error);
      return null;
    }
  },

  async updateContent(contentId, contentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update content error:', error);
      return null;
    }
  },

  async deleteContent(contentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${contentId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete content error:', error);
      return { success: false };
    }
  },

  // Posts
  async getTeacherPosts(teacherId) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/teacher/${teacherId}`);
      return await response.json();
    } catch (error) {
      console.error('Get posts error:', error);
      return [];
    }
  },

  async createPost(postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create post error:', error);
      return null;
    }
  },

  async updatePost(postId, postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (response.status === 403) {
        return { error: 'Edit time limit exceeded (30 minutes)' };
      }
      return await response.json();
    } catch (error) {
      console.error('Update post error:', error);
      return null;
    }
  },

  async deletePost(postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete post error:', error);
      return { success: false };
    }
  }
};

export default apiService;
