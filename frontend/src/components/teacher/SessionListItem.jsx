import React, { useState } from 'react';

const SessionListItem = ({ session, onCreate, onAction }) => {
    const date = new Date(session.scheduledDate);
    const day = date.getDate();
    const month = date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
    const year = date.getFullYear();

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
                    <span className="text-[#d1c1c2]">•</span>
                    <div className="session-status-badge scheduled">
                        • Scheduled
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
                {session.meetingLink ? (
                    <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#ea2a33] text-white px-10 py-3 rounded-2xl font-black text-sm hover:bg-[#d6252d] hover:shadow-xl hover:shadow-red-500/30 transition-all shadow-md shadow-red-500/20"
                    >
                        Join
                    </a>
                ) : (
                    <button disabled className="bg-gray-100 text-[#876467] px-8 py-3 rounded-2xl font-black text-sm cursor-not-allowed">
                        Join
                    </button>
                )}
                <div className="h-8 w-px bg-gray-100"></div>
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
