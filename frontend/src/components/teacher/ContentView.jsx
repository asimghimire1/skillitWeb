import React, { useState } from 'react';

const ContentView = ({ uploads, onUpload, onAction }) => {
    const libraryContent = uploads.filter(u => u.category !== 'Announcements');

    return (
        <div>
            <div className="uploads-section-header" style={{ justifyContent: 'flex-end', marginBottom: '2rem' }}>
                <button className="btn-premium btn-primary" onClick={onUpload} style={{ width: 'auto' }}>
                    <span className="material-symbols-outlined">add</span> Upload New
                </button>
            </div>
            <div className="uploads-grid">
                {libraryContent.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <span className="material-symbols-outlined empty-state-icon">cloud_upload</span>
                        <p className="empty-state-text">No content library found.</p>
                    </div>
                ) : (
                    libraryContent.map((upload, idx) => (
                        <div key={idx} className="upload-card">
                            <div className="upload-thumbnail" style={{ background: '#000' }}>
                                {upload.videoUrl ? (
                                    <video
                                        src={upload.videoUrl.startsWith('http') ? upload.videoUrl : `http://localhost:5000${upload.videoUrl}`}
                                        className="thumbnail-overlay"
                                        controls
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative' }}
                                    />
                                ) : (
                                    <div className="thumbnail-overlay" style={{ backgroundImage: `url('${upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : 'https://via.placeholder.com/300'}')` }} />
                                )}
                                <div className={`upload-badge badge-${upload.status || 'published'}`}>{upload.status || 'Published'}</div>
                            </div>
                            <div className="upload-info">
                                <div className="flex-row-center justify-between items-start">
                                    <h4 className="upload-title">{upload.title}</h4>
                                    <button className="icon-btn-small delete-btn" onClick={(e) => { e.stopPropagation(); onAction('deleteContent', upload.id); }}>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                                <p className="upload-desc-clamped">{upload.description}</p>
                                <div className="upload-meta">
                                    <span>{upload.views || 0} views</span>
                                    <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ContentView;
