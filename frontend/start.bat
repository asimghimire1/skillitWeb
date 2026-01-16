@echo off
echo Starting SkillIt Application Setup...
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
echo Backend dependencies installed!
echo.

echo Step 2: Creating .env file from template...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please update it with your PostgreSQL credentials.
)
echo.

echo Step 3: Initializing Database...
call npm run migrate
echo Database initialized!
echo.

echo Step 4: Starting Backend Server...
start npm run dev
timeout /t 3
echo.

echo Step 5: Installing Frontend Dependencies...
cd ..
call npm install
echo Frontend dependencies installed!
echo.

echo Step 6: Starting Frontend Development Server...
start npm run dev
echo.

echo.
echo ============================================
echo SkillIt is starting!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo ============================================
pause
