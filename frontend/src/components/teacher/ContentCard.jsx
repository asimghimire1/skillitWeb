import React from 'react';

const ContentCard = ({ upload, teacher, onAction }) => {
    return (
        <div className="content-card">
            <div className="content-card-media">
                {upload.videoUrl || (upload.fileUrl && (upload.fileUrl.endsWith('.mp4') || upload.fileUrl.endsWith('.mov'))) ? (
                    <video
                        src={(upload.videoUrl || upload.fileUrl).startsWith('http') ? (upload.videoUrl || upload.fileUrl) : `http://localhost:5000${(upload.videoUrl || upload.fileUrl)}`}
                        poster={upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : null}
                        controls
                        playsInline
                        className="content-video"
                    />
                ) : (
                    <>
                        <div
                            className="content-thumbnail"
                            style={{ backgroundImage: `url('${upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : 'https://via.placeholder.com/300?text=No+Thumbnail'}')` }}
                        />
                        <div className="content-media-overlay">
                            <span className="material-symbols-outlined content-media-icon">image</span>
                        </div>
                    </>
                )}

                {/* Status Badge */}
                <div className={`content-status-badge ${upload.status === 'published' ? 'published' : 'draft'}`}>
                    {upload.status || 'Published'}
                </div>

                {/* Duration Badge */}
                {upload.duration && (
                    <div className="content-duration-badge">
                        {upload.duration}
                    </div>
                )}
            </div>

            <div className="content-card-body">
                {/* Header: Category/New & Rating */}
                <div className="content-card-header">
                    <div className="content-category-badge">
                        {upload.category || 'New Content'}
                    </div>
                    <div className="content-rating">
                        <span className="material-symbols-outlined filled">star</span>
                        <span>4.9</span>
                    </div>
                </div>

                {/* Title & Description */}
                <div>
                    <h4 className="content-title">{upload.title}</h4>
                    <p className="content-description">
                        {upload.description || 'No description provided.'}
                    </p>
                </div>

                {/* Divider */}
                <div className="content-card-divider"></div>

                {/* Footer: Teacher Info & Actions */}
                <div className="content-card-footer">
                    <div className="content-author">
                        <div
                            className="content-author-avatar"
                            style={{ backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || teacher?.fullName || "Teacher") + "&background=ea2a33&color=fff"}')` }}
                        ></div>
                        <span className="content-author-name">
                            {teacher?.fullname || teacher?.fullName || 'Teacher'}
                        </span>
                    </div>

                    {onAction && (
                        <button
                            className="content-delete-btn"
                            onClick={(e) => { e.stopPropagation(); onAction('deleteContent', upload.id); }}
                            title="Delete content"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>delete</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentCard;
