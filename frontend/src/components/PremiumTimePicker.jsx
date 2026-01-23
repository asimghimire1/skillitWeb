import React, { useState, useRef, useEffect } from 'react';

const PremiumTimePicker = ({ value, onChange, placeholder = "Select a time", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Parse value (assumes 24h format HH:mm or 12h format HH:mm AM/PM)
    const parseTime = (timeStr) => {
        if (!timeStr) return { hour: '09', minute: '00', period: 'AM' };

        // Handle 24h format (e.g., "14:30")
        if (timeStr.includes(':') && !timeStr.includes(' ')) {
            let [h, m] = timeStr.split(':');
            let period = 'AM';
            h = parseInt(h);
            if (h >= 12) {
                period = 'PM';
                if (h > 12) h -= 12;
            }
            if (h === 0) h = 12;
            return { hour: String(h).padStart(2, '0'), minute: m, period };
        }

        return { hour: '09', minute: '00', period: 'AM' };
    };

    const { hour, minute, period } = parseTime(value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const times = [];
    for (let h = 1; h <= 12; h++) {
        const hh = String(h).padStart(2, '0');
        times.push(`${hh}:00`);
        times.push(`${hh}:30`);
    }

    const handleTimeSelect = (t, p) => {
        // Convert to 24h for standard storage
        let [h, m] = t.split(':');
        h = parseInt(h);
        if (p === 'PM' && h < 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;

        const h24 = String(h).padStart(2, '0');
        onChange(`${h24}:${m}`);
        setIsOpen(false);
    };

    const handlePeriodChange = (newPeriod) => {
        let [h, m] = hour && minute ? [`${hour}`, `${minute}`] : ['09', '00'];
        let h_int = parseInt(h);

        if (newPeriod === 'PM' && h_int < 12) h_int += 12;
        if (newPeriod === 'AM' && h_int >= 12) h_int -= 12;

        const h24 = String(h_int).padStart(2, '0');
        onChange(`${h24}:${m}`);
    };

    return (
        <div className={`premium-timepicker-wrapper ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className={`premium-timepicker-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="timepicker-trigger-left">
                    <span className="material-symbols-outlined trigger-time-icon">schedule</span>
                    <div className="trigger-text">
                        <span className="trigger-placeholder">{placeholder}</span>
                        <span className="trigger-value">{hour}:{minute} {period}</span>
                    </div>
                </div>
                <span className={`material-symbols-outlined trigger-arrow ${isOpen ? 'open' : ''}`}>
                    {isOpen ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {isOpen && (
                <div className="premium-timepicker-menu">
                    <div className="timepicker-period-toggle">
                        <button
                            type="button"
                            className={`period-btn ${period === 'AM' ? 'selected' : ''}`}
                            onClick={() => handlePeriodChange('AM')}
                        >AM</button>
                        <button
                            type="button"
                            className={`period-btn ${period === 'PM' ? 'selected' : ''}`}
                            onClick={() => handlePeriodChange('PM')}
                        >PM</button>
                    </div>
                    <div className="time-slots-list">
                        {times.map(t => {
                            const isSelected = `${hour}:${minute}` === t;
                            return (
                                <div
                                    key={t}
                                    className={`time-slot-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleTimeSelect(t, period)}
                                >
                                    {t}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumTimePicker;
