import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import SessionListItem from './SessionListItem';
import ContentCard from './ContentCard';
import {
    Users,
    Video,
    Wallet,
    ArrowRight,
    Sparkles,
    Calendar,
    Banknote,
    History,
    TrendingUp,
    CloudUpload,
    ChevronUp,
    ChevronDown,
    Edit,
    VideoIcon
} from 'lucide-react';

const DashboardView = ({ stats, uploads, sessions, posts, quickActions, onAction, teacher }) => {
    const { showToast } = useToast();
    // Use the passed posts, sorted by newest first
    const recentPosts = [...(posts || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const recentUploads = uploads.filter(u => u.category !== 'Announcements').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const statCards = [
        { icon: <Users size={24} />, label: 'Total Students', value: 0, color: '#886364' },
        { icon: <Video size={24} />, label: 'Active Sessions', value: stats.activeSessions || 0, color: '#886364' },
        { icon: <Wallet size={24} />, label: 'Monthly Earnings', value: `NPR ${(stats.monthlyEarnings || 0).toLocaleString()}`, color: '#ea2a33' },
    ];

    // TODO: Replace with real API data
    const bidRequests = [];

    return (
        <>
            <div className="stats-grid">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="stat-card hover-lift">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}10` }}>
                            <div style={{ color: stat.color }}>{stat.icon}</div>
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">{stat.label}</p>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-actions-section" style={{ marginBottom: '3rem' }}>
                <h2 className="section-title" style={{ marginBottom: '2rem' }}>Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {quickActions.map((action, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-10 rounded-[40px] border border-[#e5dcdc] hover:border-[#ea2a33]/30 transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer group flex flex-col items-start"
                            onClick={action.action}
                        >
                            <div className="size-16 rounded-full bg-[#ea2a33] flex items-center justify-center mb-8 shadow-lg shadow-[#ea2a33]/20 group-hover:scale-110 transition-transform duration-300">
                                <div className="text-white">
                                    {typeof action.icon === 'string' ? (
                                        <span className="material-symbols-outlined text-3xl">{action.icon}</span>
                                    ) : (
                                        action.icon
                                    )}
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-[#181111] mb-3">{action.title}</h3>
                            <p className="text-xs text-[#886364] leading-relaxed font-medium">
                                {action.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side-by-Side: Recent Posts & Upcoming Sessions */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8" style={{ marginBottom: '2.5rem' }}>
                {/* Recent Posts */}
                <div className="bg-white rounded-[40px] border border-[#e5dcdc] overflow-hidden flex flex-col h-full">
                    <div className="flex justify-between items-center px-8 py-4 border-b border-gray-50 bg-[#fafafa]/30">
                        <h2 className="text-lg font-black text-[#181111]">Recent Posts</h2>
                        <button className="flex items-center gap-1 text-[10px] font-black text-[#886364] hover:text-[#ea2a33] transition-colors" onClick={() => onAction('posts')}>
                            View All <ArrowRight size={12} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="p-8 flex-grow flex flex-col justify-center">
                        {recentPosts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="size-14 rounded-full bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center mb-4">
                                    <Sparkles size={24} className="text-[#ea2a33]" />
                                </div>
                                <h3 className="text-xl font-black text-[#181111] mb-2">No Posts Yet</h3>
                                <p className="text-[10px] text-[#886364] max-w-[300px] leading-relaxed font-medium">
                                    Share your first update or tip with your students.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentPosts.slice(0, 1).map((post, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-[32px] shadow-sm border border-[#e5dcdc] relative group">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center shrink-0 border border-gray-100"
                                                style={{
                                                    backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || teacher?.fullName || "Teacher") + "&background=ea2a33&color=fff"}')`
                                                }}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#181111] text-xs">{teacher?.fullname || teacher?.fullName || 'Teacher'}</span>
                                                    <span className="bg-[#ffe5e7] text-[#ea2a33] text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-wider uppercase">Teacher</span>
                                                </div>
                                                <span className="text-[#886364] text-[10px] block">{new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-[#564e4e] text-xs leading-relaxed line-clamp-2">
                                            {post.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="bg-white rounded-[40px] border border-[#e5dcdc] overflow-hidden flex flex-col h-full">
                    <div className="flex justify-between items-center px-8 py-4 border-b border-gray-50 bg-[#fafafa]/30">
                        <h2 className="text-lg font-black text-[#181111]">Upcoming Sessions</h2>
                        <button className="flex items-center gap-1 text-[10px] font-black text-[#886364] hover:text-[#ea2a33] transition-colors" onClick={() => onAction('sessions')}>
                            View All <ArrowRight size={12} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="p-8 flex-grow flex flex-col justify-center">
                        {sessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="size-14 rounded-full bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center mb-4">
                                    <Calendar size={24} className="text-[#ea2a33]" />
                                </div>
                                <h3 className="text-xl font-black text-[#181111] mb-2">No Sessions Yet</h3>
                                <button className="text-[10px] font-black text-[#ea2a33] hover:underline" onClick={() => onAction('session')}>Create Session</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sessions.slice(0, 2).map((session, idx) => (
                                    <SessionItemWithDetails
                                        key={session.id || idx}
                                        session={session}
                                        onAction={onAction}
                                        compact={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Latest Bid Requests Section */}
            <div className="bg-white rounded-[40px] border border-[#e5dcdc] overflow-hidden" style={{ marginBottom: '2.5rem' }}>
                <div className="flex justify-between items-center px-10 py-4 border-b border-gray-50 bg-[#fafafa]/30">
                    <h2 className="text-lg font-black text-[#181111]">Latest Bid Requests</h2>
                    <button className="flex items-center gap-1 text-[10px] font-black text-[#886364] hover:text-[#ea2a33] transition-colors" onClick={() => onAction('bids')}>
                        View All <ArrowRight size={14} strokeWidth={3} />
                    </button>
                </div>

                <div className="px-10 py-6">
                    {bidRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="size-14 rounded-full bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-500">
                                <Banknote size={24} className="text-[#ea2a33]" />
                            </div>
                            <h3 className="text-xl font-black text-[#181111] mb-2">No Bids Yet</h3>
                            <p className="text-[10px] text-[#886364] max-w-[320px] leading-relaxed font-medium">
                                Your active sessions will appear here once students start bidding.
                            </p>
                        </div>
                    ) : (
                        <div className="bids-grid">
                            {bidRequests.map((bid) => (
                                <div key={bid.id} className="bid-card">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="bid-student-avatar" style={{ backgroundImage: `url('${bid.avatar}')` }}></div>
                                            <div>
                                                <h4 className="font-bold text-base">{bid.studentName}</h4>
                                                <div className="flex items-center gap-1 text-xs text-[#886364]">
                                                    <History size={10} />
                                                    {bid.timeAgo}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#886364]">Requested Skill</span>
                                            <p className="text-sm font-bold text-primary">{bid.skill}</p>
                                        </div>
                                    </div>
                                    <div className="bid-info-box">
                                        <div>
                                            <p className="text-xs text-[#886364] mb-1">Base Price: <span className="line-through">${bid.basePrice.toFixed(2)}</span></p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="bid-price">${bid.bidAmount.toFixed(2)}</span>
                                                <span className="bid-trend">
                                                    <TrendingUp size={12} /> +{bid.increase}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="btn-premium btn-secondary text-xs" onClick={() => showToast('Inquiry sent to Sarah', 'info')}>Decline</button>
                                            <button className="btn-premium btn-primary text-xs" onClick={() => showToast('Bid accepted! Preparing session...', 'success')}>Accept Bid</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Uploads Section - At the bottom */}
            <div className="uploads-section" style={{ marginBottom: '2rem' }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-[#181111]">Recent Uploads</h2>
                    <button className="text-xs font-bold text-[#ea2a33] hover:text-[#c91d2b] transition-colors" onClick={() => onAction('content')}>View All Library</button>
                </div>
                {recentUploads.length === 0 ? (
                    <div className="bg-white rounded-[40px] border border-[#e5dcdc] p-10 flex flex-col items-center justify-center text-center">
                        <div className="size-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                            <CloudUpload size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-[#886364]">No content uploaded yet</p>
                        <button className="text-xs font-bold text-[#ea2a33] mt-2 hover:underline" onClick={() => onAction('upload')}>Upload Now</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentUploads.slice(0, 3).map((upload, idx) => (
                            <ContentCard
                                key={idx}
                                upload={upload}
                                teacher={teacher}
                                onAction={onAction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

const SessionItemWithDetails = ({ session, onAction, compact }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (compact) {
        return (
            <div className="bg-white rounded-[24px] border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-black text-sm text-[#181111]">{session.title}</h4>
                        <p className="text-[10px] text-[#ea2a33] font-bold mt-1">
                            {session.scheduledDate === new Date().toLocaleDateString() ? 'Today' : session.scheduledDate}, {session.scheduledTime}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        className="flex-grow py-2 bg-[#ea2a33] text-white text-[10px] font-black rounded-xl hover:bg-[#c91d2b] transition-all flex items-center justify-center gap-1.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (session.meetingLink) {
                                window.open(session.meetingLink, '_blank');
                            } else {
                                onAction('session');
                            }
                        }}
                    >
                        <VideoIcon size={14} />
                        Join Session
                    </button>
                    <button
                        className={`px-3 py-2 border rounded-xl text-[10px] font-bold transition-all ${isExpanded ? 'bg-gray-100 border-gray-200 text-gray-700' : 'border-[#e5dcdc] text-[#886364] hover:bg-gray-50'}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Hide' : 'Details'}
                    </button>
                </div>

                {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-gray-50 animate-fade-in">
                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                            <div>
                                <p className="font-bold text-gray-400 uppercase tracking-tighter mb-1">Duration</p>
                                <p className="text-gray-600 font-medium">{session.duration} mins</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-400 uppercase tracking-tighter mb-1">Type</p>
                                <p className="text-gray-600 font-medium capitalize">{session.paymentType || 'Free'}</p>
                            </div>
                            {session.notes && (
                                <div className="col-span-2">
                                    <p className="font-bold text-gray-400 uppercase tracking-tighter mb-1">Notes</p>
                                    <p className="text-gray-600 font-medium line-clamp-2">{session.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-[#e5dcdc] hover:border-primary/20 transition-all overflow-hidden group">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#f4f0f0] flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#181111]">{session.title}</h4>
                        <p className="text-[10px] text-[#886364] mt-0.5">{session.scheduledDate} • {session.scheduledTime}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {session.meetingLink && (
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="size-8 rounded-lg bg-[#ea2a33] text-white flex items-center justify-center hover:bg-[#c91d2b] transition-all shadow-sm shadow-red-500/20">
                            <VideoIcon size={16} />
                        </a>
                    )}
                    <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-[#d1c1c2] hover:text-primary transition-all" onClick={() => onAction('editSession', session)}>
                        <Edit size={16} />
                    </button>
                    <button
                        className={`size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-all ${isExpanded ? 'text-primary bg-primary/5' : 'text-[#d1c1c2]'}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        title="View Details"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-fade-in">
                    <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</p>
                            <p className="text-xs text-gray-600 mt-1">{session.notes || session.description || 'No description provided'}</p>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</p>
                                <p className="text-xs text-gray-600 mt-0.5">{session.duration} minutes</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                                <p className="text-xs text-gray-600 mt-0.5 capitalize">{session.paymentType === 'free' ? 'Free Session' : `Paid (Rs. ${session.price})`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardView;
