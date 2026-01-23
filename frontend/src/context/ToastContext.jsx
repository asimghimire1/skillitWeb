import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', options = {}) => {
        const id = Math.random().toString(36).substr(2, 9);
        const { isTiny = false } = options;
        setToasts(prev => [...prev, { id, message, type, isTiny }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, isTiny ? 2000 : 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const normalToasts = toasts.filter(t => !t.isTiny);
    const tinyToasts = toasts.filter(t => t.isTiny);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Normal Toasts (Bottom Left) */}
            <div className="fixed bottom-8 left-8 md:left-[280px] z-[999] flex flex-col gap-3 items-start">
                {normalToasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-slide-in
                            ${toast.type === 'success' ? 'bg-white border-green-100 text-green-800' :
                                toast.type === 'error' ? 'bg-white border-red-100 text-red-800' :
                                    'bg-white border-blue-100 text-blue-800'}
                        `}
                    >
                        <span className="material-symbols-outlined">
                            {toast.type === 'success' ? 'check_circle' :
                                toast.type === 'error' ? 'error' : 'info'}
                        </span>
                        <p className="text-sm font-black tracking-tight">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Tiny Toasts (Top Right) */}
            <div className="fixed top-8 right-8 z-[1000] flex flex-col gap-2 items-end">
                {tinyToasts.map(toast => (
                    <div
                        key={toast.id}
                        className="tiny-toast-premium"
                    >
                        <span className="material-symbols-outlined text-xs">bolt</span>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
