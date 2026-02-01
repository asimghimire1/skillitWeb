import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Play,
  Video,
  ChevronRight,
  Lock
} from 'lucide-react';
import '../../css/bid-new-design.css';

const MyBidsView = ({
  bids,
  filter = 'all', // 'all', 'content', 'session'
  sessions = [],
  content = [],
  teachers = [],
  onRespondToCounter,
  onCancelBid,
  onWatchContent,
  onJoinSession
}) => {
  const [currentFilter, setCurrentFilter] = useState('ALL'); // 'ALL', 'ACCEPTED', 'REJECTED'

  const safeBids = Array.isArray(bids) ? bids : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeContent = Array.isArray(content) ? content : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];

  // Enrich and Filter bids
  const filteredBids = useMemo(() => {
    return safeBids.map(bid => {
      let itemData = null;
      let itemType = null;

      if (bid.sessionId) {
        itemData = safeSessions.find(s => s.id === bid.sessionId);
        itemType = 'SESSION';
      } else if (bid.contentId) {
        itemData = safeContent.find(c => c.id === bid.contentId);
        itemType = 'CONTENT';
      }

      const teacher = safeTeachers.find(t => t.id === bid.teacherId);

      return {
        ...bid,
        itemData,
        itemType,
        teacherName: bid.teacherName || teacher?.fullname || 'Teacher',
        teacherAvatar: bid.teacherAvatar || teacher?.profilePicture,
        teacherRole: teacher?.role || teacher?.specialization || 'Instructor',
        itemTitle: bid.sessionTitle || bid.contentTitle || itemData?.title || 'Item',
        originalPrice: bid.originalPrice || itemData?.price || 0
      };
    }).filter(bid => {
      // 1. Filter by Type (CONTENT vs SESSION)
      if (filter === 'content' && bid.itemType !== 'CONTENT') return false;
      if (filter === 'session' && bid.itemType !== 'SESSION') return false;

      // 2. Filter by Status (ALL, ACCEPTED, REJECTED)
      if (currentFilter === 'ALL') return true;
      if (currentFilter === 'ACCEPTED') return bid.status === 'accepted';
      if (currentFilter === 'REJECTED') return bid.status === 'rejected' || bid.status === 'cancelled';
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [safeBids, safeSessions, safeContent, safeTeachers, currentFilter, filter]);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'TC';
  };

  const renderBidCard = (bid) => {
    const isAccepted = bid.status === 'accepted';
    const isRejected = bid.status === 'rejected' || bid.status === 'cancelled';
    const isPending = !isAccepted && !isRejected;

    return (
      <div key={bid.id} className="bid-proposal-card">
        <div className="bid-card-body">
          {/* Header: Teacher + Status */}
          <div className="bid-card-header">
            <div className="bid-author-info">
              <div
                className="bid-author-avatar"
                style={{ backgroundImage: bid.teacherAvatar ? `url('${bid.teacherAvatar}')` : 'none' }}
              >
                {!bid.teacherAvatar && getInitials(bid.teacherName)}
              </div>
              <div className="author-meta">
                <span className="author-name">{bid.teacherName}</span>
                <span className="author-sub">{bid.teacherRole} • {new Date(bid.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className={`bid-status-pill ${bid.status}`}>
              <div className="dot" />
              {bid.status.toUpperCase()}
            </div>
          </div>

          {/* Type and Title */}
          <span className="bid-type-label">{bid.itemType}</span>
          <h3 className="bid-item-title-large">{bid.itemTitle}</h3>

          {/* Pricing Grid */}
          <div className="bid-pricing-grid">
            <div className="pricing-col">
              <span className="price-label-micro">ORIGINAL</span>
              <span className="price-old">NPR {bid.originalPrice?.toLocaleString()}</span>
            </div>
            <div className="pricing-divider"></div>
            <div className="pricing-col">
              <span className="price-label-micro">{isAccepted ? 'FINAL' : 'OFFERED'}</span>
              <span className={`price-final ${!isAccepted && isRejected ? 'price-offer' : ''}`}>
                NPR {bid.proposedPrice?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Message / Quote */}
          {bid.message && (
            <div className="bid-quote-box">
              <p className="bid-quote-text">"{bid.message}"</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bid-card-footer">
          {isAccepted ? (
            <button
              className="bid-action-btn-large watch"
              onClick={() => bid.itemType === 'CONTENT'
                ? onWatchContent && onWatchContent(bid.itemData)
                : onJoinSession && onJoinSession(bid.itemData)
              }
            >
              <Play size={16} fill="currentColor" />
              {bid.itemType === 'CONTENT' ? 'WATCH NOW' : 'JOIN SESSION'}
            </button>
          ) : isRejected ? (
            <button className="bid-action-btn-large unavailable" disabled>
              <Lock size={16} />
              UNAVAILABLE
            </button>
          ) : (
            <button className="bid-action-btn-large pending" disabled>
              <Clock size={16} />
              PENDING RESPONSE
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bid-new-container">
      <div className="bid-page-header">
        <div className="bid-label-top">
          <div className="dot" />
          BID STATUS FEED
        </div>
        <h1 className="bid-page-title">Recent Proposals</h1>
      </div>

      <div className="bid-filter-bar">
        {['ALL', 'ACCEPTED', 'REJECTED'].map(filter => (
          <button
            key={filter}
            className={`bid-filter-pill ${currentFilter === filter ? 'active' : ''}`}
            onClick={() => setCurrentFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bids-grid">
        {filteredBids.length > 0 ? (
          filteredBids.map(bid => renderBidCard(bid))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            padding: '4rem',
            textAlign: 'center',
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px dashed #e5e7eb',
            color: '#9ca3af'
          }}>
            No proposals found for this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBidsView;
