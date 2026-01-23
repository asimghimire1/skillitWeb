import React, { useState } from 'react';
import {
  X,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const AddCreditsModal = ({ isOpen, onClose, onAddCredits, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('esewa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: <Smartphone size={20} /> },
    { id: 'khalti', name: 'Khalti', icon: <Smartphone size={20} /> },
    { id: 'card', name: 'Card', icon: <CreditCard size={20} /> },
    { id: 'bank', name: 'Bank Transfer', icon: <Building2 size={20} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 100) {
      setError('Minimum amount is NPR 100');
      return;
    }
    if (numAmount > 100000) {
      setError('Maximum amount is NPR 100,000');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        await onAddCredits(numAmount);
        setAmount('');
        setIsProcessing(false);
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to add credits');
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-credits-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <Wallet size={24} className="modal-header-icon" />
            <div>
              <h2 className="modal-title">Add Credits</h2>
              <p className="modal-subtitle">Top up your wallet balance</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Current Balance */}
        <div className="current-balance-card">
          <span className="balance-label">Current Balance</span>
          <span className="balance-value">NPR {(currentBalance || 0).toLocaleString()}</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="form-group">
            <label className="form-label">Enter Amount (NPR)</label>
            <div className="amount-input-wrapper">
              <span className="amount-prefix">NPR</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="100"
                max="100000"
                className="amount-input"
              />
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="preset-amounts">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`preset-btn ${amount === preset.toString() ? 'active' : ''}`}
                onClick={() => setAmount(preset.toString())}
              >
                NPR {preset.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div className="payment-methods-grid">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`payment-method-btn ${selectedMethod === method.id ? 'active' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  {method.icon}
                  <span>{method.name}</span>
                  {selectedMethod === method.id && <Check size={16} className="check-icon" />}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Summary */}
          {amount && parseInt(amount) >= 100 && (
            <div className="credits-summary">
              <div className="summary-row">
                <span>Amount</span>
                <span>NPR {parseInt(amount).toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Processing Fee</span>
                <span className="free-text">Free</span>
              </div>
              <div className="summary-row total">
                <span>New Balance</span>
                <span>NPR {((currentBalance || 0) + parseInt(amount)).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Demo Notice */}
          <div className="demo-notice">
            <Sparkles size={14} />
            <span>Demo Mode: No real payment will be processed</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn-add-credits ${isProcessing ? 'processing' : ''}`}
            disabled={isProcessing || !amount}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <Wallet size={18} />
                Add NPR {amount ? parseInt(amount).toLocaleString() : '0'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCreditsModal;
