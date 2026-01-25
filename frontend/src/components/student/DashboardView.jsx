import React, { useState } from 'react';
import StudentContentCard from './StudentContentCard';
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
  ChevronDown,
  MapPin,
  Play,
  User
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
  onAction,
  onJoinContent,
  onMakeBid,
  onWatchContent,
  onEnrollSession
}) => {
  // Ensure arrays have default values
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeContent = Array.isArray(content) ? content : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safePosts = Array.isArray(recentPosts) ? recentPosts : [];
  const safeUnlockedContent = Array.isArray(unlockedContent) ? unlockedContent : [];

  // Debug logging
  console.log('[DashboardView] content prop:', content);
  console.log('[DashboardView] safeContent length:', safeContent.length);

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

  // Get available sessions (not enrolled) - show 3 for dashboard
  const availableSessions = safeSessions
    .filter(s => {
      const sessionDate = new Date(`${s.scheduledDate}T${s.scheduledTime}`);
      const now = new Date();
      const isNotEnrolled = !safeEnrollments.some(e => e.sessionId === s.id || e.id === s.id);
      return sessionDate > now && isNotEnrolled;
    })
    .sort((a, b) => new Date(`${a.scheduledDate}T${a.scheduledTime}`) - new Date(`${b.scheduledDate}T${b.scheduledTime}`))
    .slice(0, 3)
    .map(s => {
      const teacher = safeTeachers.find(t => t.id === s.teacherId);
      return {
        ...s,
        teacherName: s.teacherName || teacher?.fullname || teacher?.fullName || 'Teacher',
        teacherAvatar: s.teacherAvatar || teacher?.profilePicture || teacher?.avatar
      };
    });

  // Get recent content - videos uploaded by teachers (enriched with teacher info)
  const recentContent = safeContent
    .filter(c => c.category !== 'Announcements')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map(c => {
      const teacher = safeTeachers.find(t => t.id === c.teacherId);
      const unlockRecord = safeUnlockedContent.find(u => u.contentId === c.id || u.id === c.id);
      return {
        ...c,
        teacherName: c.teacherName || teacher?.fullname || teacher?.fullName || 'Teacher',
        teacherAvatar: c.teacherAvatar || teacher?.profilePicture || teacher?.avatar,
        isUnlocked: !!unlockRecord,
        joinedAt: unlockRecord?.created_at || unlockRecord?.createdAt
      };
    });

  // Check if content is unlocked
  const isContentUnlocked = (contentId) => {
    return safeUnlockedContent.some(u => u.contentId === contentId || u.id === contentId);
  };

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

      {/* Recent Content Section - Uses StudentContentCard */}
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
          <div className="student-content-grid">
            {recentContent.map((contentItem, idx) => (
              <StudentContentCard
                key={contentItem.id || idx}
                content={contentItem}
                isUnlocked={contentItem.isUnlocked}
                onJoinContent={onJoinContent}
                onMakeBid={onMakeBid}
                onViewDetails={(item) => onAction('viewDetails', item)}
                onNotInterested={(item) => console.log('Not interested:', item.id)}
                onWatchNow={onWatchContent}
              />
            ))}
          </div>
        )}
      </div>

      {/* Available Sessions Section */}
      <div className="uploads-section dashboard-section">
        <div className="uploads-section-header">
          <h2 className="section-title">Available Sessions</h2>
          <button className="view-all-btn" onClick={() => onAction('sessions')}>View All Sessions</button>
        </div>
        {availableSessions.length === 0 ? (
          <div className="dashboard-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div className="empty-state">
              <div className="empty-state-icon" style={{ backgroundColor: '#f9f9f9' }}>
                <Calendar size={28} style={{ color: '#ccc' }} />
              </div>
              <p className="empty-state-text">No sessions available yet</p>
              <button className="empty-state-link" style={{ marginTop: '0.5rem' }} onClick={() => onAction('sessions')}>Browse Sessions</button>
            </div>
          </div>
        ) : (
          <div className="session-cards-grid">
            {availableSessions.map((session, idx) => (
              <SessionCard
                key={session.id || idx}
                session={session}
                onEnroll={onEnrollSession}
                onMakeBid={onMakeBid}
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

// Session Card Component for Available Sessions
const SessionCard = ({ session, onEnroll, onMakeBid }) => {
  const isFree = !session.price || session.price === 0;
  const allowsBidding = session.allowBidding === true;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="session-card-student">
      {/* Header with Date Badge */}
      <div className="session-card-header">
        <div className="session-date-badge">
          <Calendar size={14} />
          <span>{formatDate(session.scheduledDate)}</span>
        </div>
        {isFree ? (
          <span className="session-price-badge free">Free</span>
        ) : (
          <span className="session-price-badge paid">NPR {session.price?.toLocaleString()}</span>
        )}
      </div>

      {/* Session Info */}
      <div className="session-card-body">
        <h3 className="session-card-title">{session.title}</h3>
        
        {session.description && (
          <p className="session-card-desc">{session.description}</p>
        )}

        {/* Teacher Info */}
        <div className="session-teacher-row">
          <div 
            className="session-teacher-avatar"
            style={{
              backgroundImage: `url('${session.teacherAvatar || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(session.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
            }}
          />
          <div className="session-teacher-info">
            <span className="session-teacher-name">{session.teacherName || 'Teacher'}</span>
            {session.teacherTitle && <span className="session-teacher-title">{session.teacherTitle}</span>}
          </div>
        </div>

        {/* Session Meta */}
        <div className="session-meta-row">
          <span className="session-meta-item">
            <Clock size={14} />
            {session.scheduledTime}
          </span>
          <span className="session-meta-item">
            <VideoIcon size={14} />
            {session.duration || 60} mins
          </span>
          {session.maxParticipants && (
            <span className="session-meta-item">
              <User size={14} />
              {session.enrolledCount || 0}/{session.maxParticipants} spots
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="session-card-actions">
        {isFree ? (
          <button 
            className="session-action-btn enroll-free"
            onClick={() => onEnroll && onEnroll(session)}
          >
            <Play size={16} />
            Join Free
          </button>
        ) : allowsBidding ? (
          <>
            <button 
              className="session-action-btn enroll-paid"
              onClick={() => onEnroll && onEnroll(session)}
            >
              Enroll Now
            </button>
            <button 
              className="session-action-btn make-bid"
              onClick={() => onMakeBid && onMakeBid(session)}
            >
              Make a Bid
            </button>
          </>
        ) : (
          <button 
            className="session-action-btn enroll-paid"
            onClick={() => onEnroll && onEnroll(session)}
          >
            Enroll for NPR {session.price?.toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
