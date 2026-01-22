import React, { useState } from 'react';

const SessionsView = ({ sessions, onCreate, onAction }) => {
    const [filter, setFilter] = useState('newest');

    const sortedSessions = [...sessions].sort((a, b) => {
        const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
        const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
        return filter === 'newest' ? dateA - dateB : dateB - dateA;
    });

    return (
        <div>
            <div className="uploads-section-header">
                <h2 className="section-title">All Sessions</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none pl-4 pr-10 py-2 border border-[#e5dcdc] rounded-lg text-sm bg-white text-[#181111] focus:ring-2 focus:ring-[#ea2a33] focus:border-transparent outline-none cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="newest">Upcoming (Nearest)</option>
                            <option value="oldest">Future (Farthest)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="material-symbols-outlined text-[#876467] text-sm">expand_more</span>
                        </div>
                    </div>
                    <button className="btn-premium btn-primary" onClick={() => onCreate()} style={{ width: 'auto' }}>
                        <span className="material-symbols-outlined">add</span> Schedule Session
                    </button>
                </div>
            </div>
            <div className="sessions-list">
                {sortedSessions.length === 0 ? <p>No sessions scheduled.</p> : sortedSessions.map((session, idx) => (
                    <div key={idx} className="session-item-professional">
                        <div className="session-accent"></div>
                        <div className="session-main-info">
                            <div className="session-time-badge">
                                <span className="material-symbols-outlined">calendar_today</span>
                                {new Date(session.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                <span className="time-sep">•</span>
                                <span className="material-symbols-outlined">schedule</span>
                                {session.scheduledTime}
                            </div>
                            <h4 className="session-title-large">{session.title}</h4>
                            <div className="session-details-row">
                                <span className="detail-pill"><span className="material-symbols-outlined">timer</span> {session.duration} mins</span>
                                <span className="detail-pill pricing">NPR {session.price}</span>
                                <span className={`status-pill status-${session.status}`}>{session.status}</span>
                            </div>
                            {session.description && <p className="session-desc-text">{session.description}</p>}
                        </div>
                        <div className="flex-row-center mt-4 w-full justify-start">
                            {session.meetingLink ? (
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="btn-premium btn-primary">
                                    Join
                                </a>
                            ) : (
                                <button className="btn-premium disabled" disabled>No Link</button>
                            )}
                            <button className="btn-premium btn-secondary" onClick={() => onCreate(session)}>
                                Edit
                            </button>
                            <button className="btn-premium btn-danger" onClick={() => { if (window.confirm('Delete session?')) onAction('deleteSession', session.id); }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionsView;
