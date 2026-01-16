# SkillIt Complete Architecture

## Current Issue with localStorage
- **Problem**: Data only stored in browser, lost when cache is cleared
- **Problem**: Data not shared between devices
- **Solution**: Use PostgreSQL database with backend API

## What We've Created

### Backend Folder Structure
```
backend/
├── config/
│   ├── database.js          # PostgreSQL connection pool
│   └── authMiddleware.js    # JWT token verification
├── controllers/
│   └── authController.js    # Login/Register logic
├── models/
│   └── User.js              # Database queries
├── routes/
│   └── auth.js              # API endpoints (/api/auth/*)
├── migrations/
│   └── init.js              # Creates users table
├── server.js                # Express app
├── package.json
├── .env.example
└── README.md
```

### Frontend Services
- `src/services/apiService.js` - Communicates with backend

### Database
- PostgreSQL with `users` table
- Secure password hashing (bcryptjs)
- JWT authentication (7-day tokens)

## How Data Flows Now

### Registration:
```
React Form 
  ↓
apiService.register()
  ↓
POST /api/auth/register
  ↓
Backend hashes password
  ↓
Saves to PostgreSQL
  ↓
Returns JWT token
  ↓
Stored in localStorage
```

### Login:
```
User enters credentials
  ↓
apiService.login()
  ↓
POST /api/auth/login
  ↓
Backend verifies password
  ↓
Returns JWT token
  ↓
Stored in localStorage
  ↓
"Welcome back, [Username]"
```

### Key Difference:
- **Before**: Data only in browser (localStorage)
- **Now**: Data persists in PostgreSQL database
- **Result**: User can close app, come back, and data still exists!

## Quick Start

### 1. Install PostgreSQL
- Download from postgresql.org
- Create database `skillit_db`

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL password
npm run migrate
npm run dev
```

### 3. Update Frontend to Use API
Replace localStorage calls with apiService:

```javascript
// Before (localStorage only):
localStorage.setItem('userData', JSON.stringify(data));

// After (backend + database):
const result = await apiService.register(email, fullname, password, role);
```

### 4. Run Frontend
```bash
npm install
npm run dev
```

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcryptjs hashed
  role VARCHAR(50) DEFAULT 'learner',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| POST | /api/auth/register | {email, fullname, password, role} | {success, user, token} |
| POST | /api/auth/login | {email, password} | {success, user, token} |
| GET | /api/auth/me | - | {success, user} |

## Security Features

1. **Passwords**: Hashed with bcryptjs (never stored plain)
2. **Tokens**: JWT with 7-day expiry
3. **Database**: Credentials in .env (not in code)
4. **Requests**: CORS enabled for frontend origin

## pgAdmin (Optional Database GUI)

Access your database visually:
1. Download pgAdmin4
2. Create connection to localhost
3. Browse `skillit_db.users` table
4. Add/edit/delete data

## Next Steps

1. ✅ Backend created
2. ✅ Database configured
3. ✅ API routes ready
4. 📝 Update Login.jsx to use apiService
5. 📝 Update Register.jsx to use apiService
6. 📝 Update Home.jsx to validate JWT token
7. 📝 Add more features (courses, payments, etc.)
8. 🚀 Deploy (Heroku, AWS, DigitalOcean, etc.)

## Questions?

**Q: Will data persist?**
A: Yes! PostgreSQL stores it permanently. Even if you clear browser cache, data remains in database.

**Q: What about passwords?**
A: Never stored plain text. bcryptjs hashes them. Even database admin can't see passwords.

**Q: Can user access from different device?**
A: Yes! Same email/password works on any device. Data is in cloud database.

**Q: How long is token valid?**
A: 7 days. After that, user must login again.
