import React, { useState } from 'react';
import '../css/upload-modal.css'; // Reusing existing modal CSS

export default function CreateSessionModal({ isOpen, onClose, onCreate }) {
    const [formData, setFormData] = useState({
        title: '',
        meetingLink: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        price: 0,
        sessionType: 'online',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
        // Reset form
        setFormData({
            title: '',
            meetingLink: '',
            scheduledDate: '',
            scheduledTime: '',
            duration: 60,
            price: 0,
            sessionType: 'online',
            description: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="upload-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="upload-modal" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h1 className="modal-title">Create New Session</h1>
                    <button className="modal-close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="modal-content" style={{ display: 'block', padding: '2rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Session Title</label>
                            <input
                                type="text"
                                className="form-input"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. 1-on-1 Mentorship"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Meeting Link (Google Meet, etc.)</label>
                            <input
                                type="url"
                                className="form-input"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input professional-input"
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time</label>
                                <input
                                    type="time"
                                    className="form-input professional-input"
                                    name="scheduledTime"
                                    value={formData.scheduledTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Duration (mins)</label>
                                <select
                                    className="form-select"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                >
                                    <option value={30}>30 Minutes</option>
                                    <option value={60}>60 Minutes</option>
                                    <option value={90}>90 Minutes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price (NPR)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What will be covered in this session?"
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="modal-footer" style={{ marginTop: '2rem', padding: '1.5rem 0 0 0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e5dcdd' }}>
                            <button type="button" className="discard-btn" onClick={onClose} style={{ margin: 0 }}>
                                Cancel
                            </button>
                            <button type="submit" className="continue-btn" style={{ width: 'auto', padding: '0.625rem 2rem', margin: 0 }}>
                                Create Session
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
