import React, { useState } from 'react';
import PremiumDropdown from '../PremiumDropdown';
import SessionListItem from './SessionListItem';

const SessionsView = ({ sessions, onCreate, onAction }) => {
    const [filter, setFilter] = useState('all');

    const filterSessions = () => {
        const now = new Date();
        
        // Debug logging
        console.log('[SessionsView] Total sessions:', sessions?.length);
        console.log('[SessionsView] Filter:', filter);
        
        if (!sessions || sessions.length === 0) return [];
        
        return sessions.filter(session => {
            const sessionDateTime = new Date(`${session.scheduledDate}T${session.scheduledTime || '00:00'}`);
            const isUpcoming = sessionDateTime > now;
            const isPast = sessionDateTime <= now;
            
            switch(filter) {
                case 'all':
                    return true;
                case 'upcoming':
                    return isUpcoming;
                case 'completed':
                    return session.status === 'completed';
                case 'past':
                    return isPast || session.status === 'missed';
                default:
                    return true;
            }
        }).sort((a, b) => {
            const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`);
            const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`);
            return dateA - dateB; // Nearest first
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
                                    { value: 'all', label: 'All Sessions', icon: 'list' },
                                    { value: 'upcoming', label: 'Upcoming', icon: 'schedule' },
                                    { value: 'completed', label: 'Completed', icon: 'check_circle' },
                                    { value: 'past', label: 'Past/Missed', icon: 'history' },
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
