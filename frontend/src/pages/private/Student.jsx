import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StudentDashboardView from '../../components/student/DashboardView';
import ExploreContentView from '../../components/student/ExploreContentView';
import ExploreSessionsView from '../../components/student/ExploreSessionsView';
import ExploreTeachersView from '../../components/student/ExploreTeachersView';
import MyLearningView from '../../components/student/MyLearningView';
import MyBidsView from '../../components/student/MyBidsView';
import AddCreditsModal from '../../components/student/AddCreditsModal';
import MakeBidModal from '../../components/student/MakeBidModal';
import VideoPlayerModal from '../../components/student/VideoPlayerModal';
import ContentDetailModal from '../../components/student/ContentDetailModal';
import NotificationDropdown from '../../components/NotificationDropdown';
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
  ChevronRight,
  Video,
  Calendar,
  Clock,
  Lock,
  FileText
} from 'lucide-react';
import SidebarDropdownItem, { SidebarSubItem } from '../../components/SidebarDropdownItem';
import '../../css/student.css';
import '../../css/teacher.css';
import '../../css/sidebar-dropdown.css';


export default function Student() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { user, logout, isAuthenticated } = useAuth();
  const [student, setStudent] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const bidFilter = searchParams.get('bidType') || 'all';

  const handleTabChange = (tab, extraParams = {}) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', tab);
      Object.entries(extraParams).forEach(([key, value]) => {
        newParams.set(key, value);
      });
      return newParams;
    }, { replace: true });
    setIsMobileMenuOpen(false);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Modal States
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [isContentDetailOpen, setIsContentDetailOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

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
  const [notificationCount, setNotificationCount] = useState(0);
  const [bidNotificationCount, setBidNotificationCount] = useState(0);

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

    // const darkMode = localStorage.getItem('darkMode') === 'true';
    // setIsDark(darkMode);

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
    if (bidsData) {
      setBids(bidsData);
      // Count pending bids and counter offers as notifications for sidebar badge
      const activeBidCount = bidsData.filter(b =>
        b.status === 'pending' || b.status === 'counter' || b.status === 'countered'
      ).length;
      setBidNotificationCount(activeBidCount);
    }

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
    const isEnrolled = enrollments.some(e => e.sessionId === session.id || e.id === session.id);

    // If already enrolled, just open the meeting link (allows rejoin)
    if (isEnrolled) {
      if (session.meetingLink) {
        window.open(session.meetingLink, '_blank');
        showToast('Rejoining session...', 'success');
      } else {
        showToast('Meeting link not available yet', 'info');
      }
      return;
    }

    // For free sessions, enroll and redirect to meeting link directly
    if (session.price === 0 || !session.price) {
      const result = await apiService.enrollSession(session.id, student.id);
      if (result.success) {
        showToast('Successfully joined!', 'success');
        fetchDashboardData(student.id);
        // Redirect to meeting link if available
        if (session.meetingLink) {
          window.open(session.meetingLink, '_blank');
        }
      } else {
        showToast(result.message || 'Failed to join. Please try again.', 'error');
      }
      return;
    }

    // For paid sessions, show the enrollment modal
    setSelectedSession(session);
    setIsEnrollModalOpen(true);
  };

  // Confirm enrollment from modal
  const handleConfirmEnrollment = async () => {
    if (!selectedSession) return;

    // Check credits
    if (stats.credits < selectedSession.price) {
      const needed = selectedSession.price - stats.credits;
      showToast(`Insufficient credits. Add NPR ${needed} more.`, 'error');
      setIsEnrollModalOpen(false);
      setIsCreditsModalOpen(true);
      return;
    }

    const result = await apiService.enrollSession(selectedSession.id, student.id);
    if (result.success) {
      showToast('Successfully enrolled!', 'success');
      setStats(prev => ({ ...prev, credits: prev.credits - selectedSession.price }));
      fetchDashboardData(student.id);
      setIsEnrollModalOpen(false);
      setSelectedSession(null);
      // Redirect to meeting link if available
      if (selectedSession.meetingLink) {
        window.open(selectedSession.meetingLink, '_blank');
      }
    } else {
      showToast(result.message || 'Failed to enroll. Please try again.', 'error');
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
    // Validate bid amount (60-100% of item price, max 40% discount)
    const minBid = selectedSession.price * 0.6;
    const maxBid = selectedSession.price;

    if (bidData.bidAmount < minBid || bidData.bidAmount > maxBid) {
      showToast(`Bid must be between NPR ${Math.ceil(minBid).toLocaleString()} and NPR ${maxBid.toLocaleString()}`, 'error');
      return;
    }

    const result = await apiService.submitBid({
      sessionId: bidData.itemType === 'session' ? bidData.itemId : null,
      contentId: bidData.itemType === 'content' ? bidData.itemId : null,
      learnerId: student.id,
      teacherId: selectedSession.teacherId,
      proposedPrice: bidData.bidAmount,
      message: bidData.message,
      itemType: bidData.itemType || 'session',
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

  const handleCancelBid = async (bidIdOrSession) => {
    // If it's a session object, find the pending bid for it
    let bidId = bidIdOrSession;
    if (typeof bidIdOrSession === 'object' && bidIdOrSession.id) {
      const pendingBid = bids.find(b =>
        (b.sessionId === bidIdOrSession.id || b.contentId === bidIdOrSession.id) &&
        b.status === 'pending'
      );
      if (!pendingBid) {
        showToast('No pending bid found', 'error');
        return;
      }
      bidId = pendingBid.id;
    }

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
        handleTabChange('explore');
        break;
      case 'sessions':
        handleTabChange('sessions');
        break;
      case 'mylearning':
        handleTabChange('mylearning');
        break;
      case 'teachers':
        handleTabChange('teachers');
        break;
      case 'bids': {
        const getBidTimestamp = (bid) => {
          const stamp = bid?.created_at || bid?.createdAt || bid?.updated_at;
          return stamp ? new Date(stamp).getTime() : 0;
        };
        const sortedBids = Array.isArray(bids)
          ? [...bids].sort((a, b) => getBidTimestamp(b) - getBidTimestamp(a))
          : [];
        const latestBid = sortedBids[0];
        const bidType = latestBid?.contentId ? 'content' : latestBid?.sessionId ? 'session' : 'all';
        handleTabChange('bids', { bidType });
        break;
      }
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
      case 'viewDetails':
        // Open content detail modal
        if (data) {
          const enrichedContent = {
            ...data,
            teacherName: data.teacherName || teachers.find(t => t.id === data.teacherId)?.fullname || 'Expert Teacher',
            teacherAvatar: data.teacherAvatar || teachers.find(t => t.id === data.teacherId)?.avatar
          };
          setSelectedContent(enrichedContent);
          setIsContentDetailOpen(true);
        }
        break;
      default:
        break;
    }
  };

  if (!student) {
    return <div className="student-loading">Loading...</div>;
  }

  const getTabTitle = () => {
    switch (activeTab) {
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
              <img src="/logo.png" alt="SkillIt Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
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
              onClick={() => handleTabChange('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => handleTabChange('explore')}
            >
              <Search size={20} />
              <span>Explore Content</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => handleTabChange('sessions')}
            >
              <Calendar size={20} />
              <span>Explore Sessions</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'mylearning' ? 'active' : ''}`}
              onClick={() => handleTabChange('mylearning')}
            >
              <BookOpen size={20} />
              <span>My Learning</span>
            </button>

            <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Bid Requests
            </div>

            <SidebarDropdownItem
              icon={FileText}
              label="Contents"
              badge={bids.filter(b => b.status === 'pending' && b.contentId).length}
              isExpanded={expandedMenus['content_bids']}
              onToggle={() => setExpandedMenus(prev => ({ ...prev, content_bids: !prev['content_bids'] }))}
            >
              <SidebarSubItem
                label="Content Bids"
                isActive={activeTab === 'bids' && bidFilter === 'content'}
                onClick={() => handleTabChange('bids', { bidType: 'content' })}
              />
            </SidebarDropdownItem>

            <SidebarDropdownItem
              icon={Users}
              label="Sessions"
              badge={bids.filter(b => b.status === 'pending' && b.sessionId).length}
              isExpanded={expandedMenus['session_bids']}
              onToggle={() => setExpandedMenus(prev => ({ ...prev, session_bids: !prev['session_bids'] }))}
            >
              <SidebarSubItem
                label="Session Bids"
                isActive={activeTab === 'bids' && bidFilter === 'session'}
                onClick={() => handleTabChange('bids', { bidType: 'session' })}
              />
            </SidebarDropdownItem>

            <button
              className={`nav-item logout-item`}
              style={{ display: 'none' }}
              onClick={() => handleTabChange('teachers')}
            >
              <Users size={20} />
              <span>Explore Teachers</span>
            </button>
          </nav>


          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            {/* Wallet Balance */}
            <div className="wallet-card" onClick={() => setIsCreditsModalOpen(true)} style={{ marginBottom: '1.5rem' }}>
              <div className="wallet-info">
                <span className="wallet-label">Wallet Balance</span>
                <span className="wallet-amount">NPR {stats.credits?.toLocaleString() || '0'}</span>
              </div>
              <div className="wallet-icon">
                <Wallet size={18} />
              </div>
            </div>

            {/* User Profile with Dropdown */}
            <div className="sidebar-user-container">
              <div
                className={`sidebar-user ${isProfileDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div
                  className="user-avatar"
                  style={{
                    backgroundImage: `url('${student?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.fullname || 'Student')}&background=ea2a33&color=fff`}')`
                  }}
                />
                <div className="user-info">
                  <span className="user-name">{student?.fullname || 'Student'}</span>
                </div>
                <ChevronRight
                  size={16}
                  className={`user-chevron ${isProfileDropdownOpen ? 'rotate-90' : ''}`}
                />
              </div>

              {isProfileDropdownOpen && (
                <div className="user-profile-dropdown">
                  <button className="dropdown-item" onClick={() => { setIsProfileDropdownOpen(false); handleTabChange('profile'); }}>
                    <Users size={16} />
                    <span>My Profile</span>
                  </button>
                  <button className="dropdown-item" onClick={() => { setIsProfileDropdownOpen(false); handleTabChange('settings'); }}>
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
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
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Skills"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTabChange('explore');
                  }
                }}
              />
            </div>
            <NotificationDropdown
              userId={student?.id}
              onNotificationCountChange={setNotificationCount}
            />
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
              bids={bids}
              onAction={handleAction}
              onFocusSearch={handleFocusSearch}
              onJoinContent={handleJoinContent}
              onMakeBid={handleMakeBid}
              onCancelBid={handleCancelBid}
              onEnrollSession={handleEnrollSession}
              onWatchContent={(item) => {
                // Enrich content with teacher info if not present
                const enrichedItem = {
                  ...item,
                  teacherName: item.teacherName || teachers.find(t => t.id === item.teacherId)?.fullname || 'Teacher',
                  teacherAvatar: item.teacherAvatar || teachers.find(t => t.id === item.teacherId)?.avatar
                };
                setSelectedContent(enrichedItem);
                setIsVideoPlayerOpen(true);
              }}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreContentView
              content={content}
              unlockedContent={unlockedContent}
              bids={bids}
              searchQuery={searchQuery}
              onJoinContent={handleJoinContent}
              onMakeBid={handleMakeBid}
              onCancelBid={handleCancelBid}
              onAction={handleAction}
            />
          )}

          {activeTab === 'sessions' && (
            <ExploreSessionsView
              sessions={sessions}
              teachers={teachers}
              enrollments={enrollments}
              bids={bids}
              onEnroll={handleEnrollSession}
              onMakeBid={handleMakeBid}
              onCancelBid={handleCancelBid}
            />
          )}

          {activeTab === 'mylearning' && (
            <MyLearningView
              sessions={sessions}
              content={content}
              enrollments={enrollments}
              unlockedContent={unlockedContent}
              onWatchContent={(item) => {
                // Enrich content with teacher info if not present
                const enrichedItem = {
                  ...item,
                  teacherName: item.teacherName || teachers.find(t => t.id === item.teacherId)?.fullname || 'Teacher',
                  teacherAvatar: item.teacherAvatar || teachers.find(t => t.id === item.teacherId)?.avatar
                };
                setSelectedContent(enrichedItem);
                setIsVideoPlayerOpen(true);
              }}
              onJoinSession={handleEnrollSession}
            />
          )}

          {activeTab === 'teachers' && (
            <ExploreTeachersView
              teachers={teachers}
              content={content}
              onViewTeacherContent={(teacher) => {
                // Filter to show only this teacher's content
                handleTabChange('explore');
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
              filter={bidFilter}
              sessions={sessions}
              content={content}
              teachers={teachers}
              onRespondToCounter={(bid, action) => handleRespondToCounter(bid.id, action === 'accept')}
              onCancelBid={handleCancelBid}
              onWatchContent={(item) => {
                const enrichedItem = {
                  ...item,
                  teacherName: item.teacherName || teachers.find(t => t.id === item.teacherId)?.fullname || 'Teacher',
                  teacherAvatar: item.teacherAvatar || teachers.find(t => t.id === item.teacherId)?.avatar
                };
                setSelectedContent(enrichedItem);
                setIsVideoPlayerOpen(true);
              }}
              onJoinSession={handleEnrollSession}
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

      {/* Video Player Modal */}
      {isVideoPlayerOpen && selectedContent && (
        <VideoPlayerModal
          content={selectedContent}
          onClose={() => { setIsVideoPlayerOpen(false); setSelectedContent(null); }}
          suggestedContent={content
            .filter(c => c.id !== selectedContent.id && unlockedContent.some(u => u.contentId === c.id || u.id === c.id))
            .map(c => ({
              ...c,
              teacherName: c.teacherName || teachers.find(t => t.id === c.teacherId)?.fullname || 'Teacher',
              teacherAvatar: c.teacherAvatar || teachers.find(t => t.id === c.teacherId)?.avatar
            }))
            .slice(0, 10)
          }
          onSelectContent={(item) => {
            setSelectedContent(item);
          }}
          baseUrl={import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}
        />
      )}

      {/* Content Detail Modal */}
      {isContentDetailOpen && selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => { setIsContentDetailOpen(false); setSelectedContent(null); }}
          onUnlock={(item) => {
            setIsContentDetailOpen(false);
            handleJoinContent(item);
          }}
          onMakeBid={(item) => {
            setIsContentDetailOpen(false);
            handleMakeBid(item);
          }}
          userBalance={stats.credits}
          baseUrl={import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}
        />
      )}

      {/* Session Enrollment Modal */}
      {isEnrollModalOpen && selectedSession && (
        <div className="modal-overlay" onClick={() => { setIsEnrollModalOpen(false); setSelectedSession(null); }}>
          <div className="enroll-modal" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="enroll-modal-header">
              <div className="enroll-date-pill">
                <Calendar size={14} />
                {(() => {
                  const date = new Date(selectedSession.scheduledDate);
                  const today = new Date();
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  if (date.toDateString() === today.toDateString()) return 'Today';
                  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                })()}
              </div>
              <div className="enroll-price-badge">
                NPR {selectedSession.price?.toLocaleString()}
              </div>
            </div>

            {/* Content */}
            <div className="enroll-modal-body">
              <h2 className="enroll-modal-title">{selectedSession.title}</h2>

              {selectedSession.description && (
                <p className="enroll-modal-desc">{selectedSession.description}</p>
              )}

              {/* Instructor */}
              <div className="enroll-instructor">
                <div
                  className="enroll-instructor-avatar"
                  style={{
                    backgroundImage: `url('${selectedSession.teacherAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSession.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
                  }}
                />
                <div className="enroll-instructor-info">
                  <span className="enroll-instructor-label">INSTRUCTOR</span>
                  <span className="enroll-instructor-name">{selectedSession.teacherName || 'Teacher'}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="enroll-meta">
                <span className="enroll-meta-item">
                  <Clock size={16} />
                  {selectedSession.scheduledTime || '10:00'}
                </span>
                <span className="enroll-meta-item">
                  <Video size={16} />
                  {selectedSession.duration || 60} mins
                </span>
                <span className="enroll-meta-item">
                  <Users size={16} />
                  {selectedSession.enrolledCount || 0}/{selectedSession.maxParticipants || 22} spots left
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="enroll-modal-footer">
              <div className="enroll-wallet-balance">
                <Wallet size={16} />
                Wallet Balance: NPR {stats.credits?.toLocaleString()}
              </div>

              <button
                className="enroll-unlock-btn"
                onClick={handleConfirmEnrollment}
                disabled={stats.credits < selectedSession.price}
              >
                <Lock size={18} />
                Unlock for NPR {selectedSession.price?.toLocaleString()}
              </button>

              {stats.credits < selectedSession.price && (
                <button
                  className="enroll-add-credits-link"
                  onClick={() => { setIsEnrollModalOpen(false); setIsCreditsModalOpen(true); }}
                >
                  + Add Credits
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
