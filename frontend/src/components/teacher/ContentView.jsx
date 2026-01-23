import React, { useState } from 'react';
import ContentCard from './ContentCard';

const ContentView = ({ uploads, onUpload, onAction, teacher }) => {
    // Sort by newest first
    const libraryContent = uploads
        .filter(u => u.category !== 'Announcements')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {libraryContent.length === 0 ? (
                    <div className="col-span-full">
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-state-icon">cloud_upload</span>
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
