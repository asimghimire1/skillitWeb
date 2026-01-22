import React, { useState, useEffect } from 'react';

export default function CreateSessionModal({ isOpen, onClose, onCreate, sessionToEdit = null }) {
    const [formData, setFormData] = useState({
        title: '',
        meetingLink: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        price: 0,
        paymentType: 'free',
        sessionType: 'online',
        linkType: 'google_meet',
        description: ''
    });

    useEffect(() => {
        if (sessionToEdit) {
            setFormData(sessionToEdit);
        } else {
            setFormData({
                title: '',
                meetingLink: '',
                scheduledDate: '',
                scheduledTime: '',
                duration: 60,
                price: 0,
                paymentType: 'free',
                sessionType: 'online',
                linkType: 'google_meet',
                description: ''
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
        onCreate(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div
                className="bg-white w-full max-w-2xl rounded-3xl border border-[#e5dcdd] shadow-2xl animate-fade-in flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#171112] tracking-tight">
                            {sessionToEdit ? 'Edit Session' : 'New Session'}
                        </h2>
                        <p className="text-sm text-[#876467] font-medium mt-1">Fill in the details for your session</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#876467]"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* General Section */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">edit_note</span>
                            General Information
                        </h3>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#171112]">Session Title</label>
                            <input
                                className="w-full bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium transition-all text-[#171112] placeholder:text-gray-400"
                                placeholder="e.g. Master React Architecture"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#171112]">Date</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">calendar_month</span>
                                    <input
                                        className="w-full pl-12 bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium text-[#171112] cursor-pointer"
                                        type="date"
                                        name="scheduledDate"
                                        value={formData.scheduledDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#171112]">Start Time</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">schedule</span>
                                    <input
                                        className="w-full pl-12 bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium text-[#171112] cursor-pointer"
                                        type="time"
                                        name="scheduledTime"
                                        value={formData.scheduledTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-[#171112]">Duration</label>
                            <div className="grid grid-cols-4 gap-3">
                                {[30, 60, 90, 120].map(mins => (
                                    <button
                                        key={mins}
                                        type="button"
                                        onClick={() => handleDurationChange(mins)}
                                        className={`py-3 rounded-2xl text-xs font-black transition-all border-2 ${formData.duration === mins
                                                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                                : 'border-transparent bg-[#f8f6f6] text-[#876467] hover:bg-gray-200'
                                            }`}
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
                                <label className="text-sm font-bold text-[#171112]">Platform</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium appearance-none text-[#171112] outline-none cursor-pointer"
                                        name="linkType"
                                        value={formData.linkType}
                                        onChange={handleChange}
                                    >
                                        <option value="google_meet">Google Meet</option>
                                        <option value="zoom">Zoom</option>
                                        <option value="teams">Teams</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-[#171112]">Meeting URL</label>
                                <input
                                    className="w-full bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium text-[#171112] placeholder:text-gray-400"
                                    placeholder="https://meet.google.com/..."
                                    type="url"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    required
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
                                onClick={() => setFormData(prev => ({ ...prev, paymentType: 'free', price: 0 }))}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${formData.paymentType === 'free'
                                        ? 'bg-[#171112] text-white shadow-xl'
                                        : 'bg-[#f8f6f6] text-[#876467] hover:bg-gray-200'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                                Free
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, paymentType: 'bid' }))}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${formData.paymentType === 'bid'
                                        ? 'bg-[#171112] text-white shadow-xl'
                                        : 'bg-[#f8f6f6] text-[#876467] hover:bg-gray-200'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">gavel</span>
                                Bidding
                            </button>
                        </div>

                        {formData.paymentType === 'bid' && (
                            <div className="space-y-2 animate-fade-in">
                                <label className="text-sm font-bold text-[#171112]">Starting Price (NPR)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">Rs.</span>
                                    <input
                                        className="w-full pl-12 bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-black text-[#171112]"
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
                </form>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 bg-[#fcfafa] rounded-b-3xl">
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
                            onClick={handleSubmit}
                            className="btn-premium btn-primary flex-1 py-4"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            {sessionToEdit ? 'Update Session' : 'Launch Session'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

