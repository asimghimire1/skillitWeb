import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  RefreshCw,
} from 'lucide-react';
import CounterOfferModal from './CounterOfferModal';
import '../css/bid-new-design.css';

const BidRequestsView = ({
  bids = [],
  sessions = [],
  uploads = [],
  onRespondToBid,
  onRefresh,
  typeFilter = 'all' // 'all', 'session', 'content'
}) => {
  const safeBids = Array.isArray(bids) ? bids : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeUploads = Array.isArray(uploads) ? uploads : [];

  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  // Enrich bids
  const enrichedBids = useMemo(() => {
    let filtered = safeBids;

    if (typeFilter === 'session') {
      filtered = safeBids.filter(b => b.sessionId);
    } else if (typeFilter === 'content') {
      filtered = safeBids.filter(b => b.contentId);
    }

    return filtered.map(bid => {
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

  // Split into sections
  const { pendingBids, historyBids } = useMemo(() => {
    const pending = [];
    const history = [];

    enrichedBids.forEach(bid => {
      if (bid.status === 'pending' || bid.status === 'counter') {
        pending.push(bid);
      } else {
        history.push(bid);
      }
    });

    // Sort: Pending (newest first), History (newest first)
    pending.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return { pendingBids: pending, historyBids: history };
  }, [enrichedBids]);


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

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  };

  // Helper for rendering a card
  const renderBidCard = (bid, isHistory = false) => {
    const isCounter = bid.status === 'counter' || bid.status === 'countered';

    return (
      <div key={bid.id} className="bid-card-new">
        {/* User Info */}
        <div className="bid-user-section">
          <div
            className="bid-user-avatar"
            style={{
              backgroundImage: bid.studentAvatar ? `url('${bid.studentAvatar}')` : 'none'
            }}
          >
            {!bid.studentAvatar && getInitials(bid.studentName)}
          </div>
          <div className="bid-user-details">
            <span className="bid-user-name">{bid.studentName || 'Student'}</span>
            <span className="bid-user-email">{bid.studentEmail || 'student@example.com'}</span>
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

        {/* Message */}
        <div className="bid-msg-section">
          "{bid.message || 'No message provided'}"
        </div>

        {/* Actions or Status */}
        <div className="bid-actions-section">
          {!isHistory ? (
            <>
              <button className="btn-bid-action btn-decline" onClick={() => handleReject(bid)}>Decline</button>
              <button className="btn-bid-action btn-counter" onClick={() => handleCounter(bid)}>Counter</button>
              <button className="btn-bid-action btn-accept" onClick={() => handleAccept(bid)}>Accept</button>
            </>
          ) : (
            <>
              <span className="text-time-ago">
                {new Date(bid.created_at).toLocaleDateString()}
              </span>
              {bid.status === 'accepted' ? (
                <div className="status-badge-accepted">
                  <CheckCircle size={14} fill="currentColor" className="text-emerald-500" />
                  ACCEPTED
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={onRefresh} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

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
              No pending requests
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
              No history yet
            </div>
          )}
        </div>
      </div>

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