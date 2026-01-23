import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Product() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect teachers/mentors to Teacher dashboard
  React.useEffect(() => {
    if (isAuthenticated && user && (user.role === 'teacher' || user.role === 'mentor')) {
      navigate('/private/Teacher', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Student Dashboard</h1>
        <p className="text-gray-600">Welcome to SkillIt!</p>
        {user && (
          <p className="text-gray-500 mt-2">Logged in as: {user.fullname || user.email}</p>
        )}
      </div>
    </div>
  );
}
