import React, { useState, useMemo } from 'react';
import {
  X,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const MakeBidModal = ({ isOpen, onClose, session, onSubmitBid, userBalance }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const originalPrice = session?.price || 0;

  // Calculate bid constraints (60% - 100% of original price, max 40% discount)
  const minBid = Math.ceil(originalPrice * 0.6);
  const maxBid = originalPrice;

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!bidAmount || !originalPrice) return 0;
    return Math.round((1 - parseInt(bidAmount) / originalPrice) * 100);
  }, [bidAmount, originalPrice]);

  // Preset discount percentages (max 40%)
  const presetDiscounts = [10, 20, 30, 40];

  const handlePresetDiscount = (discount) => {
    const amount = Math.ceil(originalPrice * (1 - discount / 100));
    setBidAmount(amount.toString());
    setSelectedDiscount(discount);
  };

  const handleBidInputChange = (e) => {
    const value = e.target.value;
    setBidAmount(value);
    // Clear preset selection when manually typing
    if (value) {
      const manualDiscount = Math.round((1 - parseInt(value) / originalPrice) * 100);
      if (!presetDiscounts.includes(manualDiscount)) {
        setSelectedDiscount(null);
      } else {
        setSelectedDiscount(manualDiscount);
      }
    } else {
      setSelectedDiscount(null);
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
      setError(`Minimum bid is NPR ${minBid.toLocaleString()} (40% max discount)`);
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
        sessionId: session.videoUrl ? null : session.id, // If it has videoUrl, it's content
        contentId: session.videoUrl ? session.id : null, // Content items have videoUrl
        itemId: session.id,
        itemType: session.videoUrl ? 'content' : 'session',
        bidAmount: numBid,
        message: message.trim(),
        originalPrice: originalPrice
      });
      setBidAmount('');
      setMessage('');
      setSelectedDiscount(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBidAmount('');
    setMessage('');
    setSelectedDiscount(null);
    setError('');
    onClose();
  };

  if (!isOpen || !session) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="make-bid-modal-new" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bid-modal-header">
          <div className="bid-modal-header-left">
            <div className="bid-modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="#ea2a33"/>
              </svg>
            </div>
            <div>
              <h2 className="bid-modal-title">Make a Bid</h2>
              <p className="bid-modal-subtitle">Negotiate content access</p>
            </div>
          </div>
          <button className="bid-modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Session/Content Card */}
        <div className="bid-content-card">
          <div className="bid-content-thumbnail">
            {session.thumbnail ? (
              <img src={session.thumbnail} alt={session.title} />
            ) : (
              <div className="bid-content-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="bid-content-info">
            <h3 className="bid-content-title">{session.title}</h3>
            <div className="bid-content-meta">
              <span className="bid-content-badge">PREMIUM</span>
              <span className="bid-content-price">Base: NPR {originalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="bid-warning-notice">
          <AlertTriangle size={18} />
          <span>Bids can only be reduced by up to <strong>40%</strong> of the base price (Min: NPR {minBid.toLocaleString()})</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Bid Amount Input */}
          <div className="bid-form-group">
            <label className="bid-form-label">Your Bid (NPR)</label>
            <div className="bid-amount-input-wrapper">
              <input
                type="number"
                value={bidAmount}
                onChange={handleBidInputChange}
                placeholder={minBid.toString()}
                min={minBid}
                max={maxBid}
                className="bid-amount-input"
              />
              {bidAmount && discountPercentage > 0 && (
                <span className="bid-discount-badge">{discountPercentage}% OFF</span>
              )}
            </div>
          </div>

          {/* Preset Discount Buttons */}
          <div className="bid-preset-buttons">
            {presetDiscounts.map((discount) => (
              <button
                key={discount}
                type="button"
                className={`bid-preset-btn ${selectedDiscount === discount ? 'active' : ''}`}
                onClick={() => handlePresetDiscount(discount)}
              >
                -{discount}%
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="bid-form-group">
            <label className="bid-form-label">Message to Teacher</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why you're a good fit for this discounted rate..."
              className="bid-message-textarea"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bid-error-message">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bid-modal-actions">
            <button
              type="button"
              className="bid-cancel-btn"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bid-submit-btn"
              disabled={isSubmitting || !bidAmount || parseInt(bidAmount) < minBid}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bid'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeBidModal;
