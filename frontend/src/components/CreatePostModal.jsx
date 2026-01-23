import React, { useState } from 'react';
import '../css/upload-modal.css'; // Reusing existing modal CSS

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
                        <h2 className="text-2xl font-black text-[#171112] tracking-tight">
                            {postToEdit ? 'Edit Post' : 'New Post'}
                        </h2>
                        <p className="text-sm text-[#876467] font-medium mt-1">Share something with your students</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#876467]"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#171112]">What's on your mind?</label>
                            <textarea
                                className="w-full bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium transition-all text-[#171112] placeholder:text-gray-400 min-h-[200px]"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share updates, tips, or announcements..."
                                autoFocus
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-gray-100 bg-[#fcfafa] shrink-0">
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
