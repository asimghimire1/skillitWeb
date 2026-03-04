import React, { useState } from 'react';
import {
  Play,
  Clock,
  XCircle,
  User,
  Gavel
} from 'lucide-react';

/**
 * StudentContentCard - Clean, consistent content card for all states.
 * Design: Thumbnail → Category Badge → Title + Price → Teacher → Description → Buttons
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

  const isFree = !content.price || Number(content.price) === 0;
  const isPaid = Number(content.price) > 0;

  // Get thumbnail URL
  const getThumbnailUrl = () => {
    if (!content.thumbnail) return 'https://via.placeholder.com/400x225?text=No+Thumbnail';
    return content.thumbnail.startsWith('http')
      ? content.thumbnail
      : `http://localhost:5000${content.thumbnail}`;
  };

  // Determine card state label
  const getStateLabel = () => {
    if (isUnlocked) return 'purchased';
    if (hasPendingBid) return 'requested';
    if (isPaid) return 'premium';
    return 'browse';
  };

  return (
    <div className={`student-content-card ${getStateLabel()}`}>
      {/* Thumbnail */}
      <div
        className="scc-thumbnail"
        style={{ backgroundImage: `url('${getThumbnailUrl()}')` }}
      >
        {/* Category Badge */}
        {content.category && (
          <span className="scc-category-badge">{content.category}</span>
        )}

        {/* Status badge for purchased */}
        {isUnlocked && (
          <div className="scc-status-badge purchased">
            <span>PURCHASED</span>
          </div>
        )}

        {/* Status badge for bid pending */}
        {hasPendingBid && !isUnlocked && (
          <div className="scc-status-badge requested">
            <Clock size={12} />
            <span>BID PENDING</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="scc-body">
        {/* Title + Price Row */}
        <div className="scc-title-row">
          <h3 className="scc-title">{content.title}</h3>
          {isPaid && (
            <span className="scc-price">NPR {content.price?.toLocaleString()}</span>
          )}
          {isFree && (
            <span className="scc-price free">Free</span>
          )}
        </div>

        {/* Teacher */}
        <div className="scc-teacher-row">
          <User size={14} className="scc-teacher-icon" />
          <span className="scc-teacher-label">By {content.teacherName || 'Teacher'}</span>
        </div>

        {/* Description */}
        {content.description && (
          <p className="scc-description">{content.description}</p>
        )}

        {/* ==================== ACTION BUTTONS ==================== */}

        {/* STATE 1: PURCHASED - Watch Now */}
        {isUnlocked && (
          <div className="scc-actions">
            <button
              className="scc-btn enroll"
              onClick={() => onWatchNow && onWatchNow(content)}
            >
              <Play size={16} />
              Watch Now
            </button>
          </div>
        )}

        {/* STATE 2: BID PENDING - Cancel Bid */}
        {hasPendingBid && !isUnlocked && (
          <div className="scc-actions">
            <button
              className="scc-btn cancel-bid"
              onClick={() => onCancelBid && onCancelBid(content)}
            >
              <XCircle size={16} />
              Cancel Bid
            </button>
          </div>
        )}

        {/* STATE 3: FREE CONTENT - Watch Now */}
        {!isUnlocked && !hasPendingBid && isFree && (
          <div className="scc-actions">
            <button
              className="scc-btn enroll"
              onClick={() => onWatchNow && onWatchNow(content)}
            >
              <Play size={16} />
              Watch Now
            </button>
          </div>
        )}

        {/* STATE 4: PAID CONTENT - Enroll Now + Make a Bid */}
        {!isUnlocked && !hasPendingBid && isPaid && (
          <div className="scc-actions dual">
            <button
              className="scc-btn enroll"
              onClick={() => onJoinContent && onJoinContent(content, 'paid')}
            >
              Enroll Now
            </button>
            <button
              className="scc-btn bid-outline"
              onClick={() => onMakeBid && onMakeBid(content)}
            >
              <Gavel size={14} />
              Make a Bid
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentContentCard;
