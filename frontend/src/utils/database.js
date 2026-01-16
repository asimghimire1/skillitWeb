// Simple database using localStorage for user management
const DB_KEY = 'skillit_users_db';

export const userDB = {
  // Initialize database
  init: () => {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
  },

  // Register a new user
  register: (email, fullname, password, role) => {
    const users = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Add new user
    const newUser = {
      id: Date.now(),
      email,
      fullname,
      password, // Note: In production, never store passwords in plain text
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    return { success: true, user: newUser };
  },

  // Get user by email
  getUserByEmail: (email) => {
    const users = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    return users.find(u => u.email === email);
  },

  // Verify login
  verifyLogin: (email, password) => {
    const user = userDB.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    return { success: true, user };
  },

  // Get all users
  getAllUsers: () => {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  }
};

// Initialize database on import
userDB.init();

export default userDB;
