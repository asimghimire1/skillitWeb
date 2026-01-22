import React, { useState } from 'react';

const SessionListItem = ({ session, onCreate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-[#e5dcdc] overflow-hidden transition-all duration-300 mb-4">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <h4 className="font-bold text-[#181111]">{session.title}</h4>
                    <p className="text-xs text-[#886364] mt-1">
                        {new Date(session.scheduledDate).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 'Tomorrow'}, {session.scheduledTime}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="avatar-group hidden sm:flex">
                        <div className="avatar-circle" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${(session.id || 0) + 20}')` }}></div>
                        <div className="avatar-circle" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${(session.id || 0) + 21}')`, marginLeft: '-0.75rem' }}></div>
                    </div>

                    {/* Quick Join Button (Visible when collapsed) */}
                    {!isExpanded && session.meetingLink && (
                        <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#ea2a33] text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Join
                        </a>
                    )}

                    {/* Expand Icon */}
                    <span className={`material-symbols-outlined text-[#886364] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-[#f4f0f0] animate-fade-in">
                    <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                        <div className="bg-[#f9f9f9] p-3 rounded-xl border border-[#f0e8e9]">
                            <span className="block text-[10px] text-[#886364] uppercase tracking-wider font-bold mb-1">Duration</span>
                            <span className="text-sm font-bold text-[#181111]">{session.duration} mins</span>
                        </div>
                        <div className="bg-[#f9f9f9] p-3 rounded-xl border border-[#f0e8e9]">
                            <span className="block text-[10px] text-[#886364] uppercase tracking-wider font-bold mb-1">Price</span>
                            <span className="text-sm font-bold text-[#ea2a33]">{session.price > 0 ? `NPR ${session.price}` : 'Free'}</span>
                        </div>
                    </div>

                    {session.description && (
                        <div className="mb-4 p-3 bg-white rounded-xl border border-[#f4f0f0]">
                            <span className="block text-[10px] text-[#886364] uppercase tracking-wider font-bold mb-1">About this session</span>
                            <p className="text-xs text-[#564e4e] leading-relaxed">
                                {session.description}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {session.meetingLink ? (
                            <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-premium btn-primary w-full"
                            >
                                <span className="material-symbols-outlined">video_call</span>
                                Join Session
                            </a>
                        ) : (
                            <button disabled className="btn-premium disabled w-full">
                                <span className="material-symbols-outlined">link_off</span>
                                Link Not Available
                            </button>
                        )}
                        {onCreate && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onCreate(session); }}
                                className="btn-premium btn-secondary w-full"
                            >
                                <span className="material-symbols-outlined">edit</span>
                                Edit Session
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionListItem;
