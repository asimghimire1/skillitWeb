import React, { useState, useMemo } from 'react';
import {
  Gavel,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Video,
  Calendar,
  DollarSign,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import CounterOfferModal from './CounterOfferModal';

const BidRequestsView = ({ 
  bids = [], 
  sessions = [], 
  uploads = [], 
  onRespondToBid,
  onRefresh 
}) => {
  const safeBids = Array.isArray(bids) ? bids : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeUploads = Array.isArray(uploads) ? uploads : [];

  const [activeFilter, setActiveFilter] = useState('all');
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  // Calculate stats
  const bidStats = useMemo(() => {
    const total = safeBids.length;
    const pending = safeBids.filter(b => b.status === 'pending').length;
    const accepted = safeBids.filter(b => b.status === 'accepted').length;
    const rejected = safeBids.filter(b => b.status === 'rejected').length;
    const countered = safeBids.filter(b => b.status === 'counter' || b.status === 'countered').length;

    return { total, pending, accepted, rejected, countered };
  }, [safeBids]);

  // Enrich bids with session/content data
  const enrichedBids = useMemo(() => {
    return safeBids.map(bid => {
      let itemData = null;
      let itemType = null;
      let itemTitle = '';

      if (bid.sessionId) {
        itemData = safeSessions.find(s => s.id === bid.sessionId);
        itemType = 'session';
        itemTitle = bid.sessionTitle || itemData?.title || 'Session';
      } else if (bid.contentId) {
        itemData = safeUploads.find(c => c.id === bid.contentId);
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
  }, [safeBids, safeSessions, safeUploads]);

  // Filter bids
  const filteredBids = useMemo(() => {
    if (activeFilter === 'all') return enrichedBids;
    if (activeFilter === 'counter') {
      return enrichedBids.filter(b => b.status === 'counter' || b.status === 'countered');
    }
    return enrichedBids.filter(b => b.status === activeFilter);
  }, [enrichedBids, activeFilter]);

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
          label: 'Counter Sent'
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
          label: 'Declined'
        };
      default:
        return { 
          color: '#886364', 
          bg: '#f3f4f6', 
          icon: <Clock size={14} />,
          label: status
        };
    }
  };

  const handleAccept = (bid) => {
    onRespondToBid && onRespondToBid(bid.id, 'accept');
  };

  const handleReject = (bid) => {
    onRespondToBid && onRespondToBid(bid.id, 'reject');
  };

  const handleCounter = (bid) => {
    setSelectedBid(bid);
    setIsCounterModalOpen(true);
  };

  const handleSendCounter = (counterData) => {
    if (selectedBid && onRespondToBid) {
      onRespondToBid(selectedBid.id, 'counter', {
        counterPrice: counterData.counterPrice,
        counterMessage: counterData.counterMessage
      });
    }
    setIsCounterModalOpen(false);
    setSelectedBid(null);
  };

  const filters = [
    { id: 'all', label: 'All', count: bidStats.total },
    { id: 'pending', label: 'Pending', count: bidStats.pending },
    { id: 'counter', label: 'Counter Sent', count: bidStats.countered },
    { id: 'accepted', label: 'Accepted', count: bidStats.accepted },
    { id: 'rejected', label: 'Declined', count: bidStats.rejected },
  ];

  return (
    <div className="my-bids-view">
      {/* Header */}
      <div className="bids-header">
        <div>
          <h1 className="bids-title">Bid Requests</h1>
          <p className="bids-subtitle">Review and respond to student bid requests</p>
        </div>
        <button className="refresh-btn" onClick={onRefresh} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#f3f4f6',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          <RefreshCw size={16} />
          Refresh
        </button>
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
            <span className="bid-stat-label">Counter Sent</span>
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

      {/* Bids List - Modern Card Style */}
      {filteredBids.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon">
            <Gavel size={24} />
          </div>
          <h3 className="empty-state-title">No Bids Found</h3>
          <p className="empty-state-text">
            {activeFilter === 'all' 
              ? "You haven't received any bid requests yet."
              : `No ${activeFilter} bids found.`}
          </p>
        </div>
      ) : (
        <div className="bids-modern-grid">
          {filteredBids.map((bid, idx) => {
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

                {/* Student Info */}
                <div className="bid-modern-teacher">
                  <div 
                    className="bid-modern-teacher-avatar"
                    style={{
                      backgroundImage: `url('${bid.studentAvatar || 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(bid.studentName || 'Student')}&background=ea2a33&color=fff`}')`
                    }}
                  />
                  <div className="bid-modern-teacher-info">
                    <span className="bid-modern-teacher-name">{bid.studentName || 'Student'}</span>
                    <span className="bid-modern-teacher-role">Student</span>
                  </div>
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <div className="bid-modern-discount-badge">
                      {discountPercent}% discount requested
                    </div>
                  )}
                </div>

                {/* Message Quote */}
                {bid.message && (
                  <div className="bid-modern-message">
                    <p className="bid-modern-message-text">"{bid.message}"</p>
                  </div>
                )}

                {/* Pricing Section */}
                <div className="bid-modern-pricing">
                  <div className="bid-modern-price-row">
                    <span className="bid-modern-price-label">Original Price</span>
                    <span className="bid-modern-price-value original">
                      NPR {(bid.originalPrice || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bid-modern-price-row your-bid">
                    <span className="bid-modern-price-label">Student's Bid</span>
                    <span className="bid-modern-price-value highlight">
                      NPR {(bid.proposedPrice || 0).toLocaleString()}
                    </span>
                  </div>
                  {(bid.status === 'counter' || bid.status === 'countered') && counterOffer && (
                    <div className="bid-modern-price-row counter">
                      <span className="bid-modern-price-label">Your Counter</span>
                      <span className="bid-modern-price-value counter-value">
                        NPR {counterOffer.price?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submitted Date */}
                <div className="bid-modern-date">
                  <Clock size={14} />
                  <span>Received {new Date(bid.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Card Footer Actions */}
                <div className="bid-modern-footer">
                  {bid.status === 'pending' && (
                    <div className="bid-modern-actions-row">
                      <button 
                        className="bid-modern-btn cancel"
                        onClick={() => handleReject(bid)}
                      >
                        <XCircle size={16} />
                        <span>Decline</span>
                      </button>
                      <button 
                        className="bid-modern-btn counter-btn"
                        onClick={() => handleCounter(bid)}
                      >
                        <MessageSquare size={16} />
                        <span>Counter</span>
                      </button>
                      <button 
                        className="bid-modern-btn accept-counter"
                        onClick={() => handleAccept(bid)}
                      >
                        <CheckCircle size={16} />
                        <span>Accept</span>
                      </button>
                    </div>
                  )}

                  {bid.status === 'accepted' && (
                    <div className="bid-modern-accepted-section">
                      <span className="bid-modern-enrolled-text">
                        <CheckCircle size={14} />
                        Accepted at NPR {(bid.proposedPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {bid.status === 'rejected' && (
                    <div className="bid-modern-rejected-section">
                      <AlertCircle size={16} />
                      <span>You declined this bid</span>
                    </div>
                  )}

                  {(bid.status === 'counter' || bid.status === 'countered') && (
                    <div className="bid-modern-counter-status">
                      <MessageSquare size={16} />
                      <span>Counter sent • Awaiting student response</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Counter Offer Modal */}
      <CounterOfferModal
        isOpen={isCounterModalOpen}
        onClose={() => { setIsCounterModalOpen(false); setSelectedBid(null); }}
        onSend={handleSendCounter}
        bid={selectedBid}
      />
    </div>
  );
};

export default BidRequestsView;