import React, { useState, useEffect } from 'react';
import PremiumDropdown from './PremiumDropdown';
import PremiumDatePicker from './PremiumDatePicker';
import PremiumTimePicker from './PremiumTimePicker';
import '../css/teacher.css';

export default function CreateSessionModal({ isOpen, onClose, onCreate, sessionToEdit = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        meetingLink: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        price: 0,
        paymentType: 'free',
        allowBidding: false,
        maxParticipants: '',
        linkType: 'google_meet'
    });

    useEffect(() => {
        if (sessionToEdit) {
            setFormData({
                ...sessionToEdit,
                paymentType: sessionToEdit.allowBidding ? 'bid' : (sessionToEdit.price > 0 ? 'paid' : 'free')
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: '',
                meetingLink: '',
                scheduledDate: '',
                scheduledTime: '',
                duration: 60,
                price: 0,
                paymentType: 'free',
                allowBidding: false,
                maxParticipants: '',
                linkType: 'google_meet'
            });
        }
    }, [sessionToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDurationChange = (value) => {
        setFormData(prev => ({ ...prev, duration: parseInt(value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('[CreateSessionModal] Form submitted');
        console.log('[CreateSessionModal] formData:', formData);
        
        const sessionData = {
            ...formData,
            allowBidding: formData.paymentType === 'paid', // Paid sessions allow bidding
            price: formData.paymentType === 'free' ? 0 : parseFloat(formData.price) || 0,
            maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
        };
        
        console.log('[CreateSessionModal] Calling onCreate with:', sessionData);
        onCreate(sessionData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div
                className="bg-white w-full max-w-2xl rounded-3xl border border-[#e5dcdd] shadow-2xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Fixed */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h2 className="modal-title">
                            {sessionToEdit ? 'Edit Session' : 'New Session'}
                        </h2>
                        <p className="modal-subtitle">Fill in the details for your session</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="modal-close-btn"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* General Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">edit_note</span>
                                General Information
                            </h3>

                            <div className="space-y-2">
                                <label className="modal-label">Session Title</label>
                                <input
                                    className="modal-input"
                                    placeholder="e.g. Master React Architecture"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="modal-label">Description</label>
                                <textarea
                                    className="modal-input"
                                    placeholder="Describe what students will learn..."
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    style={{ resize: 'none' }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="modal-label">Category</label>
                                    <div className="premium-select-container">
                                        <PremiumDropdown
                                            options={[
                                                { value: 'programming', label: 'Programming', icon: 'code' },
                                                { value: 'design', label: 'Design', icon: 'palette' },
                                                { value: 'business', label: 'Business', icon: 'business' },
                                                { value: 'marketing', label: 'Marketing', icon: 'campaign' },
                                                { value: 'music', label: 'Music', icon: 'music_note' },
                                                { value: 'language', label: 'Language', icon: 'translate' },
                                                { value: 'other', label: 'Other', icon: 'more_horiz' },
                                            ]}
                                            value={formData.category}
                                            onChange={(val) => handleChange({ target: { name: 'category', value: val } })}
                                            placeholder="Select category"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="modal-label">Max Participants</label>
                                    <input
                                        className="modal-input"
                                        placeholder="Leave empty for unlimited"
                                        type="number"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="modal-label">Date</label>
                                    <PremiumDatePicker
                                        value={formData.scheduledDate}
                                        onChange={(val) => handleChange({ target: { name: 'scheduledDate', value: val } })}
                                        placeholder="Select a day"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="modal-label">Start Time</label>
                                    <PremiumTimePicker
                                        value={formData.scheduledTime}
                                        onChange={(val) => handleChange({ target: { name: 'scheduledTime', value: val } })}
                                        placeholder="Start Time"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="modal-label">Duration</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {[30, 60, 90, 120].map(mins => (
                                        <button
                                            key={mins}
                                            type="button"
                                            onClick={() => handleDurationChange(mins)}
                                            className={`session-modal-duration-btn ${formData.duration === mins ? 'active' : 'inactive'}`}
                                        >
                                            {mins}m
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Meeting Section */}
                        <div className="space-y-6 pt-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">link</span>
                                Meeting Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="modal-label">Platform</label>
                                    <div className="premium-select-container">
                                        <PremiumDropdown
                                            options={[
                                                { value: 'google_meet', label: 'Meet', icon: 'video_call' },
                                                { value: 'zoom', label: 'Zoom', icon: 'videocam' },
                                                { value: 'microsoft_teams', label: 'Teams', icon: 'groups' },
                                                { value: 'custom', label: 'Custom', icon: 'link' },
                                            ]}
                                            value={formData.linkType}
                                            onChange={(val) => handleChange({ target: { name: 'linkType', value: val } })}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="modal-label">Meeting URL <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <input
                                        className="modal-input"
                                        placeholder="https://meet.google.com/..."
                                        type="url"
                                        name="meetingLink"
                                        value={formData.meetingLink}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-6 pt-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                Pricing Model
                            </h3>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, paymentType: 'free', price: 0, allowBidding: false }))}
                                    className={`upload-pricing-btn ${formData.paymentType === 'free' ? 'active' : 'inactive'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                                    Free
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, paymentType: 'paid', allowBidding: true }))}
                                    className={`upload-pricing-btn ${formData.paymentType === 'paid' ? 'active' : 'inactive'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">attach_money</span>
                                    Paid
                                </button>
                            </div>

                            {formData.paymentType === 'paid' && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="modal-label">Price (NPR) - Students can also bid</label>
                                    <div className="upload-price-input-wrapper">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">Rs.</span>
                                        <input
                                            className="upload-price-input"
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions - Fixed at bottom of form */}
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
                                <span className="material-symbols-outlined">add_circle</span>
                                {sessionToEdit ? 'Update Session' : 'Launch Session'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

