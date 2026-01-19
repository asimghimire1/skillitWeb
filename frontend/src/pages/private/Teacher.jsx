import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/UploadModal';
import '../../css/teacher.css';

const STAT_CARDS = [
  { icon: 'group', label: 'Total Students', value: '0' },
  { icon: 'video_chat', label: 'Active Sessions', value: '0' },
  { icon: 'cloud_upload', label: 'Total Uploads', value: '0' },
  { icon: 'payments', label: 'Monthly Earnings', value: '$0' },
];

const QUICK_ACTIONS = [
  { icon: 'upload_file', title: 'Upload Content', desc: 'Add new video courses or learning materials to your library.' },
  { icon: 'video_call', title: 'Create Session', desc: 'Schedule a live 1-on-1 or group session with your students.' },
  { icon: 'edit_note', title: 'New Post', desc: 'Share updates, tips, or announcements with your community.' },
];

const SESSIONS = [
  {
    title: 'Portfolio Review',
    time: 'Starts in 15 mins',
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2_2-mmxZ5RJzYFpUSYic3PdgDyioSTTw8eZDlq1E9MKIrUMeUzctHrLxMGuHI0V1umr1mj3XF9BZDxWK6gn2zRQYWUGf15pveqFFK2N-OvHTDzSpa91qzhZ7S4m3OPc67S6s45rAGSMJV4Ym91Mt8TkWEwDcotG9pmP_H0WSrAb6zbWDHKqA-2D7FxpgXOTNs57wO0SJUoZU_YKOtm02pUdpqFawXmApGH3UY8UzfxqxgiRQZgoXDdWZVTi-ynTa4Pn0vl2MZlMA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAsOYkySvV-AeuLzkNyjyX0rvDipfKiQCK2UBqtPH4iWhMQRY3SE1iNVStnuWQ-c3BL-Fe-PMG5W6mpCfrjTA5_hCJcVSL7IcooQcxzQyKQIVDYFvDOxovMDzNsNG2iUDyUkhLPmUHkbWin2AFZfOWiGgHCcxkh0P8QMGAqHD8b8VIUaqpb0XH7eENFTJjH2kzSHYh2HWnsCGrkUVgqOxC6txt0NIobv9liCjuMoJ8ihuoPtwEjAGjxMZwe6TNVIQH7HrjJ8Oe8zA',
    ],
    more: 3,
    hasButton: true,
  },
  {
    title: 'Design Strategy 1-on-1',
    time: 'Today, 4:00 PM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPlKfBUIHvHdD5XdYa_kRu674BGLgaeMhMwS9_u51lXp2vsUZXhw-z5Ase7XkR2YXu3hKY8ox8QG9xEGSO-nEf4IgmBkGOBxNSo_HnAWvjAASh223qsiN5Akbl4t3OsBAQiE3cUFR6Uf9R_hjuiIIwfREfMCG7b61nHQd2WqQbQKdJ-ycdbwsw0E5sk1Nnpu7T_W_4hew4rkESnGO1czcTaOcByTxUJRYYOKJmIxxdidkhGJ54BiK9jQHmDMPY0eXaknrdPu_AIR4',
  },
  {
    title: 'Freelancing Basics',
    time: 'Tomorrow, 10:00 AM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfNT5ZpEewubeXu6jJ8GsFGmwGCgticeEE1CVo9Sx5QTZO-JynzTegKpDlrmn7uyeQansPysbxqQ4ydqhJsv5K1VZf8ikiMn3oE4OCbDb9UaWwvunFuIGYMRT1I_RUWiBdF7x2KjskrrEx-csytF8W3NCdjC7LF0YT8bagGA5KAj9JPIZJw3OCIRCwBXHl-pKKvngYDYuQujL_jc6bsXj04RNLx4G6ur0xHWvZEInlhqqs421O29EPQ1nf3ZAh4ox6A5asQsBNIpU',
  },
];

export default function Teacher() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'teacher') {
      navigate('/private/Home');
      return;
    }
    setTeacher(user);
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/public/Login');
  };

  const handleUploadContent = (uploadData) => {
    setUploads([uploadData, ...uploads]);
  };

  if (!teacher) {
    return <div className="teacher-loading">Loading...</div>;
  }

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
          <a href="#" className="nav-item active">
            <span className="material-symbols-outlined">grid_view</span>
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined inactive-icon">video_library</span>
            My Content
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined inactive-icon">calendar_today</span>
            Sessions
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined inactive-icon">payments</span>
            Earnings
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined inactive-icon">analytics</span>
            Analytics
          </a>
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
            <div className="navbar-search">
              <span className="search-icon material-symbols-outlined">search</span>
              <input className="search-input" placeholder="Search sessions..." type="text" />
            </div>
          </div>
          <div className="navbar-right">
            <button className="navbar-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot"></span>
            </button>
            <button className="navbar-btn">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="navbar-divider"></div>
            <div className="earnings-display">
              <span className="material-symbols-outlined">monetization_on</span>
              <span>$12,450.00</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="teacher-content">
          {/* Welcome */}
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {teacher.fullName || 'Teacher'}</h1>
            <p className="welcome-subtitle">Here's what happened with your classes today.</p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {STAT_CARDS.map((stat, idx) => (
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

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              {QUICK_ACTIONS.map((action, idx) => (
                <div 
                  key={idx} 
                  className="action-card"
                  onClick={() => action.title === 'Upload Content' && setIsModalOpen(true)}
                  style={{ cursor: action.title === 'Upload Content' ? 'pointer' : 'default' }}
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

          {/* Bottom Grid */}
          <div className="content-grid">
            {/* Recent Uploads */}
            <div>
              <div className="uploads-section-header">
                <h2 className="section-title">Recent Uploads</h2>
                <button className="view-all-btn">View All</button>
              </div>
              {uploads.length === 0 ? (
                <div className="empty-state">
                  <span className="material-symbols-outlined empty-state-icon">
                    cloud_upload
                  </span>
                  <p className="empty-state-text">
                    No content uploaded yet
                  </p>
                  <button 
                    className="view-all-btn"
                    onClick={() => setIsModalOpen(true)}
                    style={{ marginTop: '1rem' }}
                  >
                    Upload Content
                  </button>
                </div>
              ) : (
                <div className="uploads-grid">
                  {uploads.map((upload, idx) => (
                    <div key={idx} className="upload-card">
                      <div className="upload-thumbnail">
                        <div className="thumbnail-overlay" style={{ backgroundImage: `url('${upload.thumbnail}')` }} />
                        <div className={`upload-badge badge-${upload.badge}`}>{upload.badge}</div>
                        <div className="upload-duration">{upload.duration}</div>
                      </div>
                      <div className="upload-info">
                        <h4 className="upload-title">{upload.title}</h4>
                        <div className="upload-meta">
                          <span>{upload.views}</span>
                          <span>{upload.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Sessions */}
            <div className="sessions-section">
              <h2 className="section-title">Upcoming Sessions</h2>
              {SESSIONS.map((session, idx) => (
                <div key={idx} className={session.hasButton ? 'session-item' : 'session-item session-item-compact'}>
                  {session.hasButton ? (
                    <>
                      <div className="session-header">
                        <div>
                          <h4 className="session-title">{session.title}</h4>
                          <p className="session-time">{session.time}</p>
                        </div>
                        <div className="session-avatars">
                          {session.avatars.map((avatar, i) => (
                            <div key={i} className="avatar-small" style={{ backgroundImage: `url('${avatar}')` }} />
                          ))}
                          <div className="avatar-more">+{session.more}</div>
                        </div>
                      </div>
                      <button className="session-button">Join Session</button>
                    </>
                  ) : (
                    <>
                      <div className="session-info">
                        <h4 className="session-title">{session.title}</h4>
                        <p className="session-time">{session.time}</p>
                      </div>
                      <div className="session-avatar" style={{ backgroundImage: `url('${session.avatar}')` }} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUploadContent}
        teacherName={teacher.fullName}
      />
    </div>
  );
}