import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Gavel,
  CheckCircle,
  XCircle,
  MessageSquare,
  X
} from 'lucide-react';
import apiService from '../services/apiService';

const NotificationDropdown = ({ userId, onNotificationCountChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    if (!userId) return;
    
    const [notifs, count] = await Promise.all([
      apiService.getNotifications(userId),
      apiService.getUnreadNotificationCount(userId)
    ]);
    
    setNotifications(notifs || []);
    setUnreadCount(count || 0);
    onNotificationCountChange?.(count || 0);
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    await apiService.markNotificationRead(notificationId);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await apiService.markAllNotificationsRead(userId);
    fetchNotifications();
  };

  const handleDelete = async (notificationId) => {
    await apiService.deleteNotification(notificationId);
    fetchNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'bid_received':
        return <Gavel size={16} className="notif-icon bid" />;
      case 'bid_accepted':
      case 'counter_accepted':
        return <CheckCircle size={16} className="notif-icon success" />;
      case 'bid_rejected':
      case 'counter_rejected':
        return <XCircle size={16} className="notif-icon error" />;
      case 'counter_offer':
        return <MessageSquare size={16} className="notif-icon counter" />;
      default:
        return <Bell size={16} className="notif-icon" />;
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-dropdown-wrapper" ref={dropdownRef}>
      <button 
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllRead}
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={32} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                >
                  <div className="notification-icon-wrapper">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">{notif.title}</p>
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{formatTime(notif.created_at)}</span>
                  </div>
                  <div className="notification-actions">
                    {!notif.isRead && (
                      <button 
                        className="notif-action-btn"
                        onClick={() => handleMarkAsRead(notif.id)}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button 
                      className="notif-action-btn delete"
                      onClick={() => handleDelete(notif.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
