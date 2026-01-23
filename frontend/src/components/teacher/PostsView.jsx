import React from 'react';

export default function PostsView({ posts, teacher, onCreate, onEdit, onDelete }) {

    const canEdit = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffMinutes = (now - created) / 1000 / 60;
        return diffMinutes <= 30;
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="page-header">
                <div className="page-header-content">
                    <h2>Posts & Announcements</h2>
                    <p>Manage your updates and announcements.</p>
                </div>
                <button
                    onClick={onCreate}
                    className="btn-premium btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add</span>
                    New Post
                </button>
            </div>

            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post.id} className="post-card-view">
                        <div className="post-card-view-header">
                            <div className="post-author-info">
                                <div
                                    className="post-avatar-lg"
                                    style={{
                                        backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || "Teacher") + "&background=ea2a33&color=fff"}')`
                                    }}
                                />
                                <div className="post-author-details">
                                    <h3>{post.title}</h3>
                                    <p>
                                        {new Date(post.created_at).toLocaleDateString()} • {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="post-card-view-content">
                            {post.content}
                        </p>

                        <div className="post-card-view-footer">
                            <div className="post-action-btns">
                                {canEdit(post.created_at) ? (
                                    <button
                                        onClick={() => onEdit(post)}
                                        className="post-action-btn edit"
                                        title="Edit (Available for 30m)"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit</span>
                                    </button>
                                ) : (
                                    <span className="post-action-btn disabled" title="Edit unavailable (>30m)">
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit_off</span>
                                    </span>
                                )}
                                <button
                                    onClick={() => onDelete(post.id)}
                                    className="post-action-btn delete"
                                    title="Delete"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="posts-empty-state">
                        <span className="material-symbols-outlined">post_add</span>
                        <p>No posts yet</p>
                        <p className="empty-subtitle">Share updates and announcements with your students.</p>
                        <button onClick={onCreate} className="btn-premium btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>
                            Create First Post
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
