import React, { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const GlobalButtonFeedback = () => {
    const { showToast } = useToast();

    useEffect(() => {
        const handleGlobalClick = (e) => {
            const button = e.target.closest('button');
            if (button) {
                // Ignore if it's a "Done" or "Remove" button in our pickers (they have manual toasts)
                if (button.classList.contains('footer-btn') || button.classList.contains('remove-btn') || button.classList.contains('done-btn')) {
                    return;
                }

                // Ignore if button says "Cancel" or "Close"
                const text = button.innerText.trim().toLowerCase();
                if (text === 'close' || text === 'cancel') return;

                // Ignore buttons that explicitly opt-out or are part of the toast itself
                if (button.closest('.tiny-toast-premium') || button.dataset.noToast === 'true') {
                    return;
                }

                // Get button text, icon label, or aria-label
                const label = button.innerText.trim().split('\n')[0].slice(0, 20) || button.getAttribute('aria-label') || 'Action';
                showToast(label || 'Button Clicked', 'success', { isTiny: true });
            }
        };

        document.addEventListener('mousedown', handleGlobalClick);
        return () => document.removeEventListener('mousedown', handleGlobalClick);
    }, [showToast]);

    return null;
};

export default GlobalButtonFeedback;
