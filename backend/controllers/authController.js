const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');
const User = require('../models/User');
const { getTransporter, getPreviewUrl } = require('../config/email');

// Zod validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  fullname: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['learner', 'mentor', 'teacher'], { errorMap: () => ({ message: 'Role must be either learner, mentor, or teacher' }) })
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits')
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      // Validate input with Zod
      const validatedData = registerSchema.parse(req.body);
      let { email, fullname, password, role } = validatedData;

      // Normalize role - mentor -> teacher
      if (role === 'mentor') {
        role = 'teacher';
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({ email, fullname, password: hashedPassword, role });

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
      const user = await User.findOne({ where: { email } });
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
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Forgot password - send OTP email
  static async forgotPassword(req, res) {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      const { email } = validatedData;

      const user = await User.findOne({ where: { email } });

      // Always return success to prevent email enumeration
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'If an account with that email exists, an OTP has been sent.'
        });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

      // Save hashed OTP and expiry (10 minutes)
      user.reset_token = otpHash;
      user.reset_token_expiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      // Send email with OTP
      const transporter = await getTransporter();
      const mailOptions = {
        from: `"Skillit" <${process.env.EMAIL_USER !== 'your-email@gmail.com' ? process.env.EMAIL_USER : 'noreply@skillit.com'}>`,
        to: email,
        subject: 'Your Skillit Password Reset Code',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #ea2a33, #ff4d55); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Skillit</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Password Reset Code</p>
            </div>
            <div style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi <strong>${user.fullname}</strong>,</p>
              <p style="color: #555; font-size: 15px; line-height: 1.6;">
                Use the following code to reset your password. This code is valid for <strong>10 minutes</strong>.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <div style="display: inline-block; background: #f8f6f6; border: 2px dashed #ea2a33; padding: 20px 50px; border-radius: 16px;">
                  <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #ea2a33; font-family: 'Courier New', monospace;">${otp}</span>
                </div>
              </div>
              <p style="color: #888; font-size: 13px; line-height: 1.5;">
                If you didn't request this, you can safely ignore this email. Your password won't be changed.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="color: #aaa; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} Skillit. All rights reserved.
              </p>
            </div>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);

      // Log preview URL for Ethereal test emails
      const previewUrl = getPreviewUrl(info);
      if (previewUrl) {
        console.log('');
        console.log('📬 Preview OTP email:', previewUrl);
        console.log('');
      }

      const response = {
        success: true,
        message: 'If an account with that email exists, an OTP has been sent.'
      };

      // In development, include preview URL so you can view the email
      if (process.env.NODE_ENV === 'development' && previewUrl) {
        response.previewUrl = previewUrl;
      }

      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        return res.status(400).json({ success: false, message: errorMessages.join(', ') });
      }
      console.error('Forgot password error:', error);
      return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
    }
  }

  // Verify OTP only (without resetting password)
  static async verifyOtp(req, res) {
    try {
      const validatedData = verifyOtpSchema.parse(req.body);
      const { email, otp } = validatedData;

      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

      const user = await User.findOne({ where: { email, reset_token: otpHash } });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }

      if (new Date() > new Date(user.reset_token_expiry)) {
        user.reset_token = null;
        user.reset_token_expiry = null;
        await user.save();
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
      }

      return res.status(200).json({ success: true, message: 'OTP verified successfully.' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        return res.status(400).json({ success: false, message: errorMessages.join(', ') });
      }
      console.error('Verify OTP error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Reset password with OTP
  static async resetPassword(req, res) {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      const { email, otp, password } = validatedData;

      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

      const user = await User.findOne({ where: { email, reset_token: otpHash } });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }

      if (new Date() > new Date(user.reset_token_expiry)) {
        user.reset_token = null;
        user.reset_token_expiry = null;
        await user.save();
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update password and clear OTP
      user.password = hashedPassword;
      user.reset_token = null;
      user.reset_token_expiry = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. You can now log in with your new password.'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        return res.status(400).json({ success: false, message: errorMessages.join(', ') });
      }
      console.error('Reset password error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = AuthController;
