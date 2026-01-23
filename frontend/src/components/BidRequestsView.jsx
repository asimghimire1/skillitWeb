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
        { label: 'Total Bids', value: '0', colorClass: '' },
        { label: 'Pending Review', value: '0', colorClass: 'primary' },
        { label: 'Avg Bid', value: 'NPR 0', colorClass: '' },
        { label: 'Acceptance Rate', value: '0%', colorClass: 'success' }
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
        <div className="bids-view-container">
            {/* Tabs Filter - Simplified and integrated */}
            <div className="bids-tabs-header">
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
            <div className="bids-content-container">
                {/* Stats Row */}
                <div className="bids-stats-row">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bid-management-card hover-lift">
                            <p className="bid-stat-label">{stat.label}</p>
                            <p className={`bid-stat-value ${stat.colorClass}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Bids List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {filteredBids.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>request_quote</span>
                            </div>
                            <p className="empty-state-text">No bid requests found matching your filters.</p>
                        </div>
                    ) : filteredBids.map((bid) => (
                        <div key={bid.id} className="bid-request-card">
                            <div className="bid-request-card-body">
                                <div className="bid-request-header">
                                    <div className="bid-requester-info">
                                        <div
                                            className="bid-requester-avatar"
                                            style={{ backgroundImage: `url('${bid.studentAvatar}')` }}
                                        ></div>
                                        <div>
                                            <h3 className="bid-requester-name">{bid.studentName}</h3>
                                            <div className="bid-requester-meta">
                                                <span className="bid-skill-tag">
                                                    {bid.skillName}
                                                </span>
                                                <span className="bid-duration-tag">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>schedule</span>
                                                    {bid.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bid-amount-info">
                                        <span className="bid-amount-label">Student's Bid</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span className="bid-amount-value">{bid.bidAmount}</span>
                                            {bid.status === 'Pending' && (
                                                <div className="bid-timer">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '0.625rem' }}>timer</span>
                                                    {bid.timeLeft}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bid-message-box">
                                    <span className="material-symbols-outlined bid-message-quote">format_quote</span>
                                    <p style={{ position: 'relative', zIndex: 10, padding: '0 1rem' }}>"{bid.message}"</p>
                                </div>

                                <div className="bid-actions-row">
                                    <div className="bid-proposed-date">
                                        <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>event</span>
                                        Proposed: {bid.proposedDate}
                                    </div>

                                    {bid.status === 'Pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(bid.id, 'Decline')}
                                                className="btn-premium btn-danger"
                                                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                                            >
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => handleCounterOffer(bid)}
                                                className="btn-premium btn-secondary"
                                                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', backgroundColor: '#fff8e1', color: '#f57c00', border: '1px solid #ffe082' }}
                                            >
                                                Counter
                                            </button>
                                            <button
                                                onClick={() => handleAction(bid.id, 'Accept')}
                                                className="btn-premium btn-primary"
                                                style={{ fontSize: '0.75rem', padding: '0.5rem 1.5rem', backgroundColor: '#07885d', boxShadow: '0 4px 14px 0 rgba(7, 136, 93, 0.39)' }}
                                            >
                                                Accept Bid
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`bid-status-badge ${bid.status.toLowerCase()}`}>
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

