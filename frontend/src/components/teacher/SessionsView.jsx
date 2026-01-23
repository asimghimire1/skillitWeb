import React, { useState } from 'react';
import PremiumDropdown from '../PremiumDropdown';
import SessionListItem from './SessionListItem';

const SessionsView = ({ sessions, onCreate, onAction }) => {
    const [filter, setFilter] = useState('newest');

    const sortedSessions = [...sessions].sort((a, b) => {
        const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
        const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
        return filter === 'newest' ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="sessions-v2-container">
            {/* Empty space for potential future header elements, or just padding */}
            <div className="mb-4"></div>

            {/* Header & Controls */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#ea2a33]">Sessions Schedule</h2>
                    <p className="text-gray-500 mt-1">Manage your upcoming classes and bookings.</p>
                </div>
                <div className="flex items-center justify-end">
                    <div className="flex gap-4">
                        <div className="premium-select-container min-w-[200px]">
                            <PremiumDropdown
                                options={[
                                    { value: 'newest', label: 'Upcoming', icon: 'schedule' },
                                    { value: 'oldest', label: 'Farthest', icon: 'calendar_month' },
                                ]}
                                value={filter}
                                onChange={(val) => setFilter(val)}
                            />
                        </div>
                        <button
                            className="bg-[#ea2a33] text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-[#d6252d] hover:shadow-xl hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                            onClick={() => onCreate()}
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Schedule Session
                        </button>
                    </div>
                </div>
            </div>

            {/* Sessions List */}
            <div className="sessions-list-v2">
                {sortedSessions.length === 0 ? (
                    <div className="empty-state-v2 bg-white rounded-3xl border border-[#e5dcdc] border-dashed">
                        <span className="material-symbols-outlined calendar-icon">calendar_month</span>
                        <p>No more scheduled sessions for this week</p>
                    </div>
                ) : (
                    sortedSessions.map((session, idx) => (
                        <SessionListItem
                            key={session.id || idx}
                            session={session}
                            onCreate={onCreate}
                            onAction={onAction}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SessionsView;
