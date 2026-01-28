import React, { useState } from 'react';
import StudentContentCard from './StudentContentCard';
import SessionCard from './SessionCard';
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
  User,
  Gavel,
  CheckCircle,
  XCircle,
  MessageSquare
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
  bids,
  onAction,
  onJoinContent,
  onMakeBid,
  onCancelBid,
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
  const safeBids = Array.isArray(bids) ? bids : [];

  // Debug logging
  console.log('[DashboardView] content prop:', content);
  console.log('[DashboardView] safeContent length:', safeContent.length);

  // Get available sessions (not enrolled) - show 3 for dashboard
  // Get available sessions (show upcoming sessions, both enrolled and not) - show 3 for dashboard
  const availableSessions = safeSessions
    .filter(s => {
      const sessionDate = new Date(`${s.scheduledDate}T${s.scheduledTime || '00:00'}`);
      const now = new Date();
      return sessionDate > now; // Only filter by future date
    })
    .sort((a, b) => new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`) - new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`))
    .slice(0, 3)
    .map(s => {
      const teacher = safeTeachers.find(t => t.id === s.teacherId);
      const isEnrolled = safeEnrollments.some(e => e.sessionId === s.id || e.id === s.id);
      return {
        ...s,
        teacherName: s.teacherName || teacher?.fullname || teacher?.fullName || 'Teacher',
        teacherAvatar: s.teacherAvatar || teacher?.profilePicture || teacher?.avatar,
        isEnrolled
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

  // Get latest bids - show only 2 on dashboard
  const latestBids = [...safeBids]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2)
    .map(bid => {
      // Enrich with content/session info
      let itemTitle = '';
      let itemType = '';
      if (bid.sessionId) {
        const session = safeSessions.find(s => s.id === bid.sessionId);
        itemTitle = bid.sessionTitle || session?.title || 'Session';
        itemType = 'session';
      } else if (bid.contentId) {
        const contentItem = safeContent.find(c => c.id === bid.contentId);
        itemTitle = bid.contentTitle || contentItem?.title || 'Content';
        itemType = 'content';
      }
      return { ...bid, itemTitle, itemType };
    });

  // Get bid status config
  const getBidStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { color: '#f59e0b', bg: '#fef3c7', icon: <Clock size={14} />, label: 'Pending' };
      case 'counter':
      case 'countered':
        return { color: '#3b82f6', bg: '#dbeafe', icon: <MessageSquare size={14} />, label: 'Counter Offer' };
      case 'accepted':
        return { color: '#22c55e', bg: '#dcfce7', icon: <CheckCircle size={14} />, label: 'Accepted' };
      case 'rejected':
        return { color: '#ef4444', bg: '#fee2e2', icon: <XCircle size={14} />, label: 'Declined' };
      default:
        return { color: '#6b7280', bg: '#f3f4f6', icon: <Clock size={14} />, label: status };
    }
  };

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
                hasPendingBid={safeBids.some(b => b.contentId === contentItem.id && b.status === 'pending')}
                onJoinContent={onJoinContent}
                onMakeBid={onMakeBid}
                onCancelBid={onCancelBid}
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
                onCancelBid={onCancelBid}
                isEnrolled={session.isEnrolled}
                hasPendingBid={safeBids.some(b => b.sessionId === session.id && b.status === 'pending')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Latest Bids Section */}
      <div className="uploads-section dashboard-section">
        <div className="uploads-section-header">
          <h2 className="section-title">My Latest Bids</h2>
          <button className="view-all-btn" onClick={() => onAction('bids')}>View All Bids</button>
        </div>
        {latestBids.length === 0 ? (
          <div className="dashboard-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div className="empty-state">
              <div className="empty-state-icon" style={{ backgroundColor: '#f9f9f9' }}>
                <Gavel size={28} style={{ color: '#ccc' }} />
              </div>
              <p className="empty-state-text">No bids placed yet</p>
              <button className="empty-state-link" style={{ marginTop: '0.5rem' }} onClick={() => onAction('explore')}>Browse Content</button>
            </div>
          </div>
        ) : (
          <div className="student-bids-grid">
            {latestBids.map((bid, idx) => {
              const statusConfig = getBidStatusConfig(bid.status);
              return (
                <div key={bid.id || idx} className="student-bid-card">
                  <div className="student-bid-header">
                    <div 
                      className="student-bid-status"
                      style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                    >
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </div>
                    <span className="student-bid-price">NPR {(bid.proposedPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="student-bid-item">
                    <span className="student-bid-type">
                      {bid.itemType === 'session' ? <Calendar size={14} /> : <Video size={14} />}
                      {bid.itemType === 'session' ? 'Session' : 'Content'}
                    </span>
                    <h4 className="student-bid-title">{bid.itemTitle}</h4>
                  </div>
                  {bid.message && (
                    <p className="student-bid-message">"{bid.message}"</p>
                  )}
                  <div className="student-bid-footer">
                    <span className="student-bid-date">
                      {new Date(bid.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {bid.status === 'countered' && bid.counterOffer && (
                      <span className="student-bid-counter">
                        Counter: NPR {JSON.parse(bid.counterOffer).price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Latest Teacher Posts - Full Width */}
      <div className="dashboard-section">
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
                            backgroundImage: `url('${teacher?.profilePicture || teacher?.avatar || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || "Teacher") + "&background=ea2a33&color=fff"}')`
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
