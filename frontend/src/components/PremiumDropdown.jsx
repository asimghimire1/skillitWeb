import React, { useState, useRef, useEffect } from 'react';

const PremiumDropdown = ({ options, value, onChange, placeholder, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className={`premium-dropdown-wrapper ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className={`premium-dropdown-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="trigger-content">
                    {selectedOption?.icon && (
                        <span className="material-symbols-outlined trigger-icon">
                            {selectedOption.icon}
                        </span>
                    )}
                    <span className="trigger-label">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <span className={`material-symbols-outlined trigger-arrow ${isOpen ? 'open' : ''}`}>
                    expand_more
                </span>
            </button>

            {isOpen && (
                <div className="premium-dropdown-menu">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`premium-dropdown-item ${value === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            <div className="item-content">
                                {option.icon && (
                                    <span className="material-symbols-outlined item-icon">
                                        {option.icon}
                                    </span>
                                )}
                                <span className="item-label">{option.label}</span>
                            </div>
                            {value === option.value && (
                                <span className="material-symbols-outlined check-icon">
                                    check
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PremiumDropdown;
