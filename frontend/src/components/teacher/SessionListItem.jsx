import React, { useState } from 'react';

const SessionListItem = ({ session, onCreate, onAction }) => {
    const date = new Date(session.scheduledDate);
    const day = date.getDate();
    const month = date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
    const year = date.getFullYear();

    // Determine status badge
    const getStatusBadge = () => {
        if (session.status === 'completed') {
            return { className: 'completed', text: '• Completed' };
        }
        if (session.status === 'missed') {
            return { className: 'missed', text: '• Missed' };
        }
        return { className: 'scheduled', text: '• Scheduled' };
    };

    const statusBadge = getStatusBadge();

    return (
        <div className="session-card-v2">
            <div className="session-accent-bar"></div>

            {/* Date Block */}
            <div className="session-date-block">
                <span className="date-month">{month}</span>
                <span className="date-day">{day}</span>
                <span className="date-year">{year}</span>
            </div>

            {/* Content Area */}
            <div className="session-content-v2">
                <div className="session-meta-top">
                    <div className="session-time-v2">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {session.scheduledTime}
                    </div>
                    <span className="session-dot-separator">•</span>
                    <div className={`session-status-badge ${statusBadge.className}`}>
                        {statusBadge.text}
                    </div>
                </div>

                <h3 className="session-title-v2">{session.title}</h3>

                <div className="session-pills-row">
                    <div className="session-pill-v2">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        {session.duration} mins
                    </div>
                    <div className="session-pill-v2">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        {session.price > 0 ? `NPR ${session.price}` : 'Free'}
                    </div>
                </div>
            </div>

            {/* Actions Area */}
            <div className="session-actions-v2">
                {session.meetingLink && session.status !== 'missed' && session.status !== 'completed' ? (
                    <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="session-join-btn"
                    >
                        Join
                    </a>
                ) : (
                    <button disabled className="session-join-btn">
                        {session.status === 'completed' ? 'Done' : session.status === 'missed' ? 'Missed' : 'Join'}
                    </button>
                )}
                <div style={{ height: '2rem', width: '1px', backgroundColor: '#f3f4f6' }}></div>
                <button
                    className="action-icon-btn"
                    onClick={() => onAction('editSession', session)}
                >
                    <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                    className="action-icon-btn delete"
                    onClick={() => onAction('deleteSession', session.id)}
                >
                    <span className="material-symbols-outlined text-xl">delete_outline</span>
                </button>
            </div>
        </div>
    );
};

export default SessionListItem;
