import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import CounterOfferModal from './CounterOfferModal';

const BidRequestsView = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('All Bids');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);

    // Stats data
    const stats = [
        { label: 'Total Bids', value: '0', color: 'text-[#181111]' },
        { label: 'Pending Review', value: '0', color: 'text-[#ea2a33]' },
        { label: 'Avg Bid', value: 'NPR 0', color: 'text-[#181111]' },
        { label: 'Acceptance Rate', value: '0%', color: 'text-[#07885d]' }
    ];

    // Mock Bid Data
    const [allBids, setAllBids] = useState([]);

    const filteredBids = allBids.filter(bid => {
        const matchesTab = activeTab === 'All Bids' || bid.status === activeTab;
        const matchesSearch = bid.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bid.skillName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleAction = (id, action) => {
        setAllBids(prev => prev.map(bid => {
            if (bid.id === id) {
                return { ...bid, status: action === 'Accept' ? 'Accepted' : action === 'Decline' ? 'Declined' : bid.status };
            }
            return bid;
        }));

        if (action === 'Accept') showToast("Bid accepted successfully!", "success");
        if (action === 'Decline') showToast("Bid declined.", "info");
    };

    const handleCounterOffer = (bid) => {
        setSelectedBid(bid);
        setIsCounterModalOpen(true);
    };

    const handleSendCounter = (counterData) => {
        setAllBids(prev => prev.map(bid => {
            if (bid.id === counterData.originalBidId) {
                return { ...bid, status: 'Negotiating', bidAmount: `NPR ${counterData.counterPrice} (Counter)` };
            }
            return bid;
        }));
        showToast("Counter offer sent!", "success");
    };

    return (
        <div className="flex-1 bg-[#fcfafa] min-h-screen font-display text-[#181111]">
            {/* Tabs Filter - Simplified and integrated */}
            <div className="bg-white border-b border-[#e5dcdc] px-8 sticky top-0 z-[45]">
                <div className="tabs-container">
                    {['All Bids', 'Pending', 'Accepted', 'Declined', 'Negotiating'].map((tab) => (
                        <div
                            key={tab}
                            className={`tab-link ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-8 max-w-[1200px] mx-auto animate-fade-in">
                {/* Stats Row */}
                <div className="bids-stats-row">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bid-management-card hover-lift">
                            <p className="text-[#886364] text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Bids List */}
                <div className="space-y-6">
                    {filteredBids.length === 0 ? (
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-state-icon">request_quote</span>
                            <p className="empty-state-text">No bid requests found matching your filters.</p>
                        </div>
                    ) : filteredBids.map((bid) => (
                        <div key={bid.id} className="bg-white rounded-2xl border border-[#e5dcdc] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                    <div className="flex items-center gap-5">
                                        <div
                                            className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-[#f4f0f0] shadow-sm"
                                            style={{ backgroundImage: `url('${bid.studentAvatar}')` }}
                                        ></div>
                                        <div>
                                            <h3 className="text-lg font-black leading-tight mb-1">{bid.studentName}</h3>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-sm font-bold text-[#ea2a33] bg-[#ffe5e7] px-2 py-0.5 rounded-md">
                                                    {bid.skillName}
                                                </span>
                                                <span className="text-xs text-[#886364] font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                                    {bid.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1">
                                        <span className="text-[10px] font-bold text-[#886364] uppercase tracking-widest">Student's Bid</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-black tracking-tight">{bid.bidAmount}</span>
                                            {bid.status === 'Pending' && (
                                                <div className="flex items-center gap-1 bg-[#fff8e1] text-[#f57c00] px-2 py-1 rounded-lg text-[10px] font-black animate-pulse">
                                                    <span className="material-symbols-outlined text-[10px]">timer</span>
                                                    {bid.timeLeft}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#fcfafa] p-4 rounded-xl border border-[#f4f0f0] mb-6 relative italic text-sm text-[#564e4e] leading-relaxed">
                                    <span className="material-symbols-outlined absolute -top-3 -left-1 text-[#e5dcdc] text-4xl select-none">format_quote</span>
                                    <p className="relative z-10 px-4">"{bid.message}"</p>
                                </div>

                                <div className="action-pills-row">
                                    <div className="mr-auto text-[10px] font-bold text-[#886364] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs">event</span>
                                        Proposed: {bid.proposedDate}
                                    </div>

                                    {bid.status === 'Pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(bid.id, 'Decline')}
                                                className="btn-premium btn-danger text-xs px-4"
                                            >
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => handleCounterOffer(bid)}
                                                className="btn-premium btn-secondary text-xs px-4"
                                                style={{ backgroundColor: '#fff8e1', color: '#f57c00', border: '1px solid #ffe082' }}
                                            >
                                                Counter
                                            </button>
                                            <button
                                                onClick={() => handleAction(bid.id, 'Accept')}
                                                className="btn-premium btn-primary text-xs px-6"
                                                style={{ backgroundColor: '#07885d', boxShadow: '0 4px 14px 0 rgba(7, 136, 93, 0.39)' }}
                                            >
                                                Accept Bid
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${bid.status === 'Accepted' ? 'bg-[#e8f5e9] text-[#07885d]' :
                                            bid.status === 'Declined' ? 'bg-[#ffebee] text-[#dc2626]' :
                                                'bg-[#fff8e1] text-[#f57c00]'
                                            }`}>
                                            {bid.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CounterOfferModal
                isOpen={isCounterModalOpen}
                onClose={() => setIsCounterModalOpen(false)}
                onSend={handleSendCounter}
                bid={selectedBid}
            />
        </div>
    );
};

export default BidRequestsView;

