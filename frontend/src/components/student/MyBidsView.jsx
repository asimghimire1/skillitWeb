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
  MessageSquare
} from 'lucide-react';

const MyBidsView = ({
  bids,
  onRespondToCounter,
  onCancelBid
}) => {
  // Safe array default
  const safeBids = Array.isArray(bids) ? bids : [];

  const [activeFilter, setActiveFilter] = useState('all');

  // Group bids by status
  const bidStats = useMemo(() => {
    return {
      total: safeBids.length,
      pending: safeBids.filter(b => b.status === 'pending').length,
      countered: safeBids.filter(b => b.status === 'countered').length,
      accepted: safeBids.filter(b => b.status === 'accepted').length,
      rejected: safeBids.filter(b => b.status === 'rejected').length,
    };
  }, [safeBids]);

  // Filter bids
  const filteredBids = useMemo(() => {
    if (activeFilter === 'all') return safeBids;
    return safeBids.filter(b => b.status === activeFilter);
  }, [safeBids, activeFilter]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { 
          color: '#f59e0b', 
          bg: '#fef3c7', 
          icon: <Clock size={14} />,
          label: 'Pending'
        };
      case 'countered':
        return { 
          color: '#3b82f6', 
          bg: '#dbeafe', 
          icon: <MessageSquare size={14} />,
          label: 'Counter Offer'
        };
      case 'accepted':
        return { 
          color: '#22c55e', 
          bg: '#dcfce7', 
          icon: <CheckCircle size={14} />,
          label: 'Accepted'
        };
      case 'rejected':
        return { 
          color: '#ef4444', 
          bg: '#fee2e2', 
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

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon">
            <Gavel size={24} />
          </div>
          <h3 className="empty-state-title">No Bids Found</h3>
          <p className="empty-state-text">
            {activeFilter === 'all' 
              ? "You haven't made any bids yet."
              : `No ${activeFilter} bids found.`}
          </p>
        </div>
      ) : (
        <div className="bids-list">
          {filteredBids.map((bid, idx) => {
            const statusConfig = getStatusConfig(bid.status);
            
            return (
              <div key={bid.id || idx} className="bid-card">
                {/* Bid Header */}
                <div className="bid-card-header">
                  <div className="bid-session-info">
                    <h3 className="bid-session-title">{bid.sessionTitle || bid.session?.title || 'Session'}</h3>
                    <div className="bid-session-meta">
                      <span><Calendar size={14} /> {bid.sessionDate || bid.session?.scheduledDate}</span>
                      {bid.teacherName && <span>by {bid.teacherName}</span>}
                    </div>
                  </div>
                  <div 
                    className="bid-status-badge"
                    style={{ 
                      color: statusConfig.color, 
                      backgroundColor: statusConfig.bg 
                    }}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </div>
                </div>

                {/* Bid Details */}
                <div className="bid-card-body">
                  <div className="bid-price-comparison">
                    <div className="price-item">
                      <span className="price-label">Original Price</span>
                      <span className="price-value original">
                        NPR {(bid.originalPrice || bid.session?.price || 0).toLocaleString()}
                      </span>
                    </div>
                    <ArrowRight size={16} className="price-arrow" />
                    <div className="price-item">
                      <span className="price-label">Your Bid</span>
                      <span className="price-value bid">
                        NPR {(bid.bidAmount || 0).toLocaleString()}
                      </span>
                    </div>
                    {bid.status === 'countered' && bid.counterAmount && (
                      <>
                        <ArrowRight size={16} className="price-arrow" />
                        <div className="price-item highlight">
                          <span className="price-label">Counter Offer</span>
                          <span className="price-value counter">
                            NPR {bid.counterAmount.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Discount Percentage */}
                  <div className="bid-discount">
                    {bid.originalPrice > 0 && (
                      <span className="discount-badge">
                        {Math.round((1 - bid.bidAmount / bid.originalPrice) * 100)}% off requested
                      </span>
                    )}
                    <span className="bid-date">
                      Submitted: {new Date(bid.createdAt || bid.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Bid Actions */}
                <div className="bid-card-footer">
                  {bid.status === 'pending' && (
                    <button 
                      className="btn-cancel-bid"
                      onClick={() => onCancelBid(bid)}
                    >
                      Cancel Bid
                    </button>
                  )}
                  {bid.status === 'countered' && (
                    <div className="counter-actions">
                      <button 
                        className="btn-accept-counter"
                        onClick={() => onRespondToCounter(bid, 'accept')}
                      >
                        <CheckCircle size={14} /> Accept Offer
                      </button>
                      <button 
                        className="btn-reject-counter"
                        onClick={() => onRespondToCounter(bid, 'reject')}
                      >
                        <XCircle size={14} /> Decline
                      </button>
                    </div>
                  )}
                  {bid.status === 'accepted' && (
                    <span className="bid-success-message">
                      <CheckCircle size={14} /> Session enrolled at bid price!
                    </span>
                  )}
                  {bid.status === 'rejected' && (
                    <span className="bid-rejected-message">
                      <XCircle size={14} /> Bid was not accepted
                    </span>
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
