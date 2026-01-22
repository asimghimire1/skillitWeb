import React, { useState, useEffect } from 'react';

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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay" style={{ backgroundColor: 'rgba(24, 17, 17, 0.4)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#e5dcdc] overflow-hidden">
                <div className="p-6 border-b border-[#e5dcdc] flex items-center justify-between">
                    <h2 className="text-xl font-bold font-display text-[#181111]">Send Counter Offer</h2>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-[#f4f0f0] transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#886364]">close</span>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="bg-[#fcf8f8] border border-primary/10 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="size-10 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${bid.studentAvatar}')`, width: '2.5rem', height: '2.5rem' }}
                            ></div>
                            <div>
                                <p className="text-xs font-medium text-[#886364] uppercase tracking-wider">Student's Bid</p>
                                <p className="font-bold text-[#181111]">{bid.bidAmount}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-[#886364] uppercase tracking-wider">Topic</p>
                            <p className="text-sm font-semibold text-[#181111]">{bid.skillName}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#181111]" htmlFor="price">
                            Your Counter Offer (NPR)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#886364]">NPR</span>
                            <input
                                className="w-full pl-16 pr-4 py-3 bg-[#f4f0f0] border-none rounded-xl focus:ring-2 focus:ring-primary text-lg font-bold text-[#181111]"
                                id="price"
                                placeholder="0.00"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-[#886364]">
                            <span className="text-primary font-bold">Recommended range:</span> NPR 1,600 - NPR 2,100 for this session type.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#181111]" htmlFor="message">
                            Message to Student
                        </label>
                        <textarea
                            className="w-full px-4 py-3 bg-[#f4f0f0] border-none rounded-xl focus:ring-2 focus:ring-primary text-sm min-h-[100px] resize-none text-[#181111]"
                            id="message"
                            placeholder="Explain why you're proposing this price or suggest changes..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#181111]">
                            Alternative Date/Time (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#886364] text-lg">calendar_month</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#f4f0f0] border-none rounded-xl focus:ring-2 focus:ring-primary text-sm text-[#181111]"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#886364] text-lg">schedule</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#f4f0f0] border-none rounded-xl focus:ring-2 focus:ring-primary text-sm text-[#181111]"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-[#e5dcdc] flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-[#e5dcdc] rounded-xl font-bold hover:bg-[#f4f0f0] transition-all text-[#181111]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        className="flex-[2] px-6 py-3 bg-[#ea2a33] text-white rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-opacity-90 hover:scale-[1.02] transition-all"
                    >
                        Send Counter Offer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CounterOfferModal;
