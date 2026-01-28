import React, { useState } from 'react';
import {
  Play,
  Lock,
  CheckCircle,
  X,
  Eye,
  Gavel,
  Tag,
  Info,
  Clock,
  XCircle
} from 'lucide-react';

/**
 * StudentContentCard - Content card component for students with four states:
 * 1. Purchased/Joined - Shows "PURCHASED" badge, checkmark, Watch Now button
 * 2. Requested/Bid Pending - Shows "REQUESTED" badge, awaiting response
 * 3. Free/Browse - Shows content info, Not Interested & View Details buttons  
 * 4. Paid/Premium - Shows lock overlay, price, Unlock with Credits & Make a Bid buttons
 */
const StudentContentCard = ({
  content,
  isUnlocked = false,
  hasPendingBid = false,
  onJoinContent,
  onMakeBid,
  onCancelBid,
  onViewDetails,
  onNotInterested,
  onWatchNow
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Determine content state
  const isFree = !content.price || content.price === 0;
  const isPaid = content.price > 0;
  const allowsBidding = content.allowBidding === true;

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  // Get thumbnail URL
  const getThumbnailUrl = () => {
    if (!content.thumbnail) return 'https://via.placeholder.com/400x225?text=No+Thumbnail';
    return content.thumbnail.startsWith('http') 
      ? content.thumbnail 
      : `http://localhost:5000${content.thumbnail}`;
  };

  // Handle not interested click
  const handleNotInterested = () => {
    setDismissed(true);
    onNotInterested && onNotInterested(content);
  };

  // =====================
  // STATE 1: PURCHASED/JOINED
  // =====================
  if (isUnlocked) {
    return (
      <div className="student-content-card purchased">
        {/* Thumbnail */}
        <div 
          className="scc-thumbnail"
          style={{ backgroundImage: `url('${getThumbnailUrl()}')` }}
        >
          {/* Purchased Badge */}
          <div className="scc-badge purchased">
            <CheckCircle size={14} />
            <span>PURCHASED</span>
          </div>
        </div>

        {/* Body */}
        <div className="scc-body">
          {/* Category */}
          {content.category && (
            <span className="scc-category">{content.category}</span>
          )}

          {/* Title with checkmark */}
          <h3 className="scc-title">
            {content.title}
            <CheckCircle size={18} className="scc-title-check" />
          </h3>

          {/* Teacher Info */}
          <div className="scc-teacher">
            <div 
              className="scc-teacher-avatar"
              style={{
                backgroundImage: `url('${content.teacherAvatar || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(content.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
              }}
            />
            <div className="scc-teacher-info">
              <span className="scc-teacher-name">{content.teacherName || 'Teacher'}</span>
              <span className="scc-joined-date">Joined {formatDate(content.joinedAt || content.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Watch Now Button */}
        <button 
          className="scc-btn primary full"
          onClick={() => onWatchNow && onWatchNow(content)}
        >
          <Play size={18} />
          Watch Now
        </button>
      </div>
    );
  }

  // =====================
  // STATE 2: REQUESTED/BID PENDING
  // =====================
  if (hasPendingBid) {
    return (
      <div className="student-content-card requested">
        {/* Thumbnail */}
        <div 
          className="scc-thumbnail"
          style={{ backgroundImage: `url('${getThumbnailUrl()}')` }}
        >
          {/* Requested Badge */}
          <div className="scc-badge requested">
            <Gavel size={14} />
            <span>REQUESTED</span>
          </div>
        </div>

        {/* Body */}
        <div className="scc-body">
          {/* Category */}
          {content.category && (
            <span className="scc-category">{content.category}</span>
          )}

          {/* Title with clock */}
          <h3 className="scc-title">
            {content.title}
            <Clock size={18} className="scc-title-clock" />
          </h3>

          {/* Teacher Info */}
          <div className="scc-teacher">
            <div 
              className="scc-teacher-avatar"
              style={{
                backgroundImage: `url('${content.teacherAvatar || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(content.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
              }}
            />
            <div className="scc-teacher-info">
              <span className="scc-teacher-name">{content.teacherName || 'Teacher'}</span>
              <span className="scc-joined-date">Bid submitted</span>
            </div>
          </div>
        </div>

        {/* Cancel Bid Button */}
        <button 
          className="scc-btn cancel-bid full"
          onClick={() => onCancelBid && onCancelBid(content)}
        >
          <XCircle size={18} />
          Cancel Bid
        </button>
      </div>
    );
  }

  // =====================
  // STATE 3: PAID/PREMIUM CONTENT
  // =====================
  if (isPaid) {
    return (
      <div className="student-content-card premium">
        {/* Thumbnail with Lock Overlay */}
        <div 
          className="scc-thumbnail locked"
          style={{ backgroundImage: `url('${getThumbnailUrl()}')` }}
        >
          {/* Category Badge */}
          {content.category && (
            <span className="scc-category-badge">{content.category}</span>
          )}

          {/* Premium Badge */}
          <div className="scc-badge premium">
            <Lock size={12} />
            <span>Premium Content</span>
          </div>

          {/* Lock Overlay */}
          <div className="scc-lock-overlay">
            <div className="scc-lock-icon">
              <Lock size={24} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="scc-body">
          {/* Title & Price Row */}
          <div className="scc-title-price-row">
            <h3 className="scc-title">{content.title}</h3>
            <div className="scc-price-tag">
              <span className="scc-price-label">BASE PRICE</span>
              <span className="scc-price-value">NPR {content.price?.toLocaleString()}</span>
            </div>
          </div>

          {/* Teacher Info */}
          <div className="scc-teacher premium">
            <div 
              className="scc-teacher-avatar"
              style={{
                backgroundImage: `url('${content.teacherAvatar || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(content.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
              }}
            />
            <div className="scc-teacher-info">
              <span className="scc-teacher-name">{content.teacherName || 'Expert Teacher'}</span>
              <span className="scc-teacher-subtitle">Top Rated Mentor • {formatDate(content.created_at)}</span>
            </div>
          </div>

          {/* Action Buttons - Always show both Purchase and Bid */}
          <div className="scc-actions dual">
            <button 
              className="scc-btn purchase"
              onClick={() => onJoinContent && onJoinContent(content, 'paid')}
            >
              <Lock size={16} />
              <span>Purchase<br/>NPR {content.price?.toLocaleString()}</span>
            </button>
            <button 
              className="scc-btn bid"
              onClick={() => onMakeBid && onMakeBid(content)}
            >
              <Gavel size={16} />
              <span>Make a<br/>Bid</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="scc-info-box">
            <Info size={14} />
            <p>
              {content.description || 
                `Gain exclusive access to our proprietary content. This module covers advanced strategies for scaling your learning journey.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // STATE 2: FREE/BROWSE CONTENT
  // =====================
  return (
    <div className="student-content-card browse">
      {/* Thumbnail */}
      <div 
        className="scc-thumbnail"
        style={{ backgroundImage: `url('${getThumbnailUrl()}')` }}
      >
        {/* Category Badge */}
        {content.category && (
          <span className="scc-category-badge">{content.category}</span>
        )}
      </div>

      {/* Body */}
      <div className="scc-body">
        {/* Title */}
        <h3 className="scc-title">{content.title}</h3>

        {/* Teacher Info */}
        <div className="scc-teacher">
          <div 
            className="scc-teacher-avatar"
            style={{
              backgroundImage: `url('${content.teacherAvatar || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(content.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
            }}
          />
          <div className="scc-teacher-info">
            <span className="scc-teacher-name">{content.teacherName || 'Teacher'}</span>
            <span className="scc-joined-date">Joined {formatDate(content.created_at)}</span>
          </div>
        </div>

        {/* Description */}
        {content.description && (
          <p className="scc-description">{content.description}</p>
        )}

        {/* Action Buttons */}
        <div className="scc-actions browse">
          <button 
            className="scc-btn secondary"
            onClick={handleNotInterested}
          >
            <X size={16} />
            Not Interested
          </button>
          <button 
            className="scc-btn primary"
            onClick={() => isFree ? (onJoinContent && onJoinContent(content, 'free')) : (onViewDetails && onViewDetails(content))}
          >
            <Eye size={16} />
            {isFree ? 'Join Free' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentContentCard;
