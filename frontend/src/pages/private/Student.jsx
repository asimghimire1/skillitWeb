import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboardView from '../../components/student/DashboardView';
import ExploreContentView from '../../components/student/ExploreContentView';
import ExploreSessionsView from '../../components/student/ExploreSessionsView';
import ExploreTeachersView from '../../components/student/ExploreTeachersView';
import MyLearningView from '../../components/student/MyLearningView';
import MyBidsView from '../../components/student/MyBidsView';
import AddCreditsModal from '../../components/student/AddCreditsModal';
import MakeBidModal from '../../components/student/MakeBidModal';
import apiService from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  BookOpen,
  Users,
  Gavel,
  Wallet,
  LogOut,
  Bell,
  Menu,
  X,
  GraduationCap,
  Settings,
  ChevronDown,
  Video,
  Calendar
} from 'lucide-react';
import '../../css/student.css';
import '../../css/teacher.css';

export default function Student() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { user, logout, isAuthenticated } = useAuth();
  const [student, setStudent] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Data States
  const [stats, setStats] = useState({
    hoursLearned: 0,
    sessionsAttended: 0,
    contentWatched: 0,
    credits: 0
  });
  const [sessions, setSessions] = useState([]);
  const [content, setContent] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [unlockedContent, setUnlockedContent] = useState([]);
  const [bids, setBids] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  // Helper function to generate username URL
  const getUsernameUrl = (userData) => {
    if (!userData) return '/dashboard';
    const fullname = userData.fullname || userData.fullName || '';
    return '/' + fullname.toLowerCase().replace(/\s+/g, '');
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Allow student or learner roles, redirect teachers
    if (user.role === 'teacher' || user.role === 'mentor') {
      navigate(getUsernameUrl(user), { replace: true });
      return;
    }

    setStudent(user);

    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);

    // Fetch Data
    fetchDashboardData(user.id);
  }, [navigate, user, isAuthenticated]);

  const fetchDashboardData = async (studentId) => {
    // Fetch student stats
    const statsData = await apiService.getStudentStats(studentId);
    if (statsData) setStats(statsData);

    // Fetch available sessions
    const sessionsData = await apiService.getAvailableSessions();
    if (sessionsData) {
      const sorted = [...sessionsData].sort((a, b) => {
        const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
        const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
        return dateA - dateB;
      });
      setSessions(sorted);
    }

    // Fetch all content
    const contentData = await apiService.getAllContent();
    console.log('[Student] Content data received:', contentData);
    if (contentData && Array.isArray(contentData)) {
      setContent(contentData);
    } else {
      console.warn('[Student] Content data is not an array:', contentData);
      setContent([]);
    }

    // Fetch teachers
    const teachersData = await apiService.getTeachers();
    if (teachersData) setTeachers(teachersData);

    // Fetch student's enrollments
    const enrollmentsData = await apiService.getStudentEnrollments(studentId);
    if (enrollmentsData) setEnrollments(enrollmentsData);

    // Fetch student's unlocked content
    const unlockedData = await apiService.getStudentUnlockedContent(studentId);
    if (unlockedData) setUnlockedContent(unlockedData);

    // Fetch student's bids
    const bidsData = await apiService.getStudentBids(studentId);
    if (bidsData) setBids(bidsData);

    // Fetch recent posts
    const postsData = await apiService.getRecentPosts(2);
    if (postsData) setRecentPosts(postsData);
  };

  const handleLogout = () => {
    logout();
  };

  const handleAddCredits = async (amount) => {
    const result = await apiService.addCredits(student.id, amount);
    if (result.success) {
      showToast(`NPR ${amount} added to your wallet!`, 'success');
      setStats(prev => ({ ...prev, credits: prev.credits + amount }));
      setIsCreditsModalOpen(false);
    } else {
      showToast('Failed to add credits. Please try again.', 'error');
    }
  };

  const handleEnrollSession = async (session) => {
    // Check if already enrolled
    if (enrollments.some(e => e.sessionId === session.id || e.id === session.id)) {
      showToast('You are already enrolled in this session!', 'info');
      return;
    }

    // Check credits
    if (session.price > 0 && stats.credits < session.price) {
      const needed = session.price - stats.credits;
      showToast(`Insufficient credits. Add NPR ${needed} more.`, 'error');
      setIsCreditsModalOpen(true);
      return;
    }

    const ok = await confirm({
      title: session.price > 0 ? 'Confirm Enrollment' : 'Join Session',
      message: session.price > 0 
        ? `Enroll in "${session.title}" for NPR ${session.price}?` 
        : `Join "${session.title}" for free?`,
      confirmText: session.price > 0 ? 'Pay & Enroll' : 'Join',
      type: 'default'
    });

    if (ok) {
      const result = await apiService.enrollSession(session.id, student.id);
      if (result.success) {
        showToast('Successfully enrolled!', 'success');
        if (session.price > 0) {
          setStats(prev => ({ ...prev, credits: prev.credits - session.price }));
        }
        fetchDashboardData(student.id);
      } else {
        showToast(result.message || 'Failed to enroll. Please try again.', 'error');
      }
    }
  };

  // Handle joining content (free, paid, or bidding)
  const handleJoinContent = async (contentItem, joinType) => {
    // Check if already unlocked
    if (unlockedContent.some(c => c.contentId === contentItem.id || c.id === contentItem.id)) {
      showToast('You already have access to this content!', 'info');
      return;
    }

    if (joinType === 'free') {
      // Free content - join directly
      const ok = await confirm({
        title: 'Join Content',
        message: `Join "${contentItem.title}" for free?`,
        confirmText: 'Join Now',
        type: 'default'
      });

      if (ok) {
        const result = await apiService.joinContent(contentItem.id, student.id, 'free');
        if (result.success) {
          showToast('Successfully joined! Content added to My Learning.', 'success');
          fetchDashboardData(student.id);
        } else {
          showToast(result.message || 'Failed to join. Please try again.', 'error');
        }
      }
    } else if (joinType === 'paid') {
      // Paid content - check credits and process payment
      if (contentItem.price > 0 && stats.credits < contentItem.price) {
        const needed = contentItem.price - stats.credits;
        showToast(`Insufficient credits. Add NPR ${needed} more.`, 'error');
        setIsCreditsModalOpen(true);
        return;
      }

      const ok = await confirm({
        title: 'Purchase Content',
        message: `Purchase "${contentItem.title}" for NPR ${contentItem.price}?`,
        confirmText: 'Pay & Join',
        type: 'default'
      });

      if (ok) {
        const result = await apiService.joinContent(contentItem.id, student.id, 'paid');
        if (result.success) {
          showToast('Purchase successful! Content added to My Learning.', 'success');
          setStats(prev => ({ ...prev, credits: prev.credits - contentItem.price }));
          fetchDashboardData(student.id);
        } else {
          showToast(result.message || 'Failed to purchase. Please try again.', 'error');
        }
      }
    }
  };

  // Handle content bidding
  const handleContentBid = (contentItem) => {
    setSelectedSession(contentItem); // Reuse session state for content bidding
    setIsBidModalOpen(true);
  };

  const handleUnlockContent = async (contentItem) => {
    // Check if already unlocked
    if (unlockedContent.some(c => c.contentId === contentItem.id || c.id === contentItem.id)) {
      showToast('You already have access to this content!', 'info');
      return;
    }

    // Check credits
    if (contentItem.price > 0 && stats.credits < contentItem.price) {
      const needed = contentItem.price - stats.credits;
      showToast(`Insufficient credits. Add NPR ${needed} more.`, 'error');
      setIsCreditsModalOpen(true);
      return;
    }

    const ok = await confirm({
      title: contentItem.price > 0 ? 'Unlock Content' : 'Access Content',
      message: contentItem.price > 0 
        ? `Unlock "${contentItem.title}" for NPR ${contentItem.price}?` 
        : `Access "${contentItem.title}" for free?`,
      confirmText: contentItem.price > 0 ? 'Pay & Unlock' : 'Access',
      type: 'default'
    });

    if (ok) {
      const result = await apiService.unlockContent(contentItem.id, student.id);
      if (result.success) {
        showToast('Content unlocked!', 'success');
        if (contentItem.price > 0) {
          setStats(prev => ({ ...prev, credits: prev.credits - contentItem.price }));
        }
        fetchDashboardData(student.id);
      } else {
        showToast(result.message || 'Failed to unlock. Please try again.', 'error');
      }
    }
  };

  const handleMakeBid = (item) => {
    setSelectedSession(item);
    setIsBidModalOpen(true);
  };

  const handleSubmitBid = async (bidData) => {
    // Validate bid amount (40-100% of item price)
    const minBid = selectedSession.price * 0.4;
    const maxBid = selectedSession.price;

    if (bidData.bidAmount < minBid || bidData.bidAmount > maxBid) {
      showToast(`Bid must be between NPR ${minBid} and NPR ${maxBid}`, 'error');
      return;
    }

    const result = await apiService.submitBid({
      sessionId: bidData.sessionId,
      learnerId: student.id,
      teacherId: selectedSession.teacherId,
      proposedPrice: bidData.bidAmount,
      message: bidData.message,
      status: 'pending'
    });

    if (result.success) {
      showToast('Bid submitted successfully!', 'success');
      setIsBidModalOpen(false);
      setSelectedSession(null);
      fetchDashboardData(student.id);
    } else {
      showToast(result.message || 'Failed to submit bid.', 'error');
    }
  };

  const handleCancelBid = async (bidId) => {
    const ok = await confirm({
      title: 'Cancel Bid',
      message: 'Are you sure you want to cancel this bid?',
      confirmText: 'Cancel Bid',
      type: 'danger'
    });

    if (ok) {
      const result = await apiService.cancelBid(bidId);
      if (result.success) {
        showToast('Bid cancelled', 'info');
        fetchDashboardData(student.id);
      } else {
        showToast('Failed to cancel bid.', 'error');
      }
    }
  };

  const handleRespondToCounter = async (bidId, accept) => {
    const result = await apiService.respondToCounter(bidId, accept);
    if (result.success) {
      showToast(accept ? 'Counter offer accepted!' : 'Counter offer declined', accept ? 'success' : 'info');
      fetchDashboardData(student.id);
    } else {
      showToast('Failed to respond.', 'error');
    }
  };

  const handleAction = (actionType, data) => {
    switch (actionType) {
      case 'explore':
        setActiveTab('explore');
        break;
      case 'sessions':
        setActiveTab('sessions');
        break;
      case 'mylearning':
        setActiveTab('mylearning');
        break;
      case 'teachers':
        setActiveTab('teachers');
        break;
      case 'bids':
        setActiveTab('bids');
        break;
      case 'addCredits':
        setIsCreditsModalOpen(true);
        break;
      case 'enroll':
        handleEnrollSession(data);
        break;
      case 'unlock':
        handleUnlockContent(data);
        break;
      case 'makeBid':
        handleMakeBid(data);
        break;
      case 'cancelBid':
        handleCancelBid(data);
        break;
      case 'acceptCounter':
        handleRespondToCounter(data, true);
        break;
      case 'declineCounter':
        handleRespondToCounter(data, false);
        break;
      default:
        break;
    }
  };

  if (!student) {
    return <div className="student-loading">Loading...</div>;
  }

  const getTabTitle = () => {
    switch(activeTab) {
      case 'dashboard': return { title: `Welcome back, ${student.fullname?.split(' ')[0] || 'Student'} 👋`, subtitle: "Let's continue your learning journey today." };
      case 'explore': return { title: 'Explore Content', subtitle: 'Discover video lessons and courses from expert teachers.' };
      case 'mylearning': return { title: 'My Learning', subtitle: 'Access your enrolled content and sessions.' };
      case 'teachers': return { title: 'Explore Teachers', subtitle: 'Find skilled mentors and view their content.' };
      case 'bids': return { title: 'My Bids', subtitle: 'Track and manage your content bids.' };
      default: return { title: 'Dashboard', subtitle: '' };
    }
  };

  return (
    <div className={`student-container ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className={`student-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-content">
          {/* Logo Section */}
          <div className="sidebar-header" onClick={() => navigate('/')}>
            <div className="sidebar-logo">
              <GraduationCap size={24} />
            </div>
            <div className="sidebar-brand">
              <h1 className="sidebar-title">SkillIt</h1>
              <span className="sidebar-badge">Learner</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => { setActiveTab('explore'); setIsMobileMenuOpen(false); }}
            >
              <Search size={20} />
              <span>Explore Content</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => { setActiveTab('sessions'); setIsMobileMenuOpen(false); }}
            >
              <Calendar size={20} />
              <span>Explore Sessions</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'mylearning' ? 'active' : ''}`}
              onClick={() => { setActiveTab('mylearning'); setIsMobileMenuOpen(false); }}
            >
              <BookOpen size={20} />
              <span>My Learning</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'bids' ? 'active' : ''}`}
              onClick={() => { setActiveTab('bids'); setIsMobileMenuOpen(false); }}
            >
              <Gavel size={20} />
              <span>My Bids</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => { setActiveTab('teachers'); setIsMobileMenuOpen(false); }}
            >
              <Users size={20} />
              <span>Explore Teachers</span>
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            {/* Wallet Balance */}
            <div className="wallet-card" onClick={() => setIsCreditsModalOpen(true)}>
              <div className="wallet-info">
                <span className="wallet-label">Wallet Balance</span>
                <span className="wallet-amount">NPR {stats.credits?.toLocaleString() || '0'}</span>
              </div>
              <div className="wallet-icon">
                <Wallet size={18} />
              </div>
            </div>

            

            {/* Logout */}
            <button className="nav-item logout-item" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>

            {/* User Profile */}
            <div className="sidebar-user">
              <div 
                className="user-avatar"
                style={{ 
                  backgroundImage: `url('${student.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullname || 'Student')}&background=ea2a33&color=fff`}')` 
                }}
              />
              <div className="user-info">
                <span className="user-name">{student.fullname || 'Student'}</span>
                <span className="user-role">Pro Member</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="student-main">
        {/* Header */}
        <header className="student-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="header-title">
              <h2>{getTabTitle().title}</h2>
              <p>{getTabTitle().subtitle}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search sessions..." />
            </div>
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="student-content">
          {activeTab === 'dashboard' && (
            <StudentDashboardView
              stats={stats}
              sessions={sessions}
              content={content}
              teachers={teachers}
              enrollments={enrollments}
              unlockedContent={unlockedContent}
              recentPosts={recentPosts}
              student={student}
              onAction={handleAction}
              onJoinContent={handleJoinContent}
              onMakeBid={handleMakeBid}
              onEnrollSession={handleEnrollSession}
              onWatchContent={(item) => {
                if (item.videoUrl || item.fileUrl) {
                  window.open(item.videoUrl || item.fileUrl, '_blank');
                }
              }}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreContentView
              content={content}
              unlockedContent={unlockedContent}
              onJoinContent={handleJoinContent}
              onMakeBid={handleMakeBid}
            />
          )}

          {activeTab === 'sessions' && (
            <ExploreSessionsView
              sessions={sessions}
              teachers={teachers}
              enrollments={enrollments}
              onEnroll={handleEnrollSession}
              onMakeBid={handleMakeBid}
            />
          )}

          {activeTab === 'mylearning' && (
            <MyLearningView
              sessions={sessions}
              content={content}
              enrollments={enrollments}
              unlockedContent={unlockedContent}
              onWatchContent={(item) => {
                // Open video player or content viewer
                if (item.videoUrl || item.fileUrl) {
                  window.open(item.videoUrl || item.fileUrl, '_blank');
                }
              }}
            />
          )}

          {activeTab === 'teachers' && (
            <ExploreTeachersView
              teachers={teachers}
              content={content}
              onViewTeacherContent={(teacher) => {
                // Filter to show only this teacher's content
                setActiveTab('explore');
                // Could add teacher filter state here
              }}
              onViewProfile={(teacher) => {
                // View teacher profile
                showToast(`Viewing ${teacher.fullname || teacher.fullName}'s profile`, 'info');
              }}
            />
          )}

          {activeTab === 'bids' && (
            <MyBidsView
              bids={bids}
              onRespondToCounter={(bid, action) => handleRespondToCounter(bid.id, action === 'accept')}
              onCancelBid={handleCancelBid}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddCreditsModal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
        onAddCredits={handleAddCredits}
        currentBalance={stats.credits}
      />

      <MakeBidModal
        isOpen={isBidModalOpen}
        onClose={() => { setIsBidModalOpen(false); setSelectedSession(null); }}
        onSubmitBid={handleSubmitBid}
        session={selectedSession}
        userBalance={stats.credits}
      />
    </div>
  );
}
