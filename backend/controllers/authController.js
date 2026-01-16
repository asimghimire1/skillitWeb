const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');

// Zod validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  fullname: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['learner', 'mentor'], { errorMap: () => ({ message: 'Role must be either learner or mentor' }) })
});

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      // Validate input with Zod
      const validatedData = registerSchema.parse(req.body);
      const { email, fullname, password, role } = validatedData;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create(email, fullname, hashedPassword, role);

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          role: user.role
        },
        token
      });
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        return res.status(400).json({ success: false, message: errorMessages.join(', ') });
      }
      console.error('Registration error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      // Validate input with Zod
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          role: user.role
        },
        token
      });
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        return res.status(400).json({ success: false, message: errorMessages.join(', ') });
      }
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Get current user
  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = AuthController;
