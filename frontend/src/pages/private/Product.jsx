import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Student from './Student';

export default function Product() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Helper function to generate username URL
  const getUsernameUrl = (userData) => {
    if (!userData) return '/dashboard';
    const fullname = userData.fullname || userData.fullName || '';
    return '/' + fullname.toLowerCase().replace(/\s+/g, '');
  };

  // Redirect teachers/mentors to Teacher dashboard
  React.useEffect(() => {
    if (isAuthenticated && user && (user.role === 'teacher' || user.role === 'mentor')) {
      navigate(getUsernameUrl(user), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // For students/learners, render the Student dashboard
  if (isAuthenticated && user && (user.role === 'student' || user.role === 'learner')) {
    return <Student />;
  }

  // Loading or fallback state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea2a33] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
