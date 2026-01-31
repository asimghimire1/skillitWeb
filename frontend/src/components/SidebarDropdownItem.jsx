import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * SidebarDropdownItem - Collapsible sidebar navigation item with sub-items
 */
const SidebarDropdownItem = ({
    icon: Icon,
    label,
    badge,
    isExpanded,
    onToggle,
    children,
    className = ''
}) => {
    return (
        <div className={`sidebar-dropdown-wrapper ${className}`}>
            {/* Parent Item */}
            <button
                className="sidebar-nav-item dropdown-parent"
                onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                }}
            >
                {Icon && <Icon size={20} />}
                <span className="sidebar-nav-label">{label}</span>
                {badge > 0 && (
                    <span className="sidebar-badge">{badge}</span>
                )}
                <span className="dropdown-chevron">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
            </button>

            {/* Sub Items */}
            <div className={`sidebar-sub-items ${isExpanded ? 'expanded' : ''}`}>
                {children}
            </div>
        </div>
    );
};

/**
 * SidebarSubItem - Individual sub-item within dropdown
 */
export const SidebarSubItem = ({
    icon: Icon,
    label,
    badge,
    isActive,
    onClick
}) => {
    return (
        <button
            className={`sidebar-sub-item ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {Icon && <Icon size={18} />}
            <span className="sidebar-sub-label">{label}</span>
            {badge > 0 && (
                <span className="sidebar-badge sub">{badge}</span>
            )}
        </button>
    );
};

export default SidebarDropdownItem;
