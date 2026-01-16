# Setup Guide: Backend with PostgreSQL

## What We've Created

1. **Backend Server** - Express.js API
2. **Database** - PostgreSQL for persistent storage
3. **Authentication** - JWT tokens + bcrypt password hashing
4. **API Routes** - Register, Login, Get User

## Step-by-Step Setup

### Step 1: Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for `postgres` user

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
```

### Step 2: Create Database

Open pgAdmin or psql command line:

```sql
CREATE DATABASE skillit_db;
```

### Step 3: Setup Backend

```bash
cd backend
npm install
```

### Step 4: Configure Environment

Create `.env` file in backend folder:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=skillit_db
JWT_SECRET=my_super_secret_key_change_this_in_production
NODE_ENV=development
```

### Step 5: Initialize Database

```bash
npm run migrate
```

This creates the users table automatically.

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see: `Server running on http://localhost:5000`

### Step 7: Update Frontend

The frontend already has the apiService.js configured. It will:
- Send registration/login requests to the backend
- Store JWT token in localStorage
- Include token in all authenticated requests

## How It Works

### Registration Flow:
1. User fills form in React → sent to `/api/auth/register`
2. Backend hashes password with bcryptjs
3. User saved to PostgreSQL database
4. JWT token generated and sent back
5. Token stored in localStorage
6. User redirected to login/home

### Login Flow:
1. User enters email/password → sent to `/api/auth/login`
2. Backend finds user and compares passwords
3. If valid, JWT token generated
4. Token stored in localStorage
5. All future requests include this token in header

### Data Persistence:
- All user data is in PostgreSQL database
- Even if user clears browser cache, data stays in database
- User can log back in with email/password
- No data loss!

## Testing the API

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullname": "Test User",
    "password": "password123",
    "role": "learner"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get User (with token):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## pgAdmin (Database Management GUI)

pgAdmin is a web interface to manage PostgreSQL:

1. Download: https://www.pgadmin.org/download/
2. Open pgAdmin
3. Create server connection to localhost
4. View/edit data in `skillit_db` database
5. Run custom SQL queries

## Troubleshooting

**"Cannot connect to database"**
- Check PostgreSQL is running
- Verify credentials in .env file
- Confirm database exists

**"Port 5000 already in use"**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID> /F
```

**"JWT token invalid"**
- Token may have expired (7 days)
- User needs to login again
- Check JWT_SECRET matches frontend

## Next Steps

1. ✅ Backend server created
2. ✅ Database schema ready
3. ✅ API routes setup
4. 📝 Update React components to use apiService
5. 📝 Add more API endpoints (courses, lessons, etc.)
6. 📝 Deploy to production (Heroku, AWS, etc.)
