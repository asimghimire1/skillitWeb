// API service for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle 401 responses
const handleUnauthorized = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
  // Dispatch a custom event that AuthContext can listen to
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
};

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

      // Handle unauthorized response
      if (response.status === 401) {
        handleUnauthorized();
        return { success: false, message: 'Token expired or invalid' };
      }

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
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
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

  async getTeacherEarnings(teacherId) {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/teacher/${teacherId}/earnings`);
      return await response.json();
    } catch (error) {
      console.error('Get earnings error:', error);
      return null;
    }
  },

  // Sessions
  async getTeacherSessions(teacherId) {
    try {
      console.log('[apiService] Fetching sessions for teacher:', teacherId);
      const response = await fetch(`${API_BASE_URL}/sessions/teacher/${teacherId}`);
      const data = await response.json();
      console.log('[apiService] Sessions response:', data);
      return data;
    } catch (error) {
      console.error('Get sessions error:', error);
      return [];
    }
  },

  async createSession(sessionData) {
    try {
      console.log('[apiService] Creating session:', sessionData);
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      const data = await response.json();
      console.log('[apiService] Create session response:', data);
      return data;
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
  },

  // ═══════════════════════════════════════════════════════════════
  // STUDENT API FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  // Student Stats & Profile
  async getStudentStats(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/student/${studentId}`);
      const data = await response.json();
      // Return mock data if API not ready
      return data || {
        hoursLearned: 0,
        sessionsAttended: 0,
        contentWatched: 0,
        credits: 0
      };
    } catch (error) {
      console.error('Get student stats error:', error);
      return {
        hoursLearned: 0,
        sessionsAttended: 0,
        contentWatched: 0,
        credits: 0
      };
    }
  },

  async getStudentBalance(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/balance`);
      const data = await response.json();
      return data?.credits || 0;
    } catch (error) {
      console.error('Get balance error:', error);
      return 0;
    }
  },

  async addCredits(studentId, amount) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      return await response.json();
    } catch (error) {
      console.error('Add credits error:', error);
      return { success: false };
    }
  },

  async deductCredits(studentId, amount) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/credits/deduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      return await response.json();
    } catch (error) {
      console.error('Deduct credits error:', error);
      return { success: false };
    }
  },

  // Browse Content (from all teachers)
  async getAvailableSessions(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/sessions${params ? `?${params}` : ''}`);
      return await response.json();
    } catch (error) {
      console.error('Get available sessions error:', error);
      return [];
    }
  },

  async getSessionsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/category/${category}`);
      return await response.json();
    } catch (error) {
      console.error('Get sessions by category error:', error);
      return [];
    }
  },

  async getAllContent() {
    try {
      console.log('[apiService] Fetching content from:', `${API_BASE_URL}/content`);
      const response = await fetch(`${API_BASE_URL}/content`);
      console.log('[apiService] Response status:', response.status);

      if (!response.ok) {
        console.error('[apiService] Failed to fetch content:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      console.log('[apiService] getAllContent response:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get all content error:', error);
      return [];
    }
  },

  async getContentByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/category/${category}`);
      return await response.json();
    } catch (error) {
      console.error('Get content by category error:', error);
      return [];
    }
  },

  async getTeachers() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/teachers`);
      return await response.json();
    } catch (error) {
      console.error('Get teachers error:', error);
      return [];
    }
  },

  async getRecentPosts(limit = 2) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Get recent posts error:', error);
      return [];
    }
  },

  async searchAll(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return { sessions: [], content: [], teachers: [] };
    }
  },

  // Enrollment & Unlocking
  async enrollSession(sessionId, studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Enroll session error:', error);
      return { success: false };
    }
  },

  async unlockContent(contentId, studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${contentId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Unlock content error:', error);
      return { success: false };
    }
  },

  // Join content (free, paid, or bid)
  async joinContent(contentId, studentId, type, bidId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/content/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, type, bidId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Join content error:', error);
      return { success: false };
    }
  },

  async getStudentEnrollments(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/enrollments`);
      return await response.json();
    } catch (error) {
      console.error('Get enrollments error:', error);
      return [];
    }
  },

  async getStudentUnlockedContent(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/content`);
      return await response.json();
    } catch (error) {
      console.error('Get unlocked content error:', error);
      return [];
    }
  },

  // Student Bidding
  async submitBid(bidData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData),
      });
      return await response.json();
    } catch (error) {
      console.error('Submit bid error:', error);
      return { success: false };
    }
  },

  async getStudentBids(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/student/${studentId}`);
      return await response.json();
    } catch (error) {
      console.error('Get student bids error:', error);
      return [];
    }
  },

  async respondToCounter(bidId, accept) {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/${bidId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accept }),
      });
      return await response.json();
    } catch (error) {
      console.error('Respond to counter error:', error);
      return { success: false };
    }
  },

  async cancelBid(bidId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/${bidId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Cancel bid error:', error);
      return { success: false };
    }
  },

  // Teacher Bid Requests (for teacher dashboard)
  async getBidRequests(teacherId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/teacher/${teacherId}`);
      return await response.json();
    } catch (error) {
      console.error('Get bid requests error:', error);
      return [];
    }
  },

  async respondToBid(bidId, response) {
    try {
      const res = await fetch(`${API_BASE_URL}/bids/${bidId}/teacher-respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });
      return await res.json();
    } catch (error) {
      console.error('Respond to bid error:', error);
      return { success: false };
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICATIONS API
  // ═══════════════════════════════════════════════════════════════

  async getNotifications(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  },

  async getUnreadNotificationCount(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}/unread-count`);
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  },

  async markNotificationRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      return await response.json();
    } catch (error) {
      console.error('Mark read error:', error);
      return { success: false };
    }
  },

  async markAllNotificationsRead(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}/read-all`, {
        method: 'PUT',
      });
      return await response.json();
    } catch (error) {
      console.error('Mark all read error:', error);
      return { success: false };
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete notification error:', error);
      return { success: false };
    }
  }
};

export default apiService;
