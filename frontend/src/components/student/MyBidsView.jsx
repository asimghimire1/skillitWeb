import React, { useState, useMemo } from 'react';
import {
  Gavel,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  ArrowRight,
  MessageSquare,
  Play,
  Video,
  Lock,
  User
} from 'lucide-react';

const MyBidsView = ({
  bids,
  sessions = [],
  content = [],
  teachers = [],
  onRespondToCounter,
  onCancelBid,
  onWatchContent,
  onJoinSession
}) => {
  // Safe array default
  const safeBids = Array.isArray(bids) ? bids : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeContent = Array.isArray(content) ? content : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];

  const [activeFilter, setActiveFilter] = useState('all');

  // Group bids by status
  const bidStats = useMemo(() => {
    return {
      total: safeBids.length,
      pending: safeBids.filter(b => b.status === 'pending').length,
      countered: safeBids.filter(b => b.status === 'counter' || b.status === 'countered').length,
      accepted: safeBids.filter(b => b.status === 'accepted').length,
      rejected: safeBids.filter(b => b.status === 'rejected').length,
    };
  }, [safeBids]);

  // Filter bids
  const filteredBids = useMemo(() => {
    if (activeFilter === 'all') return safeBids;
    if (activeFilter === 'countered') {
      return safeBids.filter(b => b.status === 'counter' || b.status === 'countered');
    }
    return safeBids.filter(b => b.status === activeFilter);
  }, [safeBids, activeFilter]);

  // Enrich bids with session/content data
  const enrichedBids = useMemo(() => {
    return filteredBids.map(bid => {
      let itemData = null;
      let itemType = null;

      if (bid.sessionId) {
        itemData = safeSessions.find(s => s.id === bid.sessionId);
        itemType = 'session';
      } else if (bid.contentId) {
        itemData = safeContent.find(c => c.id === bid.contentId);
        itemType = 'content';
      }

      const teacher = safeTeachers.find(t => t.id === bid.teacherId);

      return {
        ...bid,
        itemData,
        itemType,
        teacherName: bid.teacherName || teacher?.fullname || 'Teacher',
        teacherAvatar: bid.teacherAvatar || teacher?.profilePicture,
        itemTitle: bid.sessionTitle || bid.contentTitle || itemData?.title || 'Item',
        itemThumbnail: bid.contentThumbnail || itemData?.thumbnail,
        originalPrice: bid.originalPrice || itemData?.price || 0
      };
    });
  }, [filteredBids, safeSessions, safeContent, safeTeachers]);

  // Get thumbnail URL
  const getThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return null;
    return thumbnail.startsWith('http') 
      ? thumbnail 
      : `http://localhost:5000${thumbnail}`;
  };

  // Parse counter offer
  const getCounterOffer = (bid) => {
    if (!bid.counterOffer) return null;
    try {
      return JSON.parse(bid.counterOffer);
    } catch (e) {
      return null;
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { 
          color: '#f59e0b', 
          bg: '#fef3c7', 
          icon: <Clock size={14} />,
          label: 'Pending'
        };
      case 'counter':
      case 'countered':
        return { 
          color: '#374151', 
          bg: 'transparent', 
          icon: <MessageSquare size={14} />,
          label: 'Counter Offer'
        };
      case 'accepted':
        return { 
          color: '#22c55e', 
          bg: 'transparent', 
          icon: <CheckCircle size={14} />,
          label: 'Accepted'
        };
      case 'rejected':
        return { 
          color: '#ef4444', 
          bg: 'transparent', 
          icon: <XCircle size={14} />,
          label: 'Rejected'
        };
      default:
        return { 
          color: '#886364', 
          bg: '#f3f4f6', 
          icon: <AlertCircle size={14} />,
          label: status
        };
    }
  };

  const filters = [
    { id: 'all', label: 'All', count: bidStats.total },
    { id: 'pending', label: 'Pending', count: bidStats.pending },
    { id: 'countered', label: 'Counter Offers', count: bidStats.countered },
    { id: 'accepted', label: 'Accepted', count: bidStats.accepted },
    { id: 'rejected', label: 'Rejected', count: bidStats.rejected },
  ];

  return (
    <div className="my-bids-view">
      {/* Header */}
      <div className="bids-header">
        <div>
          <h1 className="bids-title">My Bids</h1>
          <p className="bids-subtitle">Track and manage your session bids</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bid-stats-grid">
        <div className="bid-stat-card">
          <Gavel size={24} className="bid-stat-icon" />
          <div className="bid-stat-info">
            <span className="bid-stat-value">{bidStats.total}</span>
            <span className="bid-stat-label">Total Bids</span>
          </div>
        </div>
        <div className="bid-stat-card pending">
          <Clock size={24} className="bid-stat-icon" />
          <div className="bid-stat-info">
            <span className="bid-stat-value">{bidStats.pending}</span>
            <span className="bid-stat-label">Pending</span>
          </div>
        </div>
        <div className="bid-stat-card countered">
          <MessageSquare size={24} className="bid-stat-icon" />
          <div className="bid-stat-info">
            <span className="bid-stat-value">{bidStats.countered}</span>
            <span className="bid-stat-label">Counter Offers</span>
          </div>
        </div>
        <div className="bid-stat-card accepted">
          <CheckCircle size={24} className="bid-stat-icon" />
          <div className="bid-stat-info">
            <span className="bid-stat-value">{bidStats.accepted}</span>
            <span className="bid-stat-label">Accepted</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bids-filter-tabs">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`bids-filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>

      {/* Bids List - New Modern Card Style */}
      {enrichedBids.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon">
            <Gavel size={24} />
          </div>
          <h3 className="empty-state-title">No Bids Found</h3>
          <p className="empty-state-text">
            {activeFilter === 'all' 
              ? "You haven't made any bids yet. Explore sessions and content to start bidding!"
              : `No ${activeFilter} bids found.`}
          </p>
        </div>
      ) : (
        <div className="bids-modern-grid">
          {enrichedBids.map((bid, idx) => {
            const statusConfig = getStatusConfig(bid.status);
            const counterOffer = getCounterOffer(bid);
            const discountPercent = bid.originalPrice > 0 
              ? Math.round((1 - (bid.proposedPrice / bid.originalPrice)) * 100)
              : 0;
            
            return (
              <div key={bid.id || idx} className="bid-modern-card">
                {/* Card Header - Status & Type */}
                <div className="bid-modern-header">
                  <div 
                    className="bid-modern-status"
                    style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                  >
                    {statusConfig.icon}
                    <span>{statusConfig.label.toUpperCase()}</span>
                  </div>
                  <span className="bid-modern-type">
                    {bid.itemType === 'session' ? 'Session' : 'Content'}
                  </span>
                </div>

                {/* Item Title */}
                <h3 className="bid-modern-title">{bid.itemTitle}</h3>

                {/* Teacher Info */}
                <div className="bid-modern-teacher">
                  <div 
                    className="bid-modern-teacher-avatar"
                    style={{
                      backgroundImage: `url('${bid.teacherAvatar || 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(bid.teacherName)}&background=ea2a33&color=fff`}')`
                    }}
                  />
                  <div className="bid-modern-teacher-info">
                    <span className="bid-modern-teacher-name">{bid.teacherName}</span>
                    <span className="bid-modern-teacher-role">Instructor</span>
                  </div>
                  {/* Discount Badge - show on rejected or if significant discount */}
                  {discountPercent > 0 && bid.status === 'rejected' && (
                    <div className="bid-modern-discount-badge">
                      {discountPercent}% discount requested
                    </div>
                  )}
                </div>

                {/* Pricing Section */}
                <div className="bid-modern-pricing">
                  <div className="bid-modern-price-row">
                    <span className="bid-modern-price-label">Original Price</span>
                    <span className="bid-modern-price-value original">
                      NPR {(bid.originalPrice || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bid-modern-price-row your-bid">
                    <span className="bid-modern-price-label">Your Bid</span>
                    <span className="bid-modern-price-value highlight">
                      NPR {(bid.proposedPrice || 0).toLocaleString()}
                    </span>
                  </div>
                  {(bid.status === 'counter' || bid.status === 'countered') && counterOffer && (
                    <div className="bid-modern-price-row counter">
                      <span className="bid-modern-price-label">Counter Offer</span>
                      <span className="bid-modern-price-value counter-value">
                        NPR {counterOffer.price?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submitted Date */}
                <div className="bid-modern-date">
                  <Clock size={14} />
                  <span>Submitted {new Date(bid.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Card Footer Actions */}
                <div className="bid-modern-footer">
                  {bid.status === 'pending' && (
                    <button 
                      className="bid-modern-btn cancel"
                      onClick={() => onCancelBid(bid.id)}
                    >
                      <XCircle size={16} />
                      <span>Cancel Bid</span>
                    </button>
                  )}
                  
                  {(bid.status === 'counter' || bid.status === 'countered') && (
                    <div className="bid-modern-counter-actions">
                      <button 
                        className="bid-modern-btn accept-counter"
                        onClick={() => onRespondToCounter(bid, 'accept')}
                      >
                        <CheckCircle size={16} />
                        Accept NPR {counterOffer?.price?.toLocaleString()}
                      </button>
                      <button 
                        className="bid-modern-btn decline-counter"
                        onClick={() => onRespondToCounter(bid, 'reject')}
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {bid.status === 'accepted' && (
                    <div className="bid-modern-accepted-section">
                      <button 
                        className="bid-modern-btn join-session"
                        onClick={() => bid.itemType === 'content' 
                          ? onWatchContent && onWatchContent(bid.itemData)
                          : onJoinSession && onJoinSession(bid.itemData)
                        }
                      >
                        {bid.itemType === 'content' ? <Play size={16} /> : <Video size={16} />}
                        <span>{bid.itemType === 'content' ? 'Watch Content' : 'Join Session'}</span>
                      </button>
                      <span className="bid-modern-enrolled-text">
                        <CheckCircle size={14} />
                        Enrolled at NPR {(bid.proposedPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {bid.status === 'rejected' && (
                    <div className="bid-modern-rejected-section">
                      <AlertCircle size={16} />
                      <span>This bid was not accepted</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBidsView;
