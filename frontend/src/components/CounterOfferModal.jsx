import React, { useState, useEffect } from 'react';
import PremiumDatePicker from './PremiumDatePicker';
import PremiumTimePicker from './PremiumTimePicker';
import '../css/teacher.css';

const CounterOfferModal = ({ isOpen, onClose, onSend, bid }) => {
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (isOpen && bid) {
            // Pre-fill or reset logic if needed
            setPrice('');
            setMessage('');
            setDate('');
            setTime('');
        }
    }, [isOpen, bid]);

    if (!isOpen || !bid) return null;

    const handleSend = () => {
        onSend({
            originalBidId: bid.id,
            counterPrice: price,
            message,
            proposedDate: date,
            proposedTime: time
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div
                className="bg-white w-full max-w-lg rounded-3xl border border-[#e5dcdd] shadow-2xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="modal-title">Counter Offer</h2>
                        <p className="modal-subtitle">Propose a new price or time</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="modal-close-btn"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Bid Context */}
                    <div className="counter-offer-bid-card">
                        <div className="flex items-center gap-4">
                            <div
                                className="counter-offer-avatar"
                                style={{ backgroundImage: `url('${bid.studentAvatar}')` }}
                            ></div>
                            <div>
                                <p className="counter-offer-label">Student's Bid</p>
                                <p className="text-lg font-black text-primary">{bid.bidAmount}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="counter-offer-label">Skill</p>
                            <p className="counter-offer-value">{bid.skillName}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="modal-label">Your Counter Offer (NPR)</label>
                            <div className="upload-price-input-wrapper">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">Rs.</span>
                                <input
                                    className="upload-price-input"
                                    type="number"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <p className="counter-offer-hint">
                                <span className="text-primary font-black uppercase tracking-tighter mr-1">Pro Tip:</span>
                                Stay within 15% of the original bid for better acceptance.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="modal-label">Message to Student</label>
                            <textarea
                                className="modal-textarea"
                                style={{ minHeight: '120px' }}
                                placeholder="Explain your proposal..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        {/* <div className="space-y-3">
                            <label className="modal-label">Alternative Date & Time (Optional)</label>
                            <div className="grid grid-cols-2 gap-4">
                                <PremiumDatePicker
                                    value={date}
                                    onChange={setDate}
                                    placeholder="Select Date"
                                />
                                <PremiumTimePicker
                                    value={time}
                                    onChange={setTime}
                                    placeholder="Select Time"
                                />
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-premium btn-secondary sm:w-1/3 py-4"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            className="btn-premium btn-primary flex-1 py-4"
                        >
                            <span className="material-symbols-outlined">gavel</span>
                            Send Counter Offer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounterOfferModal;
