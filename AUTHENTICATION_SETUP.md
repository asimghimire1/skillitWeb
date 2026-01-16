# SkillIt Authentication Setup

## Overview
This document outlines the complete authentication implementation for SkillIt, including frontend and backend setup with Zod validation.

## Frontend Implementation

### 1. Landing Page (Public)
**File:** `/frontend/src/pages/private/Home.jsx`
- Converted from protected page to public landing page
- Accessible at `/` without authentication
- All CTA buttons intelligently route to login or signup

#### Key Components:
- **Header Navigation:** Shows "Login" and "Sign Up" buttons when not authenticated
- **Hero Section:** 
  - "Find a Mentor" button → redirects to `/login`
  - "Become a Pro" button → redirects to `/register`
- **Teacher Cards:** "View Profile" buttons → redirect to `/login`
- **Map Section:** Search button → redirects to `/login`

#### Functions:
- `handleLoginClick()` - Navigate to login page
- `handleSignupClick()` - Navigate to signup page
- `handleCTAClick(target)` - Smart routing for all CTAs

### 2. Login Page
**File:** `/frontend/src/pages/public/Login.jsx`

#### Zod Validation Schema:
```javascript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
```

#### Features:
- Email validation (valid email format required)
- Password validation (minimum 6 characters)
- React Hook Form + Zod integration
- Error messages displayed below each field
- Password visibility toggle
- Remember me checkbox
- Forgot password link

### 3. Register Page
**File:** `/frontend/src/pages/public/Register.jsx`

#### Zod Validation Schema:
```javascript
const registerSchema = z.object({
  fullname: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['learner', 'mentor'])
});
```

#### Features:
- Full name validation (minimum 3 characters)
- Email validation (valid email format required)
- Password validation (minimum 8 characters)
- Role selection (Learner or Teach)
- React Hook Form with Zod resolver
- Field-level error display
- Password visibility toggle
- Automatic redirect to login after successful registration

### 4. API Service
**File:** `/frontend/src/services/apiService.js`

#### Methods:
- `register(email, fullname, password, role)` - Create new user account
- `login(email, password)` - Authenticate user
- `getCurrentUser()` - Fetch authenticated user info
- `logout()` - Clear stored authentication data

#### Storage:
- `authToken` - JWT token for API authentication
- `userEmail` - Logged-in user's email
- `userName` - Logged-in user's full name
- `userRole` - Logged-in user's role (learner/mentor)

### 5. Routing Setup
**File:** `/frontend/src/App.jsx`

```javascript
Routes:
- / → Landing (public landing page)
- /login → Login page (public)
- /register → Register page (public)
- /private/Home → Product page (authenticated)
- /private/Product → Product page (authenticated)
- * → Landing (catch-all redirect)
```

### 6. Styling
**File:** `/frontend/src/css/auth.css`

#### New Error Styles:
```css
.error-text {
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
  display: block;
}
```

#### Button Styles:
- `.btn-login` - Outline login button
- `.btn-signup` - Filled red signup button
- Both buttons styled with hover effects and smooth transitions

## Backend Implementation

### 1. Authentication Controller
**File:** `/backend/controllers/authController.js`

#### Zod Validation Schemas:
```javascript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  fullname: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['learner', 'mentor'])
});
```

#### Endpoints:

**POST /api/auth/register**
- Validates input with Zod
- Checks for duplicate email
- Hashes password with bcryptjs (salt: 10)
- Creates user in data.json
- Returns JWT token

**POST /api/auth/login**
- Validates input with Zod
- Finds user by email
- Compares password with bcrypt
- Returns JWT token if credentials valid

**GET /api/auth/me** (Protected)
- Requires Bearer token in Authorization header
- Returns authenticated user info

### 2. User Model
**File:** `/backend/models/User.js`

#### Database (JSON-based)
**File:** `/backend/data.json`

User object structure:
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullname": "User Name",
  "password": "$2a$10$hashedPassword...",
  "role": "learner",
  "created_at": "2026-01-09T02:17:45.852Z"
}
```

#### Methods:
- `create(email, fullname, password, role)` - Create new user
- `findByEmail(email)` - Find user by email address
- `findById(id)` - Find user by ID (returns without password)
- `update(id, fullname, role)` - Update user info
- `getAll()` - Get all users (returns without passwords)

### 3. Environment Configuration
**File:** `/backend/.env`

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin123
DB_NAME=skillit_db
JWT_SECRET=skillit_jwt_secret_key_2024
NODE_ENV=development
```

### 4. Dependencies
**File:** `/backend/package.json`

Installed packages:
- `bcryptjs@^2.4.3` - Password hashing
- `jsonwebtoken@^9.0.0` - JWT token generation
- `express@^4.18.2` - Web framework
- `cors@^2.8.5` - CORS middleware
- `zod@^4.3.5` - Schema validation
- `dotenv@^16.0.3` - Environment variables
- `pg@^8.10.0` - PostgreSQL driver

## Installation & Setup

### Prerequisites
- Node.js v24+ 
- npm or yarn
- Port 5000 (backend) and 5175 (frontend) available

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5175`

## Testing Authentication Flow

### 1. Register New User
1. Navigate to `http://localhost:5175/register`
2. Fill in form:
   - Full Name: (3+ characters)
   - Email: (valid email format)
   - Password: (8+ characters)
   - Role: Select Learner or Teach
3. Click "Create Account"
4. Automatically redirected to login

### 2. Login User
1. Navigate to `http://localhost:5175/login`
2. Fill in form:
   - Email: (registered email)
   - Password: (registered password)
3. Click "Login"
4. Token and user data stored in localStorage
5. Redirected to authenticated area

### 3. Test Existing Credentials
- Email: `ramram@gmail.com`
- Password: `password123` (or any password due to bcrypt hash)
- Role: learner

- Email: `bhandina@gmail.com`
- Password: `password123` (or any password due to bcrypt hash)
- Role: teacher

## Security Features

### Password Hashing
- Algorithm: bcryptjs
- Salt rounds: 10
- Passwords never stored in plain text

### JWT Authentication
- Algorithm: HS256
- Expiration: 7 days
- Secret: Configured in .env

### CORS Configuration
**File:** `/backend/server.js`

Allowed origins:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`

## Validation

### Frontend Validation
- Real-time with React Hook Form
- Zod schema validation
- Error messages displayed below fields
- Form submission prevented if validation fails

### Backend Validation
- Zod schema validation on request body
- Returns detailed error messages
- HTTP 400 for validation errors
- HTTP 401 for authentication errors
- HTTP 409 for duplicate email

## Error Handling

### Frontend Error Messages
- Displayed below respective input fields
- Styled in red (#dc3545)
- Clear, user-friendly messages
- Registration error alert box

### Backend Error Responses
- All responses include `success` boolean
- Error messages included when needed
- Appropriate HTTP status codes

Example error response:
```json
{
  "success": false,
  "message": "Invalid email address, Password must be at least 6 characters"
}
```

## Next Steps

1. **Database Migration**: Update to PostgreSQL when ready
2. **Email Verification**: Add email verification on registration
3. **Password Reset**: Implement forgot password flow
4. **OAuth Integration**: Add Google/GitHub authentication
5. **MFA**: Multi-factor authentication support
6. **Role-Based Access**: Different permissions per user role

## File Summary

### Frontend Files Modified
- `/frontend/src/pages/private/Home.jsx` - Landing page
- `/frontend/src/pages/public/Login.jsx` - Login with Zod validation
- `/frontend/src/pages/public/Register.jsx` - Register with Zod validation
- `/frontend/src/App.jsx` - Routing configuration
- `/frontend/src/css/auth.css` - Added error text styling

### Backend Files Modified
- `/backend/controllers/authController.js` - Added Zod validation
- `/backend/models/User.js` - User CRUD operations
- `/backend/data.json` - User data storage
- `/backend/.env` - Environment configuration

## Support

For issues or questions about authentication:
1. Check error messages in browser console
2. Check backend logs in terminal
3. Verify environment variables in .env
4. Ensure both frontend and backend are running
