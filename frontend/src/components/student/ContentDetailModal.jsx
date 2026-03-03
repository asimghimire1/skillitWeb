import React from 'react';
import { 
  Gavel,
  Video,
  Lock,
  Wallet
} from 'lucide-react';

const ContentDetailModal = ({ 
  content, 
  onClose, 
  onUnlock,
  onMakeBid,
  onAddCredits,
  userBalance = 0,
  baseUrl = 'http://localhost:5000'
}) => {
  if (!content) return null;

  const contentPrice = parseFloat(content.price) || 0;
  const isPaid = contentPrice > 0;
  const hasEnoughCredits = userBalance >= contentPrice;

  const getAvatarUrl = () => {
    if (content.teacherAvatar) {
      return content.teacherAvatar.startsWith('http')
        ? content.teacherAvatar
        : `${baseUrl}${content.teacherAvatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(content.teacherName || 'Teacher')}&background=ea2a33&color=fff`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="enroll-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="enroll-modal-header">
          <div className="enroll-date-pill">
            <Video size={14} />
            {content.category || 'Video Content'}
          </div>
          {isPaid ? (
            <div className="enroll-price-badge">
              NPR {contentPrice.toLocaleString()}
            </div>
          ) : (
            <div className="enroll-price-badge free">Free</div>
          )}
        </div>

        {/* Body */}
        <div className="enroll-modal-body">
          <h2 className="enroll-modal-title">{content.title}</h2>

          {content.description && (
            <p className="enroll-modal-desc">{content.description}</p>
          )}

          {/* Instructor */}
          <div className="enroll-instructor">
            <div
              className="enroll-instructor-avatar"
              style={{ backgroundImage: `url('${getAvatarUrl()}')` }}
            />
            <div className="enroll-instructor-info">
              <span className="enroll-instructor-label">INSTRUCTOR</span>
              <span className="enroll-instructor-name">{content.teacherName || 'Teacher'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="enroll-modal-footer">
          {isPaid ? (
            <>
              <div className="enroll-wallet-balance">
                <Wallet size={16} />
                Wallet Balance: NPR {userBalance.toLocaleString()}
              </div>

              <button
                className="enroll-unlock-btn"
                onClick={() => onUnlock && onUnlock(content)}
                disabled={!hasEnoughCredits}
              >
                <Lock size={18} />
                Unlock for NPR {contentPrice.toLocaleString()}
              </button>

              {!hasEnoughCredits && onAddCredits && (
                <button
                  className="enroll-add-credits-link"
                  onClick={onAddCredits}
                >
                  + Add Credits
                </button>
              )}

              <button
                className="enroll-bid-link"
                onClick={() => onMakeBid && onMakeBid(content)}
              >
                <Gavel size={14} />
                Or Make a Bid
              </button>
            </>
          ) : (
            <button
              className="enroll-unlock-btn free"
              onClick={() => onUnlock && onUnlock(content)}
            >
              Join Free
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;
