import React from 'react';
import '../css/teacher.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={onCancel}>
            <div
                className="bg-white w-full max-w-md rounded-3xl border border-[#e5dcdd] shadow-2xl animate-fade-in flex flex-col p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`confirm-modal-icon ${type === 'danger' ? 'danger' : 'info'}`}>
                    <span className="material-symbols-outlined text-3xl">
                        {type === 'danger' ? 'warning' : 'help'}
                    </span>
                </div>

                <h2 className="confirm-modal-title">{title}</h2>
                <p className="confirm-modal-message">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="confirm-modal-cancel-btn"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`confirm-modal-confirm-btn ${type === 'danger' ? 'danger' : 'info'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
