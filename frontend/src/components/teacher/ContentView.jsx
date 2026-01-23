import React, { useState } from 'react';

const ContentView = ({ uploads, onUpload, onAction }) => {
    const libraryContent = uploads.filter(u => u.category !== 'Announcements');

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#ea2a33]">My Content</h2>
                    <p className="text-gray-500 mt-1">Manage your video lessons and materials.</p>
                </div>
                <button className="btn-premium btn-primary" onClick={onUpload} style={{ width: 'auto' }}>
                    <span className="material-symbols-outlined">add</span> Upload New
                </button>
            </div>
            <div className="uploads-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                {libraryContent.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <span className="material-symbols-outlined empty-state-icon">cloud_upload</span>
                        <p className="empty-state-text">No content library found.</p>
                    </div>
                ) : (
                    libraryContent.map((upload, idx) => (
                        <div key={idx} className="upload-card group/card">
                            <div className="upload-thumbnail aspect-video w-full bg-black relative">
                                {upload.videoUrl ? (
                                    <video
                                        src={upload.videoUrl.startsWith('http') ? upload.videoUrl : `http://localhost:5000${upload.videoUrl}`}
                                        poster={upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : null}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover/card:scale-105"
                                        style={{ backgroundImage: `url('${upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : 'https://via.placeholder.com/300'}')` }}
                                    />
                                )}
                                <div className={`upload-badge badge-${upload.status || 'published'}`}>{upload.status || 'Published'}</div>
                            </div>
                            <div className="upload-info">
                                <div className="flex-row-center justify-between items-start">
                                    <h4 className="upload-title" style={{ fontSize: '1.1rem' }}>{upload.title}</h4>
                                    <button className="icon-btn-small delete-btn" onClick={(e) => { e.stopPropagation(); onAction('deleteContent', upload.id); }}>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                                <p className="upload-desc-clamped" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{upload.description}</p>
                                <div className="upload-meta" style={{ fontSize: '0.85rem' }}>
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
