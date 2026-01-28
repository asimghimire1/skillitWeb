import React from 'react';
import { 
  X, 
  Lock, 
  Sparkles,
  Gavel,
  Star,
  Info
} from 'lucide-react';

const ContentDetailModal = ({ 
  content, 
  onClose, 
  onUnlock,
  onMakeBid,
  userBalance = 0,
  baseUrl = 'http://localhost:5000'
}) => {
  if (!content) return null;

  // Parse price properly - could be string or number
  const contentPrice = parseFloat(content.price) || 0;
  const isPaid = contentPrice > 0;

  const getThumbnailUrl = () => {
    if (!content.thumbnail) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(content.title || 'Content')}&background=1a1a2e&color=fff&size=400`;
    }
    return content.thumbnail.startsWith('http') ? content.thumbnail : `${baseUrl}${content.thumbnail}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="content-detail-overlay" onClick={onClose}>
      <div className="content-detail-modal" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="content-detail-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Thumbnail Section */}
        <div className="content-detail-thumbnail-section">
          <div 
            className={`content-detail-thumbnail ${isPaid ? 'premium' : ''}`}
            style={{ backgroundImage: `url('${getThumbnailUrl()}')` }}
          >
            {/* Category Badge */}
            {content.category && (
              <span className="content-detail-category">{content.category.toUpperCase()}</span>
            )}
            
            {/* Premium Badge - always show for paid */}
            {isPaid && (
              <span className="content-detail-premium-badge">
                <Sparkles size={14} />
                Premium Content
              </span>
            )}

            {/* Lock Overlay - always show for paid */}
            {isPaid && (
              <div className="content-detail-lock-overlay">
                <div className="content-detail-lock-icon">
                  <Lock size={32} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Info */}
        <div className="content-detail-body">
          {/* Title and Price Row */}
          <div className="content-detail-header">
            <h2 className="content-detail-title">{content.title}</h2>
            {isPaid && (
              <div className="content-detail-price">
                <span className="content-detail-price-label">BASE PRICE</span>
                <span className="content-detail-price-value">NPR {contentPrice.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Teacher Info */}
          <div className="content-detail-teacher">
            <div 
              className="content-detail-teacher-avatar"
              style={{
                backgroundImage: `url('${content.teacherAvatar || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(content.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
              }}
            />
            <div className="content-detail-teacher-info">
              <span className="content-detail-teacher-name">{content.teacherName || 'Expert Teacher'}</span>
              <span className="content-detail-teacher-meta">
                <Star size={12} fill="#fbbf24" color="#fbbf24" />
                Top Rated Mentor • {formatDate(content.created_at)}
              </span>
            </div>
          </div>

          {/* Action Buttons - Show for paid content */}
          {isPaid && (
            <div className="content-detail-actions">
              <button 
                className="content-detail-btn unlock"
                onClick={() => onUnlock && onUnlock(content)}
                disabled={userBalance < contentPrice}
              >
                <Lock size={18} />
                <span>Unlock with<br/>Credits</span>
              </button>
              
              <button 
                className="content-detail-btn bid"
                onClick={() => onMakeBid && onMakeBid(content)}
              >
                <Gavel size={18} />
                Make a Bid
              </button>
            </div>
          )}

          {/* Free content - show join button */}
          {!isPaid && (
            <div className="content-detail-actions">
              <button 
                className="content-detail-btn unlock free"
                onClick={() => onUnlock && onUnlock(content)}
              >
                <Sparkles size={18} />
                <span>Join Free</span>
              </button>
            </div>
          )}

          {/* Description */}
          {content.description && (
            <div className="content-detail-description">
              <Info size={16} className="content-detail-info-icon" />
              <p>{content.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;
