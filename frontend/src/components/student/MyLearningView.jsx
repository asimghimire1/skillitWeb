import React, { useState, useMemo } from 'react';
import {
  Play,
  Calendar,
  Clock,
  BookOpen,
  Video,
  CheckCircle,
  Lock,
  ExternalLink
} from 'lucide-react';

const MyLearningView = ({
  sessions,
  content,
  enrollments,
  unlockedContent,
  onUnlockContent
}) => {
  // Safe array defaults
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeContent = Array.isArray(content) ? content : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeUnlockedContent = Array.isArray(unlockedContent) ? unlockedContent : [];

  const [activeTab, setActiveTab] = useState('sessions');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get enrolled sessions with status
  const enrolledSessions = useMemo(() => {
    return safeSessions.filter(session => 
      safeEnrollments.some(e => e.sessionId === session.id || e.id === session.id)
    ).map(session => {
      const sessionDateTime = new Date(`${session.scheduledDate}T${session.scheduledTime}`);
      const now = new Date();
      const thirtyMinsAfter = new Date(sessionDateTime.getTime() + 30 * 60 * 1000);
      
      let status = 'upcoming';
      if (now > thirtyMinsAfter) {
        status = session.attended ? 'completed' : 'missed';
      } else if (now >= sessionDateTime) {
        status = 'live';
      }
      
      return { ...session, status };
    });
  }, [safeSessions, safeEnrollments]);

  // Filter sessions by status
  const filteredSessions = useMemo(() => {
    if (filterStatus === 'all') return enrolledSessions;
    return enrolledSessions.filter(s => s.status === filterStatus);
  }, [enrolledSessions, filterStatus]);

  // Get unlocked content
  const myContent = useMemo(() => {
    return safeContent.filter(item => 
      safeUnlockedContent.some(u => u.contentId === item.id || u.id === item.id)
    );
  }, [safeContent, safeUnlockedContent]);

  // Get locked content (available to unlock)
  const lockedContent = useMemo(() => {
    return safeContent.filter(item => 
      !safeUnlockedContent.some(u => u.contentId === item.id || u.id === item.id)
    );
  }, [content, unlockedContent]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return '#22c55e';
      case 'upcoming': return '#3b82f6';
      case 'completed': return '#886364';
      case 'missed': return '#ef4444';
      default: return '#886364';
    }
  };

  const tabs = [
    { id: 'sessions', label: 'My Sessions', icon: <Calendar size={16} />, count: enrolledSessions.length },
    { id: 'content', label: 'My Content', icon: <Video size={16} />, count: myContent.length },
    { id: 'discover', label: 'Discover', icon: <BookOpen size={16} />, count: lockedContent.length },
  ];

  return (
    <div className="my-learning-view">
      {/* Header */}
      <div className="learning-header">
        <h1 className="learning-title">My Learning</h1>
        <p className="learning-subtitle">Track your enrolled sessions and unlocked content</p>
      </div>

      {/* Tabs */}
      <div className="learning-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`learning-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            <span className="learning-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="learning-content">
          {/* Status Filter */}
          <div className="learning-filter-bar">
            <span className="filter-label">Filter:</span>
            {['all', 'live', 'upcoming', 'completed', 'missed'].map(status => (
              <button
                key={status}
                className={`filter-chip ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {filteredSessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Calendar size={24} />
              </div>
              <h3 className="empty-state-title">No Sessions Found</h3>
              <p className="empty-state-text">
                {filterStatus === 'all' 
                  ? "You haven't enrolled in any sessions yet."
                  : `No ${filterStatus} sessions found.`}
              </p>
            </div>
          ) : (
            <div className="enrolled-sessions-list">
              {filteredSessions.map((session, idx) => (
                <div key={session.id || idx} className="enrolled-session-card">
                  <div className="enrolled-session-status">
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(session.status) }}
                    />
                    <span className="status-text">{session.status}</span>
                  </div>

                  <div className="enrolled-session-info">
                    <h3 className="enrolled-session-title">{session.title}</h3>
                    <div className="enrolled-session-meta">
                      <span><Calendar size={14} /> {session.scheduledDate}</span>
                      <span><Clock size={14} /> {session.scheduledTime}</span>
                    </div>
                    {session.teacherName && (
                      <p className="enrolled-session-teacher">by {session.teacherName}</p>
                    )}
                  </div>

                  <div className="enrolled-session-actions">
                    {session.status === 'live' && session.meetingLink && (
                      <a 
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-join-live"
                      >
                        <Play size={16} /> Join Now
                      </a>
                    )}
                    {session.status === 'upcoming' && (
                      <span className="upcoming-badge">
                        <Clock size={14} /> Starting Soon
                      </span>
                    )}
                    {session.status === 'completed' && (
                      <span className="completed-badge">
                        <CheckCircle size={14} /> Completed
                      </span>
                    )}
                    {session.status === 'missed' && (
                      <span className="missed-badge">
                        Missed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Content Tab */}
      {activeTab === 'content' && (
        <div className="learning-content">
          {myContent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Video size={24} />
              </div>
              <h3 className="empty-state-title">No Content Unlocked</h3>
              <p className="empty-state-text">Unlock content to start learning.</p>
            </div>
          ) : (
            <div className="unlocked-content-grid">
              {myContent.map((item, idx) => (
                <div key={item.id || idx} className="unlocked-content-card">
                  <div 
                    className="content-thumbnail-learning"
                    style={{
                      backgroundImage: `url('${item.thumbnail || 'https://via.placeholder.com/300x170?text=No+Thumbnail'}')`
                    }}
                  >
                    <div className="content-play-overlay">
                      <Play size={32} />
                    </div>
                    {item.duration && (
                      <span className="content-duration-badge">{item.duration}</span>
                    )}
                    <span className="unlocked-badge">
                      <CheckCircle size={12} /> Unlocked
                    </span>
                  </div>
                  <div className="content-info-learning">
                    <h4 className="content-title-learning">{item.title}</h4>
                    <p className="content-teacher-learning">{item.teacherName || 'Teacher'}</p>
                    {item.category && (
                      <span className="content-category-badge">{item.category}</span>
                    )}
                  </div>
                  <button className="btn-watch-content">
                    <Play size={14} /> Watch Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div className="learning-content">
          {lockedContent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CheckCircle size={24} />
              </div>
              <h3 className="empty-state-title">All Content Unlocked!</h3>
              <p className="empty-state-text">You've unlocked all available content.</p>
            </div>
          ) : (
            <div className="locked-content-grid">
              {lockedContent.map((item, idx) => (
                <div key={item.id || idx} className="locked-content-card">
                  <div 
                    className="content-thumbnail-learning locked"
                    style={{
                      backgroundImage: `url('${item.thumbnail || 'https://via.placeholder.com/300x170?text=No+Thumbnail'}')`
                    }}
                  >
                    <div className="content-lock-overlay">
                      <Lock size={32} />
                    </div>
                    {item.duration && (
                      <span className="content-duration-badge">{item.duration}</span>
                    )}
                  </div>
                  <div className="content-info-learning">
                    <h4 className="content-title-learning">{item.title}</h4>
                    <p className="content-teacher-learning">{item.teacherName || 'Teacher'}</p>
                    <p className="content-price-learning">
                      {!item.price || item.price === 0 ? 'Free' : `NPR ${item.price.toLocaleString()}`}
                    </p>
                  </div>
                  <button 
                    className="btn-unlock-content"
                    onClick={() => onUnlockContent(item)}
                  >
                    <Lock size={14} /> 
                    {!item.price || item.price === 0 ? 'Unlock Free' : `Unlock for NPR ${item.price}`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLearningView;
