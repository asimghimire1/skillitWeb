import React, { useState, useMemo } from 'react';
import {
  X,
  Gavel,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Info,
  DollarSign
} from 'lucide-react';

const MakeBidModal = ({ isOpen, onClose, session, onSubmitBid, userBalance }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const originalPrice = session?.price || 0;

  // Calculate bid constraints (40% - 100% of original price)
  const minBid = Math.ceil(originalPrice * 0.4);
  const maxBid = originalPrice;

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!bidAmount || !originalPrice) return 0;
    return Math.round((1 - parseInt(bidAmount) / originalPrice) * 100);
  }, [bidAmount, originalPrice]);

  // Preset discount percentages
  const presetDiscounts = [10, 20, 30, 40, 50, 60];

  const handlePresetDiscount = (discount) => {
    const amount = Math.ceil(originalPrice * (1 - discount / 100));
    if (amount >= minBid) {
      setBidAmount(amount.toString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numBid = parseInt(bidAmount);
    
    // Validation
    if (!numBid) {
      setError('Please enter a bid amount');
      return;
    }
    if (numBid < minBid) {
      setError(`Minimum bid is NPR ${minBid.toLocaleString()} (40% of original price)`);
      return;
    }
    if (numBid > maxBid) {
      setError(`Bid cannot exceed the original price of NPR ${maxBid.toLocaleString()}`);
      return;
    }
    if (numBid > userBalance) {
      setError(`Insufficient balance. You have NPR ${userBalance.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmitBid({
        sessionId: session.id,
        bidAmount: numBid,
        message: message.trim(),
        originalPrice: originalPrice
      });
      setBidAmount('');
      setMessage('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !session) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="make-bid-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <Gavel size={24} className="modal-header-icon" />
            <div>
              <h2 className="modal-title">Make a Bid</h2>
              <p className="modal-subtitle">Offer your price for this session</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Session Info Card */}
        <div className="bid-session-card">
          <h3 className="bid-session-title">{session.title}</h3>
          <div className="bid-session-details">
            <span><Calendar size={14} /> {session.scheduledDate}</span>
            <span><Clock size={14} /> {session.scheduledTime}</span>
            {session.teacherName && <span><User size={14} /> {session.teacherName}</span>}
          </div>
          <div className="bid-original-price">
            <span className="price-label">Original Price</span>
            <span className="price-value">NPR {originalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Bid Rules Info */}
        <div className="bid-rules-info">
          <Info size={16} />
          <div>
            <strong>Bidding Rules:</strong>
            <ul>
              <li>Minimum bid: NPR {minBid.toLocaleString()} (40% of price)</li>
              <li>Maximum bid: NPR {maxBid.toLocaleString()} (100% of price)</li>
              <li>Teacher may accept, reject, or counter your bid</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Bid Amount Input */}
          <div className="form-group">
            <label className="form-label">Your Bid Amount (NPR)</label>
            <div className="bid-input-wrapper">
              <span className="bid-prefix">NPR</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={minBid.toString()}
                min={minBid}
                max={maxBid}
                className="bid-input"
              />
              {bidAmount && (
                <span className={`discount-badge ${discountPercentage > 50 ? 'high' : ''}`}>
                  {discountPercentage}% off
                </span>
              )}
            </div>
          </div>

          {/* Preset Discounts */}
          <div className="preset-discounts">
            <span className="preset-label">Quick Select:</span>
            <div className="preset-buttons">
              {presetDiscounts.map((discount) => {
                const presetAmount = Math.ceil(originalPrice * (1 - discount / 100));
                const isDisabled = presetAmount < minBid;
                return (
                  <button
                    key={discount}
                    type="button"
                    className={`preset-discount-btn ${bidAmount === presetAmount.toString() ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => !isDisabled && handlePresetDiscount(discount)}
                    disabled={isDisabled}
                  >
                    {discount}% off
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message (Optional) */}
          <div className="form-group">
            <label className="form-label">
              Message to Teacher <span className="optional-text">(Optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why you're requesting this price..."
              className="bid-message-input"
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{message.length}/500</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Bid Summary */}
          {bidAmount && parseInt(bidAmount) >= minBid && (
            <div className="bid-summary">
              <div className="summary-row">
                <span>Original Price</span>
                <span className="original-price">NPR {originalPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Your Bid</span>
                <span className="bid-price">NPR {parseInt(bidAmount).toLocaleString()}</span>
              </div>
              <div className="summary-row savings">
                <span>You Save</span>
                <span>NPR {(originalPrice - parseInt(bidAmount)).toLocaleString()} ({discountPercentage}%)</span>
              </div>
              <div className="summary-row balance">
                <span>Your Balance</span>
                <span className={userBalance >= parseInt(bidAmount) ? 'sufficient' : 'insufficient'}>
                  NPR {userBalance.toLocaleString()}
                  {userBalance < parseInt(bidAmount) && ' (Insufficient)'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel-modal"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-submit-bid ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting || !bidAmount || parseInt(bidAmount) < minBid}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <Gavel size={18} />
                  Submit Bid
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeBidModal;
