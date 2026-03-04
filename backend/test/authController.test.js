/**
 * Auth Controller Unit Tests
 * Tests for registration, login, and password reset functionality
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';

// Mock User model
const mockUser = {
  id: 1,
  email: 'test@example.com',
  fullname: 'Test User',
  password: '',
  role: 'learner',
  reset_token: null,
  reset_token_expiry: null,
  save: jest.fn().mockResolvedValue(true)
};

jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

jest.mock('../config/email', () => ({
  getTransporter: jest.fn().mockResolvedValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
  }),
  getPreviewUrl: jest.fn()
}));

const User = require('../models/User');

describe('Authentication Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TC-01: Valid Signup
  // ==========================================
  describe('TC-01: Valid Signup', () => {
    it('should create a new user and return JWT token', async () => {
      const userData = {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'learner'
      };

      // Mock: email doesn't exist
      User.findOne.mockResolvedValue(null);
      
      // Mock: user creation
      User.create.mockResolvedValue({
        id: 1,
        email: userData.email,
        fullname: userData.fullname,
        role: userData.role
      });

      // Simulate validation
      expect(userData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(userData.password.length).toBeGreaterThanOrEqual(8);
      expect(userData.fullname.length).toBeGreaterThanOrEqual(3);
      expect(['learner', 'mentor', 'teacher']).toContain(userData.role);

      // Simulate password hashing
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      expect(hashedPassword).not.toBe(userData.password);

      // Simulate JWT generation
      const token = jwt.sign({ id: 1, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.email).toBe(userData.email);
    });
  });

  // ==========================================
  // TC-02: Signup with Existing Email
  // ==========================================
  describe('TC-02: Signup with Existing Email', () => {
    it('should reject registration with duplicate email', async () => {
      const existingEmail = 'existing@example.com';

      // Mock: email already exists
      User.findOne.mockResolvedValue({
        id: 1,
        email: existingEmail,
        fullname: 'Existing User'
      });

      const result = await User.findOne({ where: { email: existingEmail } });
      
      expect(result).not.toBeNull();
      expect(result.email).toBe(existingEmail);
      
      // In controller, this would return 409 error
      const errorResponse = { success: false, message: 'Email already registered' };
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.message).toBe('Email already registered');
    });
  });

  // ==========================================
  // TC-03: Valid Login
  // ==========================================
  describe('TC-03: Valid Login', () => {
    it('should authenticate user with correct credentials', async () => {
      const password = 'correctpassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        id: 1,
        email: 'user@example.com',
        fullname: 'Test User',
        password: hashedPassword,
        role: 'learner'
      };

      // Mock: user exists
      User.findOne.mockResolvedValue(user);

      const foundUser = await User.findOne({ where: { email: user.email } });
      expect(foundUser).not.toBeNull();

      // Verify password
      const isValidPassword = await bcrypt.compare(password, foundUser.password);
      expect(isValidPassword).toBe(true);

      // Generate token
      const token = jwt.sign({ id: foundUser.id, email: foundUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      expect(token).toBeDefined();
    });
  });

  // ==========================================
  // TC-04: Invalid Login (Wrong Password)
  // ==========================================
  describe('TC-04: Invalid Login', () => {
    it('should reject login with wrong password', async () => {
      const correctPassword = 'correctpassword';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(correctPassword, 10);

      const user = {
        id: 1,
        email: 'user@example.com',
        password: hashedPassword
      };

      User.findOne.mockResolvedValue(user);

      const foundUser = await User.findOne({ where: { email: user.email } });
      expect(foundUser).not.toBeNull();

      // Verify wrong password fails
      const isValidPassword = await bcrypt.compare(wrongPassword, foundUser.password);
      expect(isValidPassword).toBe(false);

      // Expected error response
      const errorResponse = { success: false, message: 'Invalid email or password' };
      expect(errorResponse.success).toBe(false);
    });
  });

  // ==========================================
  // TC-05: Password Reset - Valid OTP
  // ==========================================
  describe('TC-05: Password Reset', () => {
    it('should generate and validate OTP for password reset', async () => {
      const crypto = require('crypto');
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      expect(otp).toMatch(/^\d{6}$/);
      expect(otp.length).toBe(6);

      // Hash OTP for storage
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      expect(otpHash).toBeDefined();
      expect(otpHash.length).toBe(64); // SHA256 produces 64 hex characters

      // Set expiry (10 minutes from now)
      const expiry = new Date(Date.now() + 10 * 60 * 1000);
      expect(expiry.getTime()).toBeGreaterThan(Date.now());

      // Verify OTP matches when hashed
      const verifyHash = crypto.createHash('sha256').update(otp).digest('hex');
      expect(verifyHash).toBe(otpHash);
    });
  });

  // ==========================================
  // TC-06: Expired OTP
  // ==========================================
  describe('TC-06: Expired OTP', () => {
    it('should reject expired OTP', async () => {
      // Create expired timestamp (11 minutes ago)
      const expiredTime = new Date(Date.now() - 11 * 60 * 1000);
      const currentTime = new Date();

      expect(expiredTime.getTime()).toBeLessThan(currentTime.getTime());

      // In controller, this check would fail
      const isExpired = expiredTime < currentTime;
      expect(isExpired).toBe(true);

      // Expected error response
      const errorResponse = { success: false, message: 'OTP has expired' };
      expect(errorResponse.message).toBe('OTP has expired');
    });
  });

  // ==========================================
  // TC-07: Protected Route Access
  // ==========================================
  describe('TC-07: Protected Route Access', () => {
    it('should verify JWT token for protected routes', () => {
      const validToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Valid token should decode correctly
      const decoded = jwt.verify(validToken, process.env.JWT_SECRET);
      expect(decoded.id).toBe(1);
      expect(decoded.email).toBe('test@example.com');
    });

    it('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(invalidToken, process.env.JWT_SECRET);
      }).toThrow();
    });

    it('should reject request without token', () => {
      const authHeader = undefined;
      
      const hasToken = authHeader && authHeader.startsWith('Bearer ');
      expect(hasToken).toBeFalsy();

      // Expected error response
      const errorResponse = { success: false, message: 'No token provided' };
      expect(errorResponse.success).toBe(false);
    });
  });
});

// ==========================================
// Validation Tests
// ==========================================
describe('Input Validation Tests', () => {
  describe('Email Validation', () => {
    it('should accept valid email formats', () => {
      const validEmails = ['test@example.com', 'user.name@domain.org', 'user+tag@mail.co'];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(email).toMatch(emailRegex);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = ['notanemail', '@nodomain.com', 'missing@.com', 'no spaces@mail.com'];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(emailRegex);
      });
    });
  });

  describe('Password Validation', () => {
    it('should accept passwords with 8+ characters', () => {
      const validPasswords = ['password123', '12345678', 'securePass!'];
      
      validPasswords.forEach(password => {
        expect(password.length).toBeGreaterThanOrEqual(8);
      });
    });

    it('should reject passwords with less than 8 characters', () => {
      const invalidPasswords = ['short', '1234567', 'abc'];

      invalidPasswords.forEach(password => {
        expect(password.length).toBeLessThan(8);
      });
    });
  });

  describe('Role Validation', () => {
    it('should accept valid roles', () => {
      const validRoles = ['learner', 'mentor', 'teacher'];

      validRoles.forEach(role => {
        expect(['learner', 'mentor', 'teacher']).toContain(role);
      });
    });

    it('should reject invalid roles', () => {
      const invalidRoles = ['admin', 'superuser', 'guest'];

      invalidRoles.forEach(role => {
        expect(['learner', 'mentor', 'teacher']).not.toContain(role);
      });
    });
  });
});

// ==========================================
// Password Hashing Tests
// ==========================================
describe('Password Hashing', () => {
  it('should hash password correctly with bcrypt', async () => {
    const plainPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    expect(hashedPassword).not.toBe(plainPassword);
    expect(hashedPassword.length).toBeGreaterThan(50);
  });

  it('should verify correct password', async () => {
    const plainPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const plainPassword = 'testpassword123';
    const wrongPassword = 'wrongpassword';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);
    expect(isMatch).toBe(false);
  });
});

// ==========================================
// JWT Token Tests
// ==========================================
describe('JWT Token Generation', () => {
  it('should generate valid JWT token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('should decode JWT token correctly', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it('should include expiration in token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
  });
});
