import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Play,
  Video
} from 'lucide-react';
import '../../css/bid-new-design.css';

const MyBidsView = ({
  bids,
  sessions = [],
  content = [],
  teachers = [],
  onRespondToCounter,
  onCancelBid,
  onWatchContent,
  onJoinSession,
  filter = 'all' // 'all', 'session', 'content'
}) => {
  const safeBids = Array.isArray(bids) ? bids : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeContent = Array.isArray(content) ? content : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];

  // Enrich bids
  const enrichedBids = useMemo(() => {
    let filtered = safeBids;

    if (filter === 'session') {
      filtered = safeBids.filter(b => b.sessionId);
    } else if (filter === 'content') {
      filtered = safeBids.filter(b => b.contentId);
    }

    return filtered.map(bid => {
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
        originalPrice: bid.originalPrice || itemData?.price || 0
      };
    });
  }, [safeBids, safeSessions, safeContent, safeTeachers]);

  // Split into sections
  const { pendingBids, historyBids } = useMemo(() => {
    const pending = [];
    const history = [];

    enrichedBids.forEach(bid => {
      if (bid.status === 'pending') {
        pending.push(bid);
      } else {
        history.push(bid);
      }
    });

    // Sort
    pending.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return { pendingBids: pending, historyBids: history };
  }, [enrichedBids]);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'TC';
  };

  const getCounterOffer = (bid) => {
    if (!bid.counterOffer) return null;
    try {
      return JSON.parse(bid.counterOffer);
    } catch (e) {
      return null;
    }
  };

  // Helper for rendering a card
  const renderBidCard = (bid, isHistory = false) => {
    const counterOffer = getCounterOffer(bid);
    const isCountered = bid.status === 'counter' || bid.status === 'countered';

    return (
      <div key={bid.id} className="bid-card-new">
        {/* User (Teacher) Info */}
        <div className="bid-user-section">
          <div
            className="bid-user-avatar"
            style={{
              backgroundImage: bid.teacherAvatar ? `url('${bid.teacherAvatar}')` : 'none'
            }}
          >
            {!bid.teacherAvatar && getInitials(bid.teacherName)}
          </div>
          <div className="bid-user-details">
            <span className="bid-user-name">{bid.teacherName}</span>
            <span className="bid-user-email">Instructor</span>
          </div>
        </div>

        {/* Item Title */}
        <div className="bid-item-section">
          <span className="bid-label-micro">
            {bid.itemType === 'session' ? 'SESSION TITLE' : 'CONTENT TITLE'}
          </span>
          <span className="bid-item-title">{bid.itemTitle}</span>
        </div>

        {/* Price Info */}
        <div className="bid-price-section">
          <div className="price-group">
            <span className="price-label-top">ORIGINAL</span>
            <span className="price-val-original">NPR {bid.originalPrice?.toLocaleString()}</span>
          </div>
          <div className="price-group">
            <span className="bid-label-micro" style={{ color: '#ef4444' }}>
              {isHistory && bid.status === 'accepted' ? 'FINAL PRICE' : 'BID AMOUNT'}
            </span>
            <span className="price-val-bid">NPR {bid.proposedPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* Message / Status Text */}
        <div className="bid-msg-section">
          {isCountered ? (
            <span style={{ color: '#6366f1', fontWeight: 500 }}>
              "Counter Offer: NPR {counterOffer?.price?.toLocaleString()}"
            </span>
          ) : (
            `"${bid.message || 'Waiting for response...'}"`
          )}
        </div>

        {/* Actions or Status */}
        <div className="bid-actions-section">
          {isCountered && !isHistory ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-bid-action btn-decline" onClick={() => onRespondToCounter(bid, 'reject')}>Decline</button>
              <button className="btn-bid-action btn-accept" onClick={() => onRespondToCounter(bid, 'accept', counterOffer?.price)}>
                Accept NPR {counterOffer?.price}
              </button>
            </div>
          ) : !isHistory ? (
            <button className="btn-bid-action btn-decline" onClick={() => onCancelBid(bid.id)}>
              Cancel
            </button>
          ) : (
            <>
              <span className="text-time-ago">
                {new Date(bid.created_at).toLocaleDateString()}
              </span>
              {bid.status === 'accepted' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="status-badge-accepted">
                    <CheckCircle size={14} fill="currentColor" className="text-emerald-500" />
                    ACCEPTED
                  </div>
                  <button
                    className="btn-bid-action btn-accept"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                    onClick={() => bid.itemType === 'content'
                      ? onWatchContent && onWatchContent(bid.itemData)
                      : onJoinSession && onJoinSession(bid.itemData)
                    }
                  >
                    {bid.itemType === 'content' ? <Play size={14} /> : <Video size={14} />}
                    {bid.itemType === 'content' ? 'Watch' : 'Join'}
                  </button>
                </div>
              ) : (
                <div className="status-badge-rejected">
                  <XCircle size={14} fill="currentColor" className="text-red-500" />
                  REJECTED
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bid-new-container">
      {/* Pending Section */}
      <div className="bid-section">
        <div className="bid-section-header">
          <div className="bid-section-dot pending"></div>
          <h2 className="bid-section-title">PENDING REQUESTS</h2>
          <span className="bid-count-badge">{pendingBids.length}</span>
        </div>
        <div>
          {pendingBids.length > 0 ? (
            pendingBids.map(bid => renderBidCard(bid, false))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', background: '#f9fafb', borderRadius: '12px' }}>
              No pending bids or active negotiations
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="bid-section">
        <div className="bid-section-header">
          <div className="bid-section-dot history"></div>
          <h2 className="bid-section-title">RECENTLY ACCEPTED / REJECTED</h2>
          <span className="bid-count-badge" style={{ background: '#d1fae5', color: '#10b981' }}>{historyBids.length}</span>
        </div>
        <div>
          {historyBids.length > 0 ? (
            historyBids.map(bid => renderBidCard(bid, true))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', background: '#f9fafb', borderRadius: '12px' }}>
              No bid history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBidsView;
