import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import SessionListItem from './SessionListItem';
import ContentCard from './ContentCard';
import {
    Users,
    Video,
    Wallet,
    ArrowRight,
    Sparkles,
    Calendar,
    Banknote,
    History,
    TrendingUp,
    CloudUpload,
    ChevronUp,
    ChevronDown,
    Edit,
    VideoIcon,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
    Gavel
} from 'lucide-react';

const DashboardView = ({ stats, uploads, sessions, posts, quickActions, onAction, teacher, onSessionStatusUpdate, bids = [], onRespondToBid }) => {
    const { showToast } = useToast();
    // Use the passed posts, sorted by newest first - show only 2 latest
    const recentPosts = [...(posts || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 2);
    const recentUploads = uploads.filter(u => u.category !== 'Announcements').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Track clicked session links
    const [clickedSessions, setClickedSessions] = useState(() => {
        const saved = localStorage.getItem('clickedSessions');
        return saved ? JSON.parse(saved) : [];
    });

    // Filter sessions - show upcoming sessions
    const getFilteredSessions = () => {
        const now = new Date();
        
        console.log('[DashboardView] Total sessions:', sessions?.length);
        
        if (!sessions || sessions.length === 0) return [];
        
        return sessions.filter(session => {
            const sessionDateTime = new Date(`${session.scheduledDate}T${session.scheduledTime || '00:00'}`);
            const timeDiff = (now - sessionDateTime) / (1000 * 60); // difference in minutes
            
            // If session is more than 30 mins past, it should be moved to sessions view
            if (timeDiff > 30) {
                // Mark as missed or completed based on whether link was clicked
                const wasClicked = clickedSessions.includes(session.id);
                if (onSessionStatusUpdate && session.status !== 'completed' && session.status !== 'missed') {
                    onSessionStatusUpdate(session.id, wasClicked ? 'completed' : 'missed');
                }
                return false;
            }
            return true;
        }).sort((a, b) => {
            const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`);
            const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`);
            return dateA - dateB; // Sort by nearest first
        });
    };

    const upcomingSessions = getFilteredSessions().slice(0, 1); // Only show 1 latest session

    // Handle session link click
    const handleSessionLinkClick = (sessionId) => {
        const updated = [...clickedSessions, sessionId];
        setClickedSessions(updated);
        localStorage.setItem('clickedSessions', JSON.stringify(updated));
    };

    // Check sessions every minute
    useEffect(() => {
        const interval = setInterval(() => {
            getFilteredSessions(); // This will trigger status updates for expired sessions
        }, 60000);
        return () => clearInterval(interval);
    }, [sessions, clickedSessions]);

    const statCards = [
        { icon: <Users size={24} />, label: 'Total Students', value: 0, color: '#886364' },
        { icon: <Video size={24} />, label: 'Active Sessions', value: stats.activeSessions || 0, color: '#886364' },
        { icon: <Wallet size={24} />, label: 'Monthly Earnings', value: `NPR ${(stats.monthlyEarnings || 0).toLocaleString()}`, color: '#ea2a33' },
    ];

    // Process bids - enrich with session/content data and show latest 2
    const safeBids = Array.isArray(bids) ? bids : [];
    const enrichedBids = safeBids.map(bid => {
        let itemData = null;
        let itemType = null;
        let itemTitle = '';

        if (bid.sessionId) {
            itemData = sessions?.find(s => s.id === bid.sessionId);
            itemType = 'session';
            itemTitle = bid.sessionTitle || itemData?.title || 'Session';
        } else if (bid.contentId) {
            itemData = uploads?.find(c => c.id === bid.contentId);
            itemType = 'content';
            itemTitle = bid.contentTitle || itemData?.title || 'Content';
        }

        return {
            ...bid,
            itemData,
            itemType,
            itemTitle,
            originalPrice: bid.originalPrice || itemData?.price || 0
        };
    });

    // Sort by newest first and get latest 2 bids
    const bidRequests = enrichedBids
        .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
        .slice(0, 2);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return { color: '#f59e0b', bg: '#fef3c7', icon: <Clock size={14} />, label: 'Pending' };
            case 'counter':
            case 'countered':
                return { color: '#3b82f6', bg: '#dbeafe', icon: <MessageSquare size={14} />, label: 'Counter Sent' };
            case 'accepted':
                return { color: '#22c55e', bg: '#dcfce7', icon: <CheckCircle size={14} />, label: 'Accepted' };
            case 'rejected':
                return { color: '#ef4444', bg: '#fee2e2', icon: <XCircle size={14} />, label: 'Declined' };
            default:
                return { color: '#6b7280', bg: '#f3f4f6', icon: <Clock size={14} />, label: status };
        }
    };

    const handleAcceptBid = (bid) => {
        onRespondToBid && onRespondToBid(bid.id, 'accept');
    };

    const handleRejectBid = (bid) => {
        onRespondToBid && onRespondToBid(bid.id, 'reject');
    };

    return (
        <>
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

            <div className="quick-actions-section dashboard-section">
                <h2 className="section-title" style={{ marginBottom: '2rem' }}>Quick Actions</h2>
                <div className="quick-actions-grid">
                    {quickActions.map((action, idx) => (
                        <div
                            key={idx}
                            className="quick-action-card"
                            onClick={action.action}
                        >
                            <div className="quick-action-icon">
                                {typeof action.icon === 'string' ? (
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.875rem' }}>{action.icon}</span>
                                ) : (
                                    action.icon
                                )}
                            </div>
                            <h3 className="quick-action-title">{action.title}</h3>
                            <p className="quick-action-desc">{action.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side-by-Side: Recent Posts & Upcoming Sessions */}
            <div className="dashboard-main-grid dashboard-section">
                {/* Recent Posts */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2 className="dashboard-card-title">Recent Posts</h2>
                        <button className="view-all-link" onClick={() => onAction('posts')}>
                            View All <ArrowRight size={12} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="dashboard-card-body">
                        {recentPosts.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="empty-state-title">No Posts Yet</h3>
                                <p className="empty-state-text">
                                    Share your first update or tip with your students.
                                </p>
                            </div>
                        ) : (
                            <div className={`posts-list-grid ${recentPosts.length === 1 ? 'single-post' : ''}`}>
                                {recentPosts.map((post, idx) => (
                                    <div key={idx} className="post-card" style={{ margin: 0 }}>
                                        <div className="post-card-header">
                                            <div
                                                className="post-avatar"
                                                style={{
                                                    backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || teacher?.fullName || "Teacher") + "&background=ea2a33&color=fff"}')`
                                                }}
                                            />
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span className="post-author-name">{teacher?.fullname || teacher?.fullName || 'Teacher'}</span>
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
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2 className="dashboard-card-title">Upcoming Sessions</h2>
                        <button className="view-all-link" onClick={() => onAction('sessions')}>
                            View All <ArrowRight size={12} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="dashboard-card-body">
                        {upcomingSessions.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Calendar size={24} />
                                </div>
                                <h3 className="empty-state-title">No Sessions Yet</h3>
                                <button className="empty-state-link" onClick={() => onAction('session')}>Create Session</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {upcomingSessions.map((session, idx) => (
                                    <SessionItemWithDetails
                                        key={session.id || idx}
                                        session={session}
                                        onAction={onAction}
                                        compact={true}
                                        onLinkClick={handleSessionLinkClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Latest Bid Requests Section */}
            <div className="dashboard-card dashboard-section">
                <div className="dashboard-card-header" style={{ padding: '1rem 2.5rem' }}>
                    <h2 className="dashboard-card-title">Latest Bid Requests</h2>
                    <button className="view-all-link" onClick={() => onAction('bids')}>
                        View All <ArrowRight size={14} strokeWidth={3} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem 2.5rem' }}>
                    {bidRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Gavel size={24} />
                            </div>
                            <h3 className="empty-state-title">No Bids Yet</h3>
                            <p className="empty-state-text">
                                Your active sessions will appear here once students start bidding.
                            </p>
                        </div>
                    ) : (
                        <div className="bid-requests-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                            {bidRequests.map((bid) => {
                                const statusConfig = getStatusConfig(bid.status);
                                const discountPercent = bid.originalPrice > 0 
                                    ? Math.round((1 - (bid.proposedPrice / bid.originalPrice)) * 100)
                                    : 0;

                                return (
                                    <div key={bid.id} className="bid-proposal-card">
                                        {/* Card Header - Status & Price */}
                                        <div className="bid-proposal-header">
                                            <div 
                                                className="bid-proposal-status"
                                                style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                                            >
                                                {statusConfig.icon}
                                                <span>{statusConfig.label}</span>
                                            </div>
                                            <div className="bid-proposal-price">
                                                <span className="price-label">PROPOSED TOTAL</span>
                                                <span className="price-amount">NPR {(bid.proposedPrice || 0).toLocaleString()}</span>
                                                <span className="price-breakdown">
                                                    NPR {(bid.originalPrice || 0).toLocaleString()} Base {discountPercent > 0 ? `• ${discountPercent}% off` : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Student Info */}
                                        <div className="bid-proposal-student">
                                            <h3 className="student-name">{bid.studentName || 'Student'}</h3>
                                            <div className="student-item">
                                                <span className="item-dot"></span>
                                                <span className="item-text">
                                                    {bid.itemType === 'session' ? 'Session' : 'Content'}: {bid.itemTitle}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Message Quote */}
                                        {bid.message && (
                                            <div className="bid-proposal-message">
                                                <div className="message-quote-icon">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M10 8C10 5.79086 8.20914 4 6 4C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12C6.03043 12 6.06079 11.9997 6.09107 11.9992C6.03099 12.3258 6 12.6594 6 13C6 16.3137 8.68629 19 12 19V17C9.79086 17 8 15.2091 8 13C8 12.6597 8.03088 12.3264 8.09058 12.0002C8.06058 12.0001 8.03032 12 8 12C8.20914 12 10 10.2091 10 8Z" fill="#ea2a33"/>
                                                        <path d="M22 8C22 5.79086 20.2091 4 18 4C15.7909 4 14 5.79086 14 8C14 10.2091 15.7909 12 18 12C18.0304 12 18.0608 11.9997 18.0911 11.9992C18.031 12.3258 18 12.6594 18 13C18 16.3137 20.6863 19 24 19V17C21.7909 17 20 15.2091 20 13C20 12.6597 20.0309 12.3264 20.0906 12.0002C20.0606 12.0001 20.0303 12 20 12C20.2091 12 22 10.2091 22 8Z" fill="#ea2a33"/>
                                                    </svg>
                                                </div>
                                                <p className="message-text" style={{ 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis', 
                                                    display: '-webkit-box', 
                                                    WebkitLineClamp: 2, 
                                                    WebkitBoxOrient: 'vertical' 
                                                }}>"{bid.message}"</p>
                                            </div>
                                        )}

                                        {/* Actions - only for pending bids */}
                                        {bid.status === 'pending' && (
                                            <div className="bid-proposal-actions">
                                                <button 
                                                    className="bid-action-btn decline"
                                                    onClick={() => handleRejectBid(bid)}
                                                >
                                                    Decline
                                                </button>
                                                <button 
                                                    className="bid-action-btn accept"
                                                    onClick={() => handleAcceptBid(bid)}
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Uploads Section - At the bottom */}
            <div className="uploads-section" style={{ marginBottom: '2rem' }}>
                <div className="uploads-section-header">
                    <h2 className="section-title">Recent Uploads</h2>
                    <button className="view-all-btn" onClick={() => onAction('content')}>View All Library</button>
                </div>
                {recentUploads.length === 0 ? (
                    <div className="dashboard-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ backgroundColor: '#f9f9f9' }}>
                                <CloudUpload size={28} style={{ color: '#ccc' }} />
                            </div>
                            <p className="empty-state-text">No content uploaded yet</p>
                            <button className="empty-state-link" style={{ marginTop: '0.5rem' }} onClick={() => onAction('upload')}>Upload Now</button>
                        </div>
                    </div>
                ) : (
                    <div className="recent-uploads-grid">
                        {recentUploads.slice(0, 3).map((upload, idx) => (
                            <ContentCard
                                key={idx}
                                upload={upload}
                                teacher={teacher}
                                onAction={onAction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

const SessionItemWithDetails = ({ session, onAction, compact, onLinkClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleJoinClick = (e) => {
        e.stopPropagation();
        if (session.meetingLink) {
            if (onLinkClick) {
                onLinkClick(session.id);
            }
            window.open(session.meetingLink, '_blank');
        } else {
            onAction('session');
        }
    };

    if (compact) {
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
                        <button
                            className="session-join-btn-sm"
                            onClick={handleJoinClick}
                        >
                            <VideoIcon size={14} />
                            Join Session
                        </button>
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
                                <p className="session-detail-label">Type</p>
                                <p className="session-detail-value" style={{ textTransform: 'capitalize' }}>{session.paymentType || 'Free'}</p>
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
    }

    return (
        <div className="session-item-full">
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="session-icon-wrapper">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <h4 className="session-item-compact-title">{session.title}</h4>
                        <p className="session-item-compact-date" style={{ color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{session.scheduledDate} • {session.scheduledTime}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {session.meetingLink && (
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="session-action-btn primary">
                            <VideoIcon size={16} />
                        </a>
                    )}
                    <button className="session-action-btn" onClick={() => onAction('editSession', session)}>
                        <Edit size={16} />
                    </button>
                    <button
                        className={`session-action-btn ${isExpanded ? 'active' : ''}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        title="View Details"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                            <p className="session-detail-label">Description</p>
                            <p className="session-detail-value" style={{ marginTop: '0.25rem' }}>{session.notes || session.description || 'No description provided'}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div>
                                <p className="session-detail-label">Duration</p>
                                <p className="session-detail-value" style={{ marginTop: '0.125rem' }}>{session.duration} minutes</p>
                            </div>
                            <div>
                                <p className="session-detail-label">Type</p>
                                <p className="session-detail-value" style={{ marginTop: '0.125rem', textTransform: 'capitalize' }}>{session.paymentType === 'free' ? 'Free Session' : `Paid (Rs. ${session.price})`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardView;
