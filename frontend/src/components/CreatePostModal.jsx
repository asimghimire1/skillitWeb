import React, { useState } from 'react';
import '../css/upload-modal.css';
import '../css/teacher.css';

export default function CreatePostModal({ isOpen, onClose, onCreate, postToEdit = null }) {
    const [content, setContent] = useState('');

    React.useEffect(() => {
        if (postToEdit) {
            setContent(postToEdit.description);
        } else {
            setContent('');
        }
    }, [postToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (postToEdit) {
            onCreate({
                id: postToEdit.id,
                title: 'Edited Post',
                description: content,
                type: 'post',
                category: 'Announcements'
            });
        } else {
            onCreate({
                title: 'New Post',
                description: content,
                type: 'post',
                category: 'Announcements'
            });
        }
        onClose();
        setContent('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div
                className="bg-white w-full max-w-lg rounded-3xl border border-[#e5dcdd] shadow-2xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="modal-title">
                            {postToEdit ? 'Edit Post' : 'New Post'}
                        </h2>
                        <p className="modal-subtitle">Share something with your students</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="modal-close-btn"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="modal-label">What's on your mind?</label>
                            <textarea
                                className="modal-textarea"
                                style={{ minHeight: '200px' }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share updates, tips, or announcements..."
                                autoFocus
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-premium btn-secondary sm:w-1/3 py-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-premium btn-primary flex-1 py-4"
                            >
                                <span className="material-symbols-outlined">send</span>
                                {postToEdit ? 'Save Changes' : 'Post Update'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
