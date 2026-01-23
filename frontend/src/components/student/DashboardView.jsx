import React, { useState } from 'react';
import ContentCard from '../teacher/ContentCard';
import {
  Users,
  Video,
  Wallet,
  ArrowRight,
  Sparkles,
  Calendar,
  BookOpen,
  Clock,
  Flame,
  VideoIcon,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const DashboardView = ({ 
  stats, 
  sessions, 
  content, 
  teachers, 
  enrollments, 
  unlockedContent, 
  recentPosts, 
  student, 
  onAction 
}) => {
  // Ensure arrays have default values
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeContent = Array.isArray(content) ? content : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safePosts = Array.isArray(recentPosts) ? recentPosts : [];

  // Filter upcoming enrolled sessions - show max 1 like teacher dashboard
  // For now, show all upcoming sessions since enrollment feature is not yet implemented
  const upcomingSessions = safeSessions
    .filter(s => {
      const sessionDate = new Date(`${s.scheduledDate}T${s.scheduledTime}`);
      const now = new Date();
      const timeDiff = (now - sessionDate) / (1000 * 60);
      return timeDiff < 30; // Show sessions not more than 30 mins past
    })
    .sort((a, b) => new Date(`${a.scheduledDate}T${a.scheduledTime}`) - new Date(`${b.scheduledDate}T${b.scheduledTime}`))
    .slice(0, 1);

  // Get recent content - videos uploaded by teachers
  const recentContent = safeContent
    .filter(c => c.category !== 'Announcements')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  // Get latest posts - show only 2 like teacher dashboard
  const latestPosts = [...safePosts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

  // Find teacher for content
  const getTeacherForContent = (contentItem) => {
    return safeTeachers.find(t => t.id === contentItem.teacherId) || {
      fullname: contentItem.teacherName || 'Teacher',
      profilePicture: null
    };
  };

  // Find teacher for post
  const getTeacherForPost = (post) => {
    return safeTeachers.find(t => t.id === post.teacherId) || {
      fullname: post.teacherName || 'Teacher',
      profilePicture: null
    };
  };

  const statCards = [
    { icon: <Clock size={24} />, label: 'Hours Learned', value: stats.hoursLearned || 0, color: '#886364' },
    { icon: <Video size={24} />, label: 'Sessions Attended', value: stats.sessionsAttended || 0, color: '#886364' },
    { icon: <Wallet size={24} />, label: 'Credits Balance', value: `NPR ${(stats.credits || 0).toLocaleString()}`, color: '#ea2a33' },
  ];

  return (
    <>
      {/* Stats Grid - Same as teacher */}
      <div className="dashboard-stats-grid dashboard-section">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card hover-lift">
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}10` }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Content Section - Uses ContentCard from teacher */}
      <div className="uploads-section dashboard-section">
        <div className="uploads-section-header">
          <h2 className="section-title">Recent Content</h2>
          <button className="view-all-btn" onClick={() => onAction('explore')}>View All Content</button>
        </div>
        {recentContent.length === 0 ? (
          <div className="dashboard-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div className="empty-state">
              <div className="empty-state-icon" style={{ backgroundColor: '#f9f9f9' }}>
                <Video size={28} style={{ color: '#ccc' }} />
              </div>
              <p className="empty-state-text">No content available yet</p>
              <button className="empty-state-link" style={{ marginTop: '0.5rem' }} onClick={() => onAction('explore')}>Browse Content</button>
            </div>
          </div>
        ) : (
          <div className="recent-uploads-grid">
            {recentContent.map((upload, idx) => (
              <ContentCard
                key={idx}
                upload={upload}
                teacher={getTeacherForContent(upload)}
                onAction={null} // Students can't delete content
              />
            ))}
          </div>
        )}
      </div>

      {/* Side-by-Side: Recent Posts & Upcoming Sessions - Same as teacher */}
      <div className="dashboard-main-grid dashboard-section">
        {/* Recent Posts */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Latest Teacher Posts</h2>
            <button className="view-all-link" onClick={() => onAction('explore')}>
              View All <ArrowRight size={12} strokeWidth={3} />
            </button>
          </div>

          <div className="dashboard-card-body">
            {latestPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Sparkles size={24} />
                </div>
                <h3 className="empty-state-title">No Posts Yet</h3>
                <p className="empty-state-text">
                  Teacher announcements will appear here.
                </p>
              </div>
            ) : (
              <div className={`posts-list-grid ${latestPosts.length === 1 ? 'single-post' : ''}`}>
                {latestPosts.map((post, idx) => {
                  const teacher = getTeacherForPost(post);
                  return (
                    <div key={idx} className="post-card" style={{ margin: 0 }}>
                      <div className="post-card-header">
                        <div
                          className="post-avatar"
                          style={{
                            backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || "Teacher") + "&background=ea2a33&color=fff"}')`
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="post-author-name">{teacher?.fullname || 'Teacher'}</span>
                            <span className="post-teacher-badge">Teacher</span>
                          </div>
                          <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="post-content" style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical' 
                      }}>{post.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Upcoming Sessions</h2>
            <button className="view-all-link" onClick={() => onAction('mylearning')}>
              View All <ArrowRight size={12} strokeWidth={3} />
            </button>
          </div>
          <div className="dashboard-card-body">
            {upcomingSessions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Calendar size={24} />
                </div>
                <h3 className="empty-state-title">No Enrolled Sessions</h3>
                <p className="empty-state-text">
                  Your enrolled sessions will appear here.
                </p>
                <button className="empty-state-link" onClick={() => onAction('mylearning')}>Browse Sessions</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingSessions.map((session, idx) => (
                  <SessionItemCompact
                    key={session.id || idx}
                    session={session}
                    teacher={getTeacherForContent(session)}
                    onAction={onAction}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Session Item Component - Same style as teacher dashboard
const SessionItemCompact = ({ session, teacher, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleJoinClick = (e) => {
    e.stopPropagation();
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    }
  };

  return (
    <div className="session-item-compact" style={{ textAlign: 'left' }}>
      <div className="session-item-compact-top" style={{ alignItems: 'flex-start' }}>
        <div className="session-item-compact-header" style={{ width: '100%' }}>
          <div style={{ textAlign: 'left' }}>
            <h4 className="session-item-compact-title" style={{ textAlign: 'left' }}>{session.title}</h4>
            <p className="session-item-compact-date" style={{ textAlign: 'left' }}>
              {session.scheduledDate === new Date().toLocaleDateString() ? 'Today' : session.scheduledDate}, {session.scheduledTime}
            </p>
          </div>
        </div>

        <div className="session-item-compact-actions" style={{ justifyContent: 'flex-start' }}>
          {session.meetingLink && (
            <button
              className="session-join-btn-sm"
              onClick={handleJoinClick}
            >
              <VideoIcon size={14} />
              Join Session
            </button>
          )}
          <button
            className={`session-details-btn ${isExpanded ? 'active' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="session-expanded-details" style={{ textAlign: 'left' }}>
          <div className="session-details-grid">
            <div>
              <p className="session-detail-label">Duration</p>
              <p className="session-detail-value">{session.duration} mins</p>
            </div>
            <div>
              <p className="session-detail-label">Price</p>
              <p className="session-detail-value">{session.price > 0 ? `NPR ${session.price}` : 'Free'}</p>
            </div>
            <div>
              <p className="session-detail-label">Teacher</p>
              <p className="session-detail-value">{teacher?.fullname || session.teacherName || 'Teacher'}</p>
            </div>
            {session.notes && (
              <div style={{ gridColumn: 'span 2' }}>
                <p className="session-detail-label">Notes</p>
                <p className="session-detail-value" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{session.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
