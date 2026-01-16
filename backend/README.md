# SkillIt Backend

Backend server for SkillIt skill-swapping application.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- pgAdmin4 (optional, for database management)

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create PostgreSQL Database**
   - Open pgAdmin or psql
   - Create a new database named `skillit_db`
   ```sql
   CREATE DATABASE skillit_db;
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=skillit_db
   JWT_SECRET=your_secret_key
   ```

4. **Initialize Database**
   ```bash
   npm run migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "fullname": "John Doe",
  "password": "password123",
  "role": "learner"
}

Response: { success: true, user: {...}, token: "jwt_token" }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { success: true, user: {...}, token: "jwt_token" }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer jwt_token

Response: { success: true, user: {...} }
```

## How Data is Stored

- **Users**: Stored in PostgreSQL `users` table
- **Passwords**: Hashed with bcryptjs
- **Authentication**: JWT tokens (7-day expiry)
- **Persistence**: Data remains in database even after closing browser

## File Structure

```
backend/
├── config/
│   ├── database.js          # PostgreSQL connection
│   └── authMiddleware.js    # JWT verification
├── controllers/
│   └── authController.js    # Auth logic
├── models/
│   └── User.js              # User model/queries
├── routes/
│   └── auth.js              # Auth endpoints
├── migrations/
│   └── init.js              # Database setup
├── .env.example             # Environment template
├── package.json
└── server.js                # Main server file
```

## pgAdmin Setup (Optional)

1. Download pgAdmin4 from https://www.pgadmin.org/
2. Open pgAdmin and create a server connection to localhost
3. Create database `skillit_db`
4. View/manage data through web interface

## Production Deployment

- Use environment variables for sensitive data
- Enable HTTPS
- Use strong JWT_SECRET
- Implement rate limiting
- Add proper error logging
