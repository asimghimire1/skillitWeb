import React, { useState } from 'react';
import ContentCard from './ContentCard';

const ContentView = ({ uploads, onUpload, onAction, teacher }) => {
    // Sort by newest first
    const libraryContent = uploads
        .filter(u => u.category !== 'Announcements')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div>
            <div className="page-header">
                <div className="page-header-content">
                    <h2>My Content</h2>
                    <p>Manage your video lessons and materials.</p>
                </div>
                <button className="btn-premium btn-primary" onClick={onUpload} style={{ width: 'auto' }}>
                    <span className="material-symbols-outlined">add</span> Upload New
                </button>
            </div>
            <div className="content-grid">
                {libraryContent.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>cloud_upload</span>
                            </div>
                            <p className="empty-state-text">No content library found.</p>
                        </div>
                    </div>
                ) : (
                    libraryContent.map((upload, idx) => (
                        <ContentCard
                            key={idx}
                            upload={upload}
                            teacher={teacher}
                            onAction={onAction}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ContentView;
