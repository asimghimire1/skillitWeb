import React, { useState, useMemo } from 'react';
import StudentContentCard from './StudentContentCard';
import {
  Play,
  Calendar,
  Clock,
  BookOpen,
  Video,
  CheckCircle,
  Lock,
  ExternalLink,
  Sparkles,
  Gavel,
  Tag
} from 'lucide-react';

const MyLearningView = ({
  sessions,
  content,
  enrollments,
  unlockedContent,
  onWatchContent,
  onJoinSession
}) => {
  // Safe array defaults
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeContent = Array.isArray(content) ? content : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeUnlockedContent = Array.isArray(unlockedContent) ? unlockedContent : [];

  const [activeTab, setActiveTab] = useState('content');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [contentFilter, setContentFilter] = useState('all');

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
    if (sessionFilter === 'all') return enrolledSessions;
    return enrolledSessions.filter(s => s.status === sessionFilter);
  }, [enrolledSessions, sessionFilter]);

  // Get my content (joined/enrolled/purchased/bid-won)
  const myContent = useMemo(() => {
    return safeContent.filter(item => 
      safeUnlockedContent.some(u => u.contentId === item.id || u.id === item.id)
    ).map(item => {
      const unlockRecord = safeUnlockedContent.find(u => 
        u.contentId === item.id || u.id === item.id
      );
      return {
        ...item,
        joinType: unlockRecord?.type || 'joined',
        joinedAt: unlockRecord?.createdAt || unlockRecord?.created_at
      };
    });
  }, [safeContent, safeUnlockedContent]);

  // Filter content by join type
  const filteredContent = useMemo(() => {
    if (contentFilter === 'all') return myContent;
    return myContent.filter(c => c.joinType === contentFilter);
  }, [myContent, contentFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return '#22c55e';
      case 'upcoming': return '#3b82f6';
      case 'completed': return '#886364';
      case 'missed': return '#ef4444';
      default: return '#886364';
    }
  };

  const getJoinTypeBadge = (type) => {
    switch (type) {
      case 'free':
        return { text: 'Free', icon: <Sparkles size={12} />, className: 'badge-free' };
      case 'paid':
        return { text: 'Purchased', icon: <Tag size={12} />, className: 'badge-paid' };
      case 'bid':
        return { text: 'Won Bid', icon: <Gavel size={12} />, className: 'badge-bid' };
      default:
        return { text: 'Joined', icon: <CheckCircle size={12} />, className: 'badge-joined' };
    }
  };

  const tabs = [
    { id: 'content', label: 'My Content', icon: <Video size={16} />, count: myContent.length },
    { id: 'sessions', label: 'My Sessions', icon: <Calendar size={16} />, count: enrolledSessions.length },
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

      {/* My Content Tab */}
      {activeTab === 'content' && (
        <div className="learning-content">
          {/* Content Filter */}
          <div className="learning-filter-bar">
            <span className="filter-label">Filter:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'free', label: 'Free' },
              { id: 'paid', label: 'Purchased' },
              { id: 'bid', label: 'Won Bids' }
            ].map(filter => (
              <button
                key={filter.id}
                className={`filter-chip ${contentFilter === filter.id ? 'active' : ''}`}
                onClick={() => setContentFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {filteredContent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Video size={24} />
              </div>
              <h3 className="empty-state-title">No Content Yet</h3>
              <p className="empty-state-text">
                {contentFilter === 'all' 
                  ? "You haven't joined any content yet. Explore content to start learning!"
                  : `No ${contentFilter === 'free' ? 'free' : contentFilter === 'paid' ? 'purchased' : 'bid-won'} content found.`}
              </p>
            </div>
          ) : (
            <div className="student-content-grid">
              {filteredContent.map((item, idx) => (
                <StudentContentCard
                  key={item.id || idx}
                  content={{
                    ...item,
                    joinedAt: item.joinedAt
                  }}
                  isUnlocked={true}
                  onWatchNow={onWatchContent}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="learning-content">
          {/* Status Filter */}
          <div className="learning-filter-bar">
            <span className="filter-label">Filter:</span>
            {['all', 'live', 'upcoming', 'completed', 'missed'].map(status => (
              <button
                key={status}
                className={`filter-chip ${sessionFilter === status ? 'active' : ''}`}
                onClick={() => setSessionFilter(status)}
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
                {sessionFilter === 'all' 
                  ? "You haven't enrolled in any sessions yet."
                  : `No ${sessionFilter} sessions found.`}
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
    </div>
  );
};

export default MyLearningView;
