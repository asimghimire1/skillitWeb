import React from 'react';
import { Calendar, Clock, Video, Play, Gavel, CheckCircle, XCircle } from 'lucide-react';

const SessionCard = ({ session, onEnroll, onMakeBid, onCancelBid, isEnrolled = false, hasPendingBid = false }) => {
  const isFree = !session.price || session.price === 0;
  const allowsBidding = session.allowBidding === true;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const sessDate = new Date(date);
    sessDate.setHours(0, 0, 0, 0);
    
    if (sessDate.getTime() === today.getTime()) return 'Today';
    if (sessDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`session-card-unified ${isEnrolled ? 'enrolled' : ''} ${hasPendingBid ? 'requested' : ''}`}>
      {/* Header */}
      <div className="session-card-header-unified">
        <span className="session-date-pill-unified">
          <Calendar size={14} />
          {formatDate(session.scheduledDate)}
        </span>
        
        {hasPendingBid ? (
          <span className="session-price-pill-unified requested">
            <Gavel size={12} />
            REQUESTED
          </span>
        ) : isFree ? (
          <span className="session-price-pill-unified free">FREE</span>
        ) : (
          <span className="session-price-pill-unified paid">NPR {session.price?.toLocaleString()}</span>
        )}
      </div>

      {/* Body */}
      <div className="session-card-body-unified">
        <h3 className="session-card-title-unified">{session.title}</h3>
        
        {session.description && (
          <p className="session-card-desc-unified">{session.description}</p>
        )}

        {/* Teacher Info */}
        <div className="session-teacher-unified">
          <div 
            className="session-teacher-avatar-unified"
            style={{
              backgroundImage: `url('${session.teacherAvatar || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(session.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
            }}
          />
          <div className="session-teacher-info-unified">
            <span className="session-teacher-name-unified">{session.teacherName || 'Teacher'}</span>
            <span className="session-teacher-title-unified">Expert Instructor</span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="session-meta-unified">
          <span className="session-meta-item-unified">
            <Clock size={14} />
            {session.scheduledTime || '10:00'}
          </span>
          <span className="session-meta-item-unified">
            <Video size={14} />
            {session.duration || 60} mins
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="session-card-footer-unified">
        {isEnrolled ? (
          <>
            <button 
              className="session-btn-unified rejoin"
              onClick={() => onEnroll && onEnroll(session)}
            >
              <Play size={16} />
              Rejoin Session
            </button>
            <p className="session-footer-text-unified enrolled">
              <CheckCircle size={14} />
              YOU'RE ENROLLED
            </p>
          </>
        ) : hasPendingBid ? (
          <>
            <button 
              className="session-btn-unified cancel-bid"
              onClick={() => onCancelBid && onCancelBid(session)}
            >
              <XCircle size={16} />
              Cancel Bid
            </button>
            <p className="session-footer-text-unified requested">
              <Clock size={14} />
              AWAITING RESPONSE
            </p>
          </>
        ) : isFree ? (
          <>
            <button 
              className="session-btn-unified free"
              onClick={() => onEnroll && onEnroll(session)}
            >
              <Play size={16} />
              Join Free
            </button>
            <p className="session-footer-text-unified">Limited spots available • No credit card required</p>
          </>
        ) : allowsBidding ? (
          <>
            <div className="session-btn-group-unified">
              <button 
                className="session-btn-unified paid"
                onClick={() => onEnroll && onEnroll(session)}
              >
                Enroll Now
              </button>
              <button 
                className="session-btn-unified bid"
                onClick={() => onMakeBid && onMakeBid(session)}
              >
                <Gavel size={16} />
                Make a Bid
              </button>
            </div>
          </>
        ) : (
          <button 
            className="session-btn-unified paid"
            onClick={() => onEnroll && onEnroll(session)}
          >
            Enroll for NPR {session.price?.toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
