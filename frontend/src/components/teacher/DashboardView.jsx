import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import SessionListItem from './SessionListItem';

const DashboardView = ({ stats, uploads, sessions, posts, quickActions, onAction, teacher }) => {
    const { showToast } = useToast();
    // Use the passed posts, sorted by newest first
    const recentPosts = [...(posts || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const recentUploads = uploads.filter(u => u.category !== 'Announcements').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const statCards = [
        { icon: 'group', label: 'Total Students', value: 0 },
        { icon: 'video_chat', label: 'Active Sessions', value: stats.activeSessions || 0 },
        { icon: 'payments', label: 'Monthly Earnings', value: `NPR ${(stats.monthlyEarnings || 0).toLocaleString()}` },
    ];

    // TODO: Replace with real API data
    const bidRequests = [
        {
            id: 1,
            studentName: "Sarah Jenkins",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2_2-mmxZ5RJzYFpUSYic3PdgDyioSTTw8eZDlq1E9MKIrUMeUzctHrLxMGuHI0V1umr1mj3XF9BZDxWK6gn2zRQYWUGf15pveqFFK2N-OvHTDzSpa91qzhZ7S4m3OPc67S6s45rAGSMJV4Ym91Mt8TkWEwDcotG9pmP_H0WSrAb6zbWDHKqA-2D7FxpgXOTNs57wO0SJUoZU_YKOtm02pUdpqFawXmApGH3UY8UzfxqxgiRQZgoXDdWZVTi-ynTa4Pn0vl2MZlMA",
            timeAgo: "2 hours ago",
            skill: "Advanced React Hooks",
            basePrice: 80.00,
            bidAmount: 120.00,
            increase: 50
        },
        {
            id: 2,
            studentName: "Marcus Thorne",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAsOYkySvV-AeuLzkNyjyX0rvDipfKiQCK2UBqtPH4iWhMQRY3SE1iNVStnuWQ-c3BL-Fe-PMG5W6mpCfrjTA5_hCJcVSL7IcooQcxzQyKQIVDYFvDOxovMDzNsNG2iUDyUkhLPmUHkbWin2AFZfOWiGgHCcxkh0P8QMGAqHD8b8VIUaqpb0XH7eENFTJjH2kzSHYh2HWnsCGrkUVgqOxC6txt0NIobv9liCjuMoJ8ihuoPtwEjAGjxMZwe6TNVIQH7HrjJ8Oe8zA",
            timeAgo: "5 hours ago",
            skill: "Figma Prototyping",
            basePrice: 60.00,
            bidAmount: 75.00,
            increase: 25
        }
    ];

    return (
        <>
            <div className="stats-grid">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="stat-card hover-lift">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.icon === 'payments' ? '#ea2a33' : '#886364'}10` }}>
                            <span className="material-symbols-outlined" style={{ color: stat.icon === 'payments' ? '#ea2a33' : '#886364' }}>{stat.icon}</span>
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">{stat.label}</p>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-actions-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="actions-grid">
                    {quickActions.map((action, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-[24px] border border-[#e5dcdc] hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                            onClick={action.action}
                        >
                            <div className="size-12 rounded-2xl bg-[#f4f0f0] flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-gray-700 group-hover:text-primary transition-colors">{action.icon}</span>
                            </div>
                            <h3 className="font-bold text-[#181111] mb-1">{action.title}</h3>
                            <p className="text-xs text-[#886364] leading-relaxed mb-4">{action.desc}</p>
                            <div className="flex items-center text-xs font-bold text-primary gap-1 group-hover:gap-2 transition-all">
                                Go <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest Bid Requests Section */}
            <div style={{ marginBottom: '3rem' }}>
                <div className="uploads-section-header">
                    <h2 className="section-title">Latest Bid Requests</h2>
                    <button className="btn-premium btn-secondary text-xs" onClick={() => onAction('bids')}>
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <div className="bids-grid">
                    {bidRequests.map((bid) => (
                        <div key={bid.id} className="bid-card">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bid-student-avatar" style={{ backgroundImage: `url('${bid.avatar}')` }}></div>
                                    <div>
                                        <h4 className="font-bold text-base">{bid.studentName}</h4>
                                        <div className="flex items-center gap-1 text-xs text-[#886364]">
                                            <span className="material-symbols-outlined text-xs">history</span>
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
                                            <span className="material-symbols-outlined text-xs">trending_up</span> +{bid.increase}%
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
            </div>

            <div className="content-grid">
                <div className="main-content-column">
                    {/* Recent Posts Section */}
                    <div className="announcements-section" style={{ marginBottom: '2.5rem' }}>
                        <div className="uploads-section-header">
                            <h2 className="section-title">Recent Posts</h2>
                            {recentPosts.length > 0 && (
                                <button className="view-all-btn text-[#ea2a33] font-bold hover:text-[#c91d2b] transition-colors" onClick={() => onAction('posts')}>View All Posts</button>
                            )}
                        </div>
                        {recentPosts.length === 0 ? (
                            <div className="empty-state" style={{ padding: '2rem' }}>
                                <p className="empty-state-text">No posts yet</p>
                                <button className="view-all-btn hover:text-[#ea2a33] transition-colors" onClick={() => onAction('post')} style={{ marginTop: '0.5rem' }}>Create Post</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recentPosts.slice(0, 2).map((post, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-[20px] shadow-sm border border-[#e5dcdc] h-full flex flex-col relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                {/* Avatar */}
                                                <div
                                                    className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center shrink-0 border border-gray-100"
                                                    style={{
                                                        backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || teacher?.fullName || "Teacher") + "&background=ea2a33&color=fff"}')`
                                                    }}
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-[#181111] text-sm md:text-base">{teacher?.fullname || teacher?.fullName || 'Teacher'}</span>
                                                        <span className="bg-[#ffe5e7] text-[#ea2a33] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">Teacher</span>
                                                    </div>
                                                    <span className="text-[#886364] text-xs mt-0.5 block">{new Date(post.created_at).toLocaleDateString() === new Date().toLocaleDateString() ?
                                                        `Today, ${new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                                                        new Date(post.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* More Options Button */}
                                            {/* For dashboard view, maybe limited options or remove entirely if complex */}
                                        </div>
                                        <p className="text-[#564e4e] text-sm leading-relaxed flex-grow line-clamp-3">
                                            {post.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Uploads Section */}
                    <div className="uploads-section">
                        <div className="uploads-section-header">
                            <h2 className="section-title">Recent Uploads</h2>
                            <button className="view-all-btn hover:text-[#ea2a33] transition-colors" onClick={() => onAction('content')}>View All</button>
                        </div>
                        {recentUploads.length === 0 ? (
                            <div className="empty-state">
                                <span className="material-symbols-outlined empty-state-icon">cloud_upload</span>
                                <p className="empty-state-text">No content uploaded yet</p>
                                <button className="view-all-btn hover:text-[#ea2a33] transition-colors" onClick={() => onAction('upload')} style={{ marginTop: '1rem' }}>Upload Content</button>
                            </div>
                        ) : (
                            <div className="uploads-grid">
                                {recentUploads.slice(0, 2).map((upload, idx) => (
                                    <div key={idx} className="upload-card group/card">
                                        <div className="upload-thumbnail aspect-video w-full bg-black relative">
                                            {(upload.videoUrl || (upload.fileUrl && (upload.fileUrl.endsWith('.mp4') || upload.fileUrl.endsWith('.mov')))) ? (
                                                <video
                                                    src={(upload.videoUrl || upload.fileUrl).startsWith('http') ? (upload.videoUrl || upload.fileUrl) : `http://localhost:5000${(upload.videoUrl || upload.fileUrl)}`}
                                                    poster={upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : null}
                                                    controls
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                                                    style={{
                                                        backgroundImage: `url('${upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : 'https://via.placeholder.com/300?text=No+Thumbnail'}')`
                                                    }}
                                                />
                                            )}

                                            <div className={`upload-badge badge-${upload.status || 'published'}`}>{upload.status || 'Published'}</div>
                                            <div className="upload-duration">{upload.duration || '0:00'}</div>
                                        </div>
                                        <div className="upload-info">
                                            <h4 className="upload-title">{upload.title}</h4>
                                            <div className="upload-meta">
                                                <span>{upload.views || 0} views</span>
                                                <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sessions-section">
                    <div className="uploads-section-header">
                        <h2 className="section-title">Upcoming Sessions</h2>
                        <button className="view-all-btn hover:text-[#ea2a33] transition-colors font-bold text-sm" onClick={() => onAction('sessions')}>View All</button>
                    </div>
                    {sessions.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-state-text">No upcoming sessions</p>
                            <button className="view-all-btn hover:text-[#ea2a33] transition-colors" onClick={() => onAction('session')} style={{ marginTop: '10px' }}>Create Session</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.slice(0, 3).map((session, idx) => (
                                <SessionItemWithDetails
                                    key={session.id || idx}
                                    session={session}
                                    onAction={onAction}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const SessionItemWithDetails = ({ session, onAction }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-[#e5dcdc] hover:border-primary/20 transition-all overflow-hidden group">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#f4f0f0] flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-xl">calendar_today</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#181111]">{session.title}</h4>
                        <p className="text-[10px] text-[#886364] mt-0.5">{session.scheduledDate} • {session.scheduledTime}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {session.meetingLink && (
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="size-8 rounded-lg bg-[#ea2a33] text-white flex items-center justify-center hover:bg-[#c91d2b] transition-all shadow-sm shadow-red-500/20">
                            <span className="material-symbols-outlined text-base">video_call</span>
                        </a>
                    )}
                    <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-[#d1c1c2] hover:text-primary transition-all" onClick={() => onAction('editSession', session)}>
                        <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                        className={`size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-all ${isExpanded ? 'text-primary bg-primary/5' : 'text-[#d1c1c2]'}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        title="View Details"
                    >
                        <span className="material-symbols-outlined text-base">{isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
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
