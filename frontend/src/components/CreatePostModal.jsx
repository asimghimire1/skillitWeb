import React, { useState } from 'react';
import '../css/upload-modal.css'; // Reusing existing modal CSS

export default function CreatePostModal({ isOpen, onClose, onCreate }) {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({
            title: 'New Post', // Default title for now or add input
            description: content,
            type: 'post',
            category: 'Announcements'
        });
        onClose();
        setContent('');
    };

    if (!isOpen) return null;

    return (
        <div className="upload-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="upload-modal" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h1 className="modal-title">Create New Post</h1>
                    <button className="modal-close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="modal-content" style={{ display: 'block', padding: '2rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">What's on your mind?</label>
                            <textarea
                                className="form-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share updates with your students..."
                                rows="6"
                                autoFocus
                                required
                            ></textarea>
                        </div>

                        <div className="modal-footer" style={{ marginTop: '2rem', padding: 0 }}>
                            <button type="button" className="discard-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="continue-btn" style={{ width: 'auto', padding: '0 2rem' }}>
                                Post Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
