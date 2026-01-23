import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/UploadModal';
import CreateSessionModal from '../../components/CreateSessionModal';
import CreatePostModal from '../../components/CreatePostModal';
import BidRequestsView from '../../components/BidRequestsView';
import DashboardView from '../../components/teacher/DashboardView';
import ContentView from '../../components/teacher/ContentView';
import SessionsView from '../../components/teacher/SessionsView';
import apiService from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import '../../css/teacher.css';

export default function Teacher() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [teacher, setTeacher] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/public/Login');
      return;
    }

    const user = JSON.parse(userJson);
    if (user.role !== 'teacher') {
      navigate('/private/Home');
      return;
    }
    setTeacher(user);

    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);

    // Fetch Data
    fetchDashboardData(user.id);
  }, [navigate]);

  const fetchDashboardData = async (teacherId) => {
    const statsData = await apiService.getTeacherStats(teacherId);
    if (statsData) setStats(statsData);

    const sessionsData = await apiService.getTeacherSessions(teacherId);
    if (sessionsData) {
      // Sort by date/time ascending (nearest first)
      const sorted = [...sessionsData].sort((a, b) => {
        const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
        const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
        return dateA - dateB;
      });
      setSessions(sorted);
    }

    const contentData = await apiService.getTeacherContent(teacherId);
    if (contentData) setUploads(contentData);
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/public/Login');
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
    if (sessionToEdit) {
      const updated = await apiService.updateSession(sessionToEdit.id, {
        ...sessionData,
        teacherId: teacher.id
      });
      if (updated) {
        showToast('Session updated successfully', 'success');
        fetchDashboardData(teacher.id);
      }
    } else {
      const newSession = await apiService.createSession({
        teacherId: teacher.id,
        ...sessionData
      });
      if (newSession) {
        showToast('Session scheduled successfully', 'success');
        fetchDashboardData(teacher.id);
      }
    }
  };

  const handleCreatePost = async (postData) => {
    if (postData.id) {
      const updated = await apiService.updateContent(postData.id, postData);
      if (updated) {
        showToast('Post updated successfully', 'success');
        fetchDashboardData(teacher.id);
      }
    } else {
      const newPost = await apiService.uploadContent({
        teacherId: teacher.id,
        ...postData
      });
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
    else if (actionType === 'post') setIsPostModalOpen(true);
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
    } else if (actionType === 'editAnnouncement') {
      // For now, announcements edit can reuse post modal or content modal
      // But CreatePostModal needs to be updated to support editing
      setPostToEdit(data);
      setIsPostModalOpen(true);
    }
  };

  if (!teacher) {
    return <div className="teacher-loading">Loading...</div>;
  }

  const quickActions = [
    { icon: 'upload_file', title: 'Upload Content', desc: 'Add new video courses or learning materials.', action: () => setIsUploadModalOpen(true) },
    { icon: 'video_call', title: 'Create Session', desc: 'Schedule a live 1-on-1 or group session.', action: () => setIsSessionModalOpen(true) },
    { icon: 'edit_note', title: 'New Post', desc: 'Share updates, tips, or announcements.', action: () => setIsPostModalOpen(true) },
  ];

  return (
    <div className={`teacher-container ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="teacher-sidebar">
        <div className="sidebar-header" onClick={() => navigate('/private/Home')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo">
            <img src="http://localhost:5000/uploads/images/logo.png" alt="Skillit Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 className="sidebar-title">Skillit</h1>
            <p className="sidebar-subtitle">Teacher Pro</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="material-symbols-outlined">grid_view</span>
            Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'bids' ? 'active' : ''}`} onClick={() => setActiveTab('bids')}>
            <span className={`material-symbols-outlined ${activeTab === 'bids' ? '' : 'inactive-icon'}`}>request_quote</span>
            Bid Requests
          </div>
          <div className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
            <span className={`material-symbols-outlined ${activeTab === 'content' ? '' : 'inactive-icon'}`}>video_library</span>
            My Content
          </div>
          <div className={`nav-item ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>
            <span className={`material-symbols-outlined ${activeTab === 'sessions' ? '' : 'inactive-icon'}`}>calendar_today</span>
            Sessions
          </div>
          <div className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
            <span className={`material-symbols-outlined ${activeTab === 'earnings' ? '' : 'inactive-icon'}`}>payments</span>
            Earnings
          </div>          <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <span className={`material-symbols-outlined ${activeTab === 'analytics' ? '' : 'inactive-icon'}`}>analytics</span>
            Analytics
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDv9-Uyk-56DG1mXKiFWmATUxMVx2J6hresnWGPKS5oP2hBTyBxHkNhb8kyK1N2Ixs9bch7ulzGXHom9sr-LwtzZdfkoVBwRQ2C8NBhCP3i0cczazuQfEnbYBLdevKNj5mNUaYEwK9NzOm5VeCZXtwyGBuSRJgQTL8cuj9MWqQddeZcVhW8xBQp8cVe17tHpOsbSjrL_j1QoC5ruu5q5RMokASYW2wp6Tdx2nHAwRRmO_ELc9bcVnfRwuoOpW_-SG3palPOsltDUCc')" }} />
            <div className="user-info">
              <p className="user-name">{teacher.fullname || teacher.fullName || 'Teacher'}</p>
              <p className="user-title">Verified Teacher</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="teacher-main">
        {/* Navbar */}
        <header className="teacher-navbar">
          <div className="navbar-left">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'bids' && 'Bid Requests'}
              {activeTab === 'content' && 'My Content'}
              {activeTab === 'sessions' && 'Sessions Schedule'}
              {activeTab === 'earnings' && 'Earnings & Payouts'}
              {activeTab === 'analytics' && 'Performance Analytics'}
            </h2>
          </div>
          <div className="navbar-right">
            <button className="navbar-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot"></span>
            </button>
            <div className="navbar-divider"></div>
            <div className="earnings-display">
              <span className="material-symbols-outlined">monetization_on</span>
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
              quickActions={quickActions}
              onAction={handleQuickAction}
              teacher={teacher}
            />
          )}

          {activeTab === 'bids' && <BidRequestsView />}

          {activeTab === 'content' && (
            <ContentView
              uploads={uploads}
              onUpload={() => setIsUploadModalOpen(true)}
              onAction={handleQuickAction}
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

          {(activeTab === 'earnings' || activeTab === 'analytics') && (
            <div className="empty-state" style={{ padding: '4rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#ccc' }}>engineering</span>
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
