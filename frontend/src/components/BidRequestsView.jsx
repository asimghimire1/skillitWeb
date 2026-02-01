import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  RefreshCw,
  Lock,
  ChevronRight,
  Handshake
} from 'lucide-react';
import CounterOfferModal from './CounterOfferModal';
import '../css/bid-new-design.css';

const BidRequestsView = ({
  bids = [],
  sessions = [],
  uploads = [],
  onRespondToBid,
  onRefresh,
  typeFilter = 'all' // Added this
}) => {
  const [currentFilter, setCurrentFilter] = useState('ALL'); // 'ALL', 'ACCEPTED', 'REJECTED'
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  const safeBids = Array.isArray(bids) ? bids : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeUploads = Array.isArray(uploads) ? uploads : [];

  // Enrich and Filter bids
  const filteredBids = useMemo(() => {
    return safeBids.map(bid => {
      let itemData = null;
      let itemType = null;
      let itemTitle = '';

      if (bid.sessionId) {
        itemData = safeSessions.find(s => s.id === bid.sessionId);
        itemType = 'SESSION';
        itemTitle = bid.sessionTitle || itemData?.title || 'Session';
      } else if (bid.contentId) {
        itemData = safeUploads.find(c => c.id === bid.contentId);
        itemType = 'CONTENT';
        itemTitle = bid.contentTitle || itemData?.title || 'Content';
      }

      return {
        ...bid,
        itemData,
        itemType,
        itemTitle,
        originalPrice: bid.originalPrice || itemData?.price || 0
      };
    }).filter(bid => {
      // 1. Filter by Type (CONTENT vs SESSION)
      if (typeFilter === 'content' && bid.itemType !== 'CONTENT') return false;
      if (typeFilter === 'session' && bid.itemType !== 'SESSION') return false;

      // 2. Filter by Status (ALL, ACCEPTED, REJECTED)
      if (currentFilter === 'ALL') return true;
      if (currentFilter === 'ACCEPTED') return bid.status === 'accepted';
      if (currentFilter === 'REJECTED') return bid.status === 'rejected' || bid.status === 'cancelled';
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [safeBids, safeSessions, safeUploads, currentFilter, typeFilter]);

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

  const renderBidCard = (bid) => {
    const isAccepted = bid.status === 'accepted';
    const isRejected = bid.status === 'rejected' || bid.status === 'cancelled';
    const isPending = !isAccepted && !isRejected;

    return (
      <div key={bid.id} className="bid-proposal-card">
        <div className="bid-card-body">
          {/* Header: Student + Status */}
          <div className="bid-card-header">
            <div className="bid-author-info">
              <div
                className="bid-author-avatar"
                style={{ backgroundImage: bid.studentAvatar ? `url('${bid.studentAvatar}')` : 'none' }}
              >
                {!bid.studentAvatar && getInitials(bid.studentName)}
              </div>
              <div className="author-meta">
                <span className="author-name">{bid.studentName || 'Student'}</span>
                <span className="author-sub">{bid.studentEmail || 'Learner'} • {new Date(bid.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
              <span className="price-label-micro">{isAccepted ? 'FINAL' : 'BID AMOUNT'}</span>
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
          {isPending ? (
            <div style={{ display: 'flex', width: '100%' }}>
              <button
                className="bid-action-btn-large"
                style={{ backgroundColor: '#f1f5f9', color: '#64748b', flex: 1 }}
                onClick={() => handleReject(bid)}
              >
                DECLINE
              </button>
              <button
                className="bid-action-btn-large"
                style={{ backgroundColor: '#fff', color: '#111827', borderLeft: '1px solid #e2e8f0', flex: 1 }}
                onClick={() => handleCounter(bid)}
              >
                COUNTER
              </button>
              <button
                className="bid-action-btn-large watch"
                style={{ flex: 1 }}
                onClick={() => handleAccept(bid)}
              >
                ACCEPT
              </button>
            </div>
          ) : isAccepted ? (
            <button className="bid-action-btn-large watch" disabled>
              <CheckCircle size={16} fill="currentColor" />
              PROPOSAL ACCEPTED
            </button>
          ) : (
            <button className="bid-action-btn-large unavailable" disabled>
              <Lock size={16} />
              PROPOSAL REJECTED
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bid-new-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button onClick={onRefresh} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.813rem', fontWeight: 600 }}>
          <RefreshCw size={14} /> REFRESH
        </button>
      </div>

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
