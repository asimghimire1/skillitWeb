import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={onCancel}>
            <div
                className="bg-white w-full max-w-md rounded-3xl border border-[#e5dcdd] shadow-2xl animate-fade-in flex flex-col p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`mx-auto size-16 rounded-full flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                    <span className="material-symbols-outlined text-3xl">
                        {type === 'danger' ? 'warning' : 'help'}
                    </span>
                </div>

                <h2 className="text-2xl font-black text-[#171112] mb-3">{title}</h2>
                <p className="text-[#876467] font-medium mb-8">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 px-6 rounded-2xl bg-[#f8f6f6] text-[#876467] font-black text-sm hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-4 px-6 rounded-2xl text-white font-black text-sm transition-all shadow-lg ${type === 'danger'
                                ? 'bg-[#ea2a33] hover:bg-[#d6252d] shadow-red-500/20'
                                : 'bg-primary hover:opacity-90 shadow-primary/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
