import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/UploadModal';
import CreateSessionModal from '../../components/CreateSessionModal';
import CreatePostModal from '../../components/CreatePostModal';
import BidRequestsView from '../../components/BidRequestsView';
import DashboardView from '../../components/teacher/DashboardView';
import ContentView from '../../components/teacher/ContentView';
import SessionsView from '../../components/teacher/SessionsView';
import PostsView from '../../components/teacher/PostsView';
import NotificationDropdown from '../../components/NotificationDropdown';
import apiService from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ReceiptText,
  SquarePlay,
  CalendarDays,
  Megaphone,
  Wallet,
  LogOut,
  Bell,
  Coins,
  UploadCloud,
  Video,
  FileEdit,
  Construction,
  Menu,
  X
} from 'lucide-react';
import '../../css/teacher.css';

export default function Teacher() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { user, logout, isAuthenticated } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);

  // Data States
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSessions: 0,
    totalUploads: 0,
    monthlyEarnings: 0
  });
  const [uploads, setUploads] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bids, setBids] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [bidNotificationCount, setBidNotificationCount] = useState(0);

  // Helper function to generate username URL
  const getUsernameUrl = (userData) => {
    if (!userData) return '/dashboard';
    const fullname = userData.fullname || userData.fullName || '';
    return '/' + fullname.toLowerCase().replace(/\s+/g, '');
  };

  useEffect(() => {
    // Use user from auth context instead of localStorage
    if (!isAuthenticated || !user) {
      return;
    }

    if (user.role !== 'teacher' && user.role !== 'mentor') {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    setTeacher(user);

    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);

    // Fetch Data
    fetchDashboardData(user.id);
  }, [navigate, user, isAuthenticated]);

  const fetchDashboardData = async (teacherId) => {
    console.log('[Teacher] Fetching dashboard data for teacher:', teacherId);
    
    const statsData = await apiService.getTeacherStats(teacherId);
    if (statsData) setStats(statsData);

    const sessionsData = await apiService.getTeacherSessions(teacherId);
    console.log('[Teacher] Sessions received:', sessionsData);
    if (sessionsData && Array.isArray(sessionsData)) {
      // Sort by date/time ascending (nearest first)
      const sorted = [...sessionsData].sort((a, b) => {
        const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`);
        const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`);
        return dateA - dateB;
      });
      console.log('[Teacher] Sessions sorted:', sorted.length);
      setSessions(sorted);
    } else {
      console.log('[Teacher] No sessions or invalid data');
      setSessions([]);
    }

    const contentData = await apiService.getTeacherContent(teacherId);
    if (contentData) setUploads(contentData);

    const postsData = await apiService.getTeacherPosts(teacherId);
    if (postsData) setPosts(postsData);

    // Fetch bid requests to update notification count
    const bidsData = await apiService.getBidRequests(teacherId);
    if (bidsData) {
      setBids(bidsData);
      const pendingBids = bidsData.filter(b => b.status === 'pending').length;
      setBidNotificationCount(pendingBids);
    }
  };

  // Handle session status updates (missed/completed)
  const handleSessionStatusUpdate = async (sessionId, status) => {
    // Update local state
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, status } : session
    ));
    
    // Optionally update on server
    try {
      await apiService.updateSession(sessionId, { status });
    } catch (error) {
      console.error('Failed to update session status:', error);
    }
  };

  const handleLogout = () => {
    logout(); // Use the auth context logout which handles navigation
  };

  const handleUploadContent = async (uploadData) => {
    // uploadData now contains FormData (or will be adapted)
    const newContent = await apiService.uploadContent(uploadData);
    if (newContent) {
      setUploads(prev => [newContent, ...prev]);
      fetchDashboardData(teacher.id);
    }
  };

  const handleCreateSession = async (sessionData) => {
    console.log('[Teacher] Creating session with data:', sessionData);
    console.log('[Teacher] sessionToEdit:', sessionToEdit);
    console.log('[Teacher] teacher.id:', teacher?.id);
    
    if (sessionToEdit) {
      const updated = await apiService.updateSession(sessionToEdit.id, {
        ...sessionData,
        teacherId: teacher.id
      });
      console.log('[Teacher] Update result:', updated);
      if (updated) {
        showToast('Session updated successfully', 'success');
        fetchDashboardData(teacher.id);
      } else {
        showToast('Failed to update session', 'error');
      }
    } else {
      const newSession = await apiService.createSession({
        teacherId: teacher.id,
        ...sessionData
      });
      console.log('[Teacher] Create result:', newSession);
      if (newSession && newSession.id) {
        showToast('Session scheduled successfully', 'success');
        fetchDashboardData(teacher.id);
      } else {
        showToast('Failed to create session', 'error');
      }
    }
    // Reset sessionToEdit after operation
    setSessionToEdit(null);
  };

  const handleCreatePost = async (postData) => {
    // Adapter for CreatePostModal data
    // Post API expects: teacherId, title, content, category
    const apiData = {
      title: postData.title,
      content: postData.description, // mapped from description
      category: postData.category,
      teacherId: teacher.id
    };

    if (postToEdit) {
      const result = await apiService.updatePost(postToEdit.id, apiData);
      if (result && !result.error) {
        showToast('Post updated successfully', 'success');
        fetchDashboardData(teacher.id);
      } else if (result.error) {
        showToast(result.error, 'error');
      }
    } else {
      const newPost = await apiService.createPost(apiData);
      if (newPost) {
        showToast('New post shared', 'success');
        fetchDashboardData(teacher.id);
      }
    }
  };

  const handleQuickAction = async (actionType, data) => {
    if (actionType === 'upload') setIsUploadModalOpen(true);
    else if (actionType === 'session') setIsSessionModalOpen(true);
    else if (actionType === 'content') setActiveTab('content');
    else if (actionType === 'bids') setActiveTab('bids');
    else if (actionType === 'sessions') setActiveTab('sessions');
    else if (actionType === 'posts') setActiveTab('posts'); // Navigate to tab, or open modal if meant to be "New Post" logic
    else if (actionType === 'post') setIsPostModalOpen(true); // "New Post" from dashboard
    else if (actionType === 'deleteContent') {
      const ok = await confirm({
        title: 'Delete Content',
        message: 'Are you sure you want to delete this content? This action cannot be undone.',
        confirmText: 'Delete',
        type: 'danger'
      });
      if (ok) {
        await apiService.deleteContent(data);
        showToast('Content deleted successfully', 'success');
        fetchDashboardData(teacher.id);
      }
    } else if (actionType === 'editSession') {
      setSessionToEdit(data);
      setIsSessionModalOpen(true);
    } else if (actionType === 'deleteSession') {
      const ok = await confirm({
        title: 'Delete Session',
        message: 'Are you sure you want to delete this session? All participants will be notified.',
        confirmText: 'Delete',
        type: 'danger'
      });
      if (ok) {
        await apiService.deleteSession(data);
        showToast('Session deleted successfully', 'success');
        fetchDashboardData(teacher.id);
      }
    }
  };

  // Helper for PostsView callbacks
  const handlePostAction = async (action, post) => {
    if (action === 'edit') {
      const canEdit = (new Date() - new Date(post.created_at)) / 1000 / 60 <= 30;
      if (!canEdit) {
        showToast('Posts can only be edited within 30 minutes of creation.', 'error');
        return;
      }
      setPostToEdit({
        id: post.id,
        title: post.title,
        description: post.content, // mapped back for modal
        category: post.category
      });
      setIsPostModalOpen(true);
    } else if (action === 'delete') {
      const ok = await confirm({
        title: 'Delete Post',
        message: 'Are you sure you want to delete this post?',
        confirmText: 'Delete',
        type: 'danger'
      });
      if (ok) {
        await apiService.deletePost(post); // post here is id
        showToast('Post deleted successfully', 'success');
        fetchDashboardData(teacher.id);
      }
    }
  };

  // Handle bid responses (accept, reject, counter)
  const handleRespondToBid = async (bidId, action, counterData = null) => {
    const result = await apiService.respondToBid(bidId, { action, ...counterData });
    if (result.success) {
      if (action === 'accept') {
        showToast('Bid accepted! Student has been enrolled.', 'success');
      } else if (action === 'reject') {
        showToast('Bid declined.', 'info');
      } else if (action === 'counter') {
        showToast('Counter offer sent!', 'success');
      }
      fetchDashboardData(teacher.id);
    } else {
      showToast(result.message || 'Failed to respond to bid.', 'error');
    }
  };

  if (!teacher) {
    return <div className="teacher-loading">Loading...</div>;
  }

  const quickActions = [
    { icon: <UploadCloud size={28} />, title: 'Upload Content', desc: 'Add new video courses or learning materials to your library.', action: () => setIsUploadModalOpen(true) },
    { icon: <Video size={28} />, title: 'Create Session', desc: 'Schedule a live 1-on-1 or group session with your students.', action: () => setIsSessionModalOpen(true) },
    { icon: <FileEdit size={28} />, title: 'New Post', desc: 'Share updates, tips, or announcements with your community.', action: () => setIsPostModalOpen(true) },
  ];

  return (
    <div className={`teacher-container ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className={`teacher-sidebar ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <div className="sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo">
            <img src="http://localhost:5000/uploads/images/logo.png" alt="Skillit Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 className="sidebar-title">Skillit</h1>
            <p className="sidebar-subtitle">Teacher Pro</p>
          </div>
          {/* Mobile Close Button */}
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
            <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'nav-icon-active' : 'nav-icon-inactive'} />
            Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'bids' ? 'active' : ''}`} onClick={() => { setActiveTab('bids'); setIsMobileMenuOpen(false); }}>
            <ReceiptText size={20} className={activeTab === 'bids' ? 'nav-icon-active' : 'nav-icon-inactive'} />
            Bid Requests
            {bidNotificationCount > 0 && (
              <span className="nav-badge">{bidNotificationCount > 9 ? '9+' : bidNotificationCount}</span>
            )}
          </div>
          <div className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => { setActiveTab('content'); setIsMobileMenuOpen(false); }}>
            <SquarePlay size={20} className={activeTab === 'content' ? 'nav-icon-active' : 'nav-icon-inactive'} />
            My Content
          </div>
          <div className={`nav-item ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => { setActiveTab('sessions'); setIsMobileMenuOpen(false); }}>
            <CalendarDays size={20} className={activeTab === 'sessions' ? 'nav-icon-active' : 'nav-icon-inactive'} />
            Sessions
          </div>
          <div className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => { setActiveTab('posts'); setIsMobileMenuOpen(false); }}>
            <Megaphone size={20} className={activeTab === 'posts' ? 'nav-icon-active' : 'nav-icon-inactive'} />
            Posts
          </div>
          <div className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => { setActiveTab('earnings'); setIsMobileMenuOpen(false); }}>
            <Wallet size={20} className={activeTab === 'earnings' ? 'nav-icon-active' : 'nav-icon-inactive'} />
            Earnings
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar" style={{ backgroundImage: `url('${teacher.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher.fullname || "Teacher") + "&background=ea2a33&color=fff"}')` }} />
            <div className="user-info">
              <p className="user-name">{teacher.fullname || teacher.fullName || 'Teacher'}</p>
              <p className="user-title">Verified Teacher</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="teacher-main">
        {/* Navbar */}
        <header className="teacher-navbar">
          <div className="navbar-left">
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'bids' && 'Bid Requests'}
              {activeTab === 'content' && 'My Content'}
              {activeTab === 'sessions' && 'Sessions Schedule'}
              {activeTab === 'earnings' && 'Earnings & Payouts'}
              {activeTab === 'posts' && 'Posts & Announcements'}
            </h2>
          </div>
          <div className="navbar-right">
            <NotificationDropdown 
              userId={teacher?.id}
              onNotificationCountChange={setNotificationCount}
            />
            <div className="navbar-divider"></div>
            <div className="earnings-display">
              <Coins size={20} className="nav-icon-active" />
              <span>NPR {stats.monthlyEarnings.toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="teacher-content">
          {activeTab === 'dashboard' && (
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome back, {teacher.fullname || teacher.fullName || 'Teacher'}</h1>
              <p className="welcome-subtitle">Here's what happened with your classes today.</p>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              uploads={uploads}
              sessions={sessions}
              posts={posts}
              quickActions={quickActions}
              onAction={handleQuickAction}
              teacher={teacher}
              onSessionStatusUpdate={handleSessionStatusUpdate}
              bids={bids}
              onRespondToBid={handleRespondToBid}
            />
          )}

          {activeTab === 'bids' && (
            <BidRequestsView 
              bids={bids}
              sessions={sessions}
              uploads={uploads}
              onRespondToBid={handleRespondToBid}
              onRefresh={() => fetchDashboardData(teacher.id)}
            />
          )}

          {activeTab === 'content' && (
            <ContentView
              uploads={uploads}
              onUpload={() => setIsUploadModalOpen(true)}
              onAction={handleQuickAction}
              teacher={teacher}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsView
              sessions={sessions}
              onCreate={(session) => {
                setSessionToEdit(session || null);
                setIsSessionModalOpen(true);
              }}
              onAction={handleQuickAction}
            />
          )}

          {activeTab === 'posts' && (
            <PostsView
              posts={posts}
              teacher={teacher}
              onCreate={() => { setPostToEdit(null); setIsPostModalOpen(true); }}
              onEdit={(post) => handlePostAction('edit', post)}
              onDelete={(id) => handlePostAction('delete', id)}
            />
          )}

          {(activeTab === 'earnings') && (
            <div className="empty-state" style={{ padding: '4rem' }}>
              <Construction size={64} className="text-gray-300" />
              <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#666' }}>This feature is coming soon!</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadContent}
        teacherName={teacher.fullname}
      />
      <CreateSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => {
          setIsSessionModalOpen(false);
          setSessionToEdit(null);
        }}
        onCreate={handleCreateSession}
        sessionToEdit={sessionToEdit}
      />
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setPostToEdit(null);
        }}
        onCreate={handleCreatePost}
        postToEdit={postToEdit}
      />
    </div >
  );
}
