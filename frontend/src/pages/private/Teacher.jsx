import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/UploadModal';
import CreateSessionModal from '../../components/CreateSessionModal';
import CreatePostModal from '../../components/CreatePostModal';
import apiService from '../../services/apiService';
import '../../css/teacher.css';

// --- Sub-components (Views) ---

const DashboardView = ({ stats, uploads, sessions, quickActions, onAction }) => {
  const announcements = uploads.filter(u => u.category === 'Announcements').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recentUploads = uploads.filter(u => u.category !== 'Announcements').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const statCards = [
    { icon: 'group', label: 'Total Students', value: stats.totalStudents },
    { icon: 'video_chat', label: 'Active Sessions', value: stats.activeSessions },
    { icon: 'cloud_upload', label: 'Total Uploads', value: stats.totalUploads },
    { icon: 'payments', label: 'Monthly Earnings', value: `NPR ${stats.monthlyEarnings.toLocaleString()}` },
  ];

  return (
    <>
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, idx) => (
            <div
              key={idx}
              className="action-card"
              onClick={action.action}
              style={{ cursor: 'pointer' }}
            >
              <div className="action-icon">
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="content-grid">
        <div className="main-content-column">
          {/* Announcements Section */}
          <div className="announcements-section" style={{ marginBottom: '2.5rem' }}>
            <div className="uploads-section-header">
              <h2 className="section-title">Latest announcements</h2>
              {announcements.length > 2 && (
                <button className="view-all-btn" onClick={() => onAction('content')}>View More</button>
              )}
            </div>
            {announcements.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p className="empty-state-text">No announcements yet</p>
                <button className="view-all-btn" onClick={() => onAction('post')} style={{ marginTop: '0.5rem' }}>Create Post</button>
              </div>
            ) : (
              <div className="posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.slice(0, 2).map((post, idx) => (
                  <div key={idx} className="action-card" style={{ padding: '1.5rem', cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="upload-badge badge-published" style={{ position: 'static' }}>Announcement</span>
                      <span style={{ fontSize: '0.75rem', color: '#886364' }}>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{post.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Uploads Section */}
          <div className="uploads-section">
            <div className="uploads-section-header">
              <h2 className="section-title">Recent Uploads</h2>
              <button className="view-all-btn" onClick={() => onAction('content')}>View All</button>
            </div>
            {recentUploads.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined empty-state-icon">cloud_upload</span>
                <p className="empty-state-text">No content uploaded yet</p>
                <button className="view-all-btn" onClick={() => onAction('upload')} style={{ marginTop: '1rem' }}>Upload Content</button>
              </div>
            ) : (
              <div className="uploads-grid">
                {recentUploads.slice(0, 2).map((upload, idx) => (
                  <div key={idx} className="upload-card">
                    <div className="upload-thumbnail" style={{ background: '#000' }}>
                      {upload.thumbnail ? (
                        <div className="thumbnail-overlay" style={{ backgroundImage: `url('${upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                      ) : (
                        <div className="thumbnail-overlay" style={{ backgroundImage: `url('https://via.placeholder.com/300?text=No+Thumbnail')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                      )}
                      {upload.type === 'video' && <span className="material-symbols-outlined" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '3rem' }}>play_circle</span>}
                      <div className={`upload-badge badge-${upload.status || 'published'}`}>{upload.status || 'Published'}</div>
                      <div className="upload-duration">{upload.duration || '0:00'}</div>
                    </div>
                    <div className="upload-info">
                      <h4 className="upload-title">{upload.title}</h4>
                      <div className="upload-meta">
                        <span>{upload.views || 0} views</span>
                        <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sessions-section">
          <h2 className="section-title">Upcoming Sessions</h2>
          {sessions.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No upcoming sessions</p>
              <button className="view-all-btn" onClick={() => onAction('session')} style={{ marginTop: '10px' }}>Create Session</button>
            </div>
          ) : (
            sessions.slice(0, 3).map((session, idx) => (
              <div key={idx} className="session-item">
                <div className="session-header">
                  <div>
                    <h4 className="session-title">{session.title}</h4>
                    <p className="session-time">
                      {new Date(session.scheduledDate).toLocaleDateString()} at {session.scheduledTime}
                    </p>
                  </div>
                  <div className="session-price" style={{ fontWeight: 'bold', color: '#4caf50' }}>
                    NPR {session.price}
                  </div>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`status-badge status-${session.status}`}>{session.status}</span>
                  {session.meetingLink ? (
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="session-button" style={{ textAlign: 'center', textDecoration: 'none' }}>Join Session</a>
                  ) : (
                    <button className="session-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>No Link</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const ContentView = ({ uploads, onUpload }) => {
  const libraryContent = uploads.filter(u => u.category !== 'Announcements');

  return (
    <div>
      <div className="uploads-section-header">
        <h2 className="section-title">My Content Library</h2>
        <button className="continue-btn" onClick={onUpload} style={{ width: 'auto' }}>
          <span className="material-symbols-outlined">add</span> Upload New
        </button>
      </div>
      <div className="uploads-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {libraryContent.length === 0 ? (
          <p>No content found.</p>
        ) : (
          libraryContent.map((upload, idx) => (
            <div key={idx} className="upload-card">
              <div className="upload-thumbnail" style={{ background: '#000' }}>
                {upload.videoUrl ? (
                  <video
                    src={upload.videoUrl.startsWith('http') ? upload.videoUrl : `http://localhost:5000${upload.videoUrl}`}
                    className="thumbnail-overlay"
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative' }}
                  />
                ) : (
                  <div className="thumbnail-overlay" style={{ backgroundImage: `url('${upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : 'https://via.placeholder.com/300'}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                )}
                <div className={`upload-badge badge-${upload.status || 'published'}`}>{upload.status || 'Published'}</div>
              </div>
              <div className="upload-info">
                <h4 className="upload-title">{upload.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{upload.description}</p>
                <div className="upload-meta">
                  <span>{upload.views || 0} views</span>
                  <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SessionsView = ({ sessions, onCreate }) => (
  <div>
    <div className="uploads-section-header">
      <h2 className="section-title">All Sessions</h2>
      <button className="continue-btn" onClick={onCreate} style={{ width: 'auto' }}>
        <span className="material-symbols-outlined">add</span> Schedule Session
      </button>
    </div>
    <div className="sessions-list">
      {sessions.length === 0 ? <p>No sessions scheduled.</p> : sessions.map((session, idx) => (
        <div key={idx} className="session-item-professional">
          <div className="session-accent"></div>
          <div className="session-main-info">
            <div className="session-time-badge">
              <span className="material-symbols-outlined">calendar_today</span>
              {new Date(session.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              <span className="time-sep">•</span>
              <span className="material-symbols-outlined">schedule</span>
              {session.scheduledTime}
            </div>
            <h4 className="session-title-large">{session.title}</h4>
            <div className="session-details-row">
              <span className="detail-pill"><span className="material-symbols-outlined">timer</span> {session.duration} mins</span>
              <span className="detail-pill pricing">NPR {session.price}</span>
              <span className={`status-pill status-${session.status}`}>{session.status}</span>
            </div>
            {session.description && <p className="session-desc-text">{session.description}</p>}
          </div>
          <div className="session-actions-compact">
            {session.meetingLink ? (
              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="session-join-pill">
                Join Meeting
              </a>
            ) : (
              <button className="session-join-pill disabled" disabled>No Link</button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Teacher() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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
    if (sessionsData) setSessions(sessionsData);

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
      fetchDashboardData(teacher.id);
    }
  };

  const handleCreateSession = async (sessionData) => {
    const newSession = await apiService.createSession({
      teacherId: teacher.id,
      ...sessionData
    });
    if (newSession) {
      fetchDashboardData(teacher.id);
    }
  };

  const handleCreatePost = async (postData) => {
    const newPost = await apiService.uploadContent({
      teacherId: teacher.id,
      ...postData
    });
    if (newPost) {
      fetchDashboardData(teacher.id);
    }
  };

  const handleQuickAction = (actionType) => {
    if (actionType === 'upload') setIsUploadModalOpen(true);
    else if (actionType === 'session') setIsSessionModalOpen(true);
    else if (actionType === 'content') setActiveTab('content'); // Navigate to content tab
    else if (actionType === 'post') setIsPostModalOpen(true);
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
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="material-symbols-outlined">bolt</span>
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
          </div>
          <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <span className={`material-symbols-outlined ${activeTab === 'analytics' ? '' : 'inactive-icon'}`}>analytics</span>
            Analytics
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDv9-Uyk-56DG1mXKiFWmATUxMVx2J6hresnWGPKS5oP2hBTyBxHkNhb8kyK1N2Ixs9bch7ulzGXHom9sr-LwtzZdfkoVBwRQ2C8NBhCP3i0cczazuQfEnbYBLdevKNj5mNUaYEwK9NzOm5VeCZXtwyGBuSRJgQTL8cuj9MWqQddeZcVhW8xBQp8cVe17tHpOsbSjrL_j1QoC5ruu5q5RMokASYW2wp6Tdx2nHAwRRmO_ELc9bcVnfRwuoOpW_-SG3palPOsltDUCc')" }} />
            <div className="user-info">
              <p className="user-name">{teacher.fullName || 'Teacher'}</p>
              <p className="user-title">Master Creator</p>
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
              <h1 className="welcome-title">Welcome back, {teacher.fullName || 'Teacher'}</h1>
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
            />
          )}

          {activeTab === 'content' && (
            <ContentView uploads={uploads} onUpload={() => setIsUploadModalOpen(true)} />
          )}

          {activeTab === 'sessions' && (
            <SessionsView sessions={sessions} onCreate={() => setIsSessionModalOpen(true)} />
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
        teacherName={teacher.fullName}
      />
      <CreateSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onCreate={handleCreateSession}
      />
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
}
