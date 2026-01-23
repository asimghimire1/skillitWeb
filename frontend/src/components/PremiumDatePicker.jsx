import React, { useState, useRef, useEffect } from 'react';

const PremiumDatePicker = ({ value, onChange, placeholder = "Select a day", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
    const dropdownRef = useRef(null);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "DD.MM.YYYY";
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Format as YYYY-MM-DD for standard input compatibility
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectedDate.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${d}`);
    };

    const handleRemove = () => {
        onChange("");
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
        const startDay = firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());

        // Adjust startDay for Monday-start (M T W T F S S)
        // firstDayOfMonth returns 0 for Sunday. 
        // We want: 0=M, 1=T, 2=W, 3=T, 4=F, 5=S, 6=S
        // So: (startDay + 6) % 7
        const adjustedStartDay = (startDay + 6) % 7;

        for (let i = 0; i < adjustedStartDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let i = 1; i <= totalDays; i++) {
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();
            const isSelected = value && new Date(value).toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();

            days.push(
                <div
                    key={i}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateSelect(i)}
                >
                    {i}
                </div>
            );
        }
        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className={`premium-datepicker-wrapper ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className={`premium-datepicker-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="datepicker-trigger-left">
                    <span className="material-symbols-outlined trigger-calendar-icon">calendar_today</span>
                    <div className="trigger-text">
                        <span className="trigger-placeholder">{placeholder}</span>
                        <span className="trigger-value">{value ? formatDate(value) : "DD.MM.YYYY"}</span>
                    </div>
                </div>
                <span className={`material-symbols-outlined trigger-arrow ${isOpen ? 'open' : ''}`}>
                    {isOpen ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {isOpen && (
                <div className="premium-datepicker-menu">
                    <div className="datepicker-header">
                        <h3 className="current-month-year">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <div className="month-nav">
                            <button type="button" onClick={handlePrevMonth} className="nav-btn">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button type="button" onClick={handleNextMonth} className="nav-btn">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div className="datepicker-weekdays">
                        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>

                    <div className="datepicker-days">
                        {renderCalendar()}
                    </div>

                    <div className="datepicker-footer">
                        <button type="button" className="footer-btn remove-btn" onClick={handleRemove}>
                            Remove
                        </button>
                        <button type="button" className="footer-btn done-btn" onClick={() => setIsOpen(false)}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumDatePicker;
