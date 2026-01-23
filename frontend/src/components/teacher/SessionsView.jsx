import React, { useState } from 'react';
import PremiumDropdown from '../PremiumDropdown';
import SessionListItem from './SessionListItem';

const SessionsView = ({ sessions, onCreate, onAction }) => {
    const [filter, setFilter] = useState('newest');

    const filterSessions = () => {
        const now = new Date();
        
        return sessions.filter(session => {
            const sessionDateTime = new Date(`${session.scheduledDate}T${session.scheduledTime}`);
            const timeDiff = (now - sessionDateTime) / (1000 * 60); // difference in minutes
            
            switch(filter) {
                case 'newest':
                    // Upcoming sessions only (not past 30 mins)
                    return timeDiff <= 30;
                case 'oldest':
                    // Farthest upcoming sessions
                    return timeDiff <= 30;
                case 'completed':
                    // Sessions marked as completed
                    return session.status === 'completed';
                case 'missed':
                    // Sessions that are past 30 mins and weren't joined
                    return session.status === 'missed' || (timeDiff > 30 && session.status !== 'completed');
                default:
                    return true;
            }
        }).sort((a, b) => {
            const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
            const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
            return filter === 'oldest' ? dateB - dateA : dateA - dateB;
        });
    };

    const sortedSessions = filterSessions();

    return (
        <div className="sessions-v2-container">
            {/* Empty space for potential future header elements, or just padding */}
            <div className="mb-4"></div>

            {/* Header & Controls */}
            <div className="page-header">
                <div className="page-header-content">
                    <h2>View Sessions</h2>
                    <p>Manage your upcoming classes.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="premium-select-container" style={{ minWidth: '200px' }}>
                            <PremiumDropdown
                                options={[
                                    { value: 'newest', label: 'Upcoming', icon: 'schedule' },
                                    { value: 'oldest', label: 'Farthest', icon: 'calendar_month' },
                                    { value: 'completed', label: 'Completed', icon: 'check_circle' },
                                    { value: 'missed', label: 'Missed', icon: 'cancel' },
                                ]}
                                value={filter}
                                onChange={(val) => setFilter(val)}
                            />
                        </div>
                        <button
                            className="session-btn-primary"
                            onClick={() => onCreate()}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>add</span>
                            Schedule Session
                        </button>
                    </div>
                </div>
            </div>

            {/* Sessions List */}
            <div className="sessions-list-v2">
                {sortedSessions.length === 0 ? (
                    <div className="empty-state-v2">
                        <span className="material-symbols-outlined calendar-icon">calendar_month</span>
                        <p>{filter === 'missed' ? 'No missed sessions' : filter === 'completed' ? 'No completed sessions yet' : 'No more scheduled sessions for this week'}</p>
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
