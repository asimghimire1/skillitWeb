import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Users,
  Tag,
  Grid,
  List,
  Sparkles,
  Gavel,
  Video,
  Play
} from 'lucide-react';
import PremiumDropdown from '../PremiumDropdown';

const ExploreSessionsView = ({
  sessions,
  teachers,
  enrollments,
  onEnroll,
  onMakeBid
}) => {
  // Safe array defaults
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [priceFilter, setPriceFilter] = useState('all');

  // Auto-generate teachers from sessions
  const teacherOptions = useMemo(() => {
    const teacherMap = new Map();
    safeSessions.forEach(s => {
      if (s.teacherId) {
        const teacher = safeTeachers.find(t => t.id === s.teacherId);
        const name = s.teacherName || teacher?.fullname || teacher?.fullName;
        if (name) teacherMap.set(s.teacherId, name);
      }
    });
    return [
      { value: 'all', label: 'All Teachers', icon: 'person' },
      ...Array.from(teacherMap.entries()).map(([id, name]) => ({ 
        value: id.toString(), 
        label: name, 
        icon: 'school' 
      }))
    ];
  }, [safeSessions, safeTeachers]);

  // Date filter options
  const dateOptions = [
    { value: 'all', label: 'All Dates', icon: 'calendar_month' },
    { value: 'today', label: 'Today', icon: 'today' },
    { value: 'tomorrow', label: 'Tomorrow', icon: 'event' },
    { value: 'this-week', label: 'This Week', icon: 'date_range' },
    { value: 'next-week', label: 'Next Week', icon: 'calendar_view_week' }
  ];

  // Price filter options
  const priceOptions = [
    { value: 'all', label: 'All', icon: 'payments' },
    { value: 'free', label: 'Free', icon: 'money_off' },
    { value: 'paid', label: 'Paid', icon: 'attach_money' },
    { value: 'bidding', label: 'Bid', icon: 'gavel' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'date-asc', label: 'Soonest', icon: 'schedule' },
    { value: 'date-desc', label: 'Latest', icon: 'history' },
    { value: 'price-low', label: 'Price ↑', icon: 'trending_up' },
    { value: 'price-high', label: 'Price ↓', icon: 'trending_down' },
    { value: 'popular', label: 'Popular', icon: 'star' }
  ];

  // Check if session is already enrolled
  const isEnrolled = (session) => {
    return safeEnrollments.some(e => 
      e.sessionId === session.id || e.id === session.id
    );
  };

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 1);
    
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

    let filtered = safeSessions.filter(session => {
      // Exclude already enrolled sessions
      if (isEnrolled(session)) return false;

      // Exclude past sessions
      const sessionDate = new Date(`${session.scheduledDate}T${session.scheduledTime || '00:00'}`);
      if (sessionDate < new Date()) return false;

      // Search filter
      const matchesSearch = !searchTerm || 
        session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.teacherName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Teacher filter
      const matchesTeacher = selectedTeacher === 'all' || 
        session.teacherId?.toString() === selectedTeacher;

      // Date filter
      let matchesDate = true;
      const sessDate = new Date(session.scheduledDate);
      sessDate.setHours(0, 0, 0, 0);
      
      if (selectedDate === 'today') {
        matchesDate = sessDate.getTime() === today.getTime();
      } else if (selectedDate === 'tomorrow') {
        matchesDate = sessDate.getTime() === tomorrow.getTime();
      } else if (selectedDate === 'this-week') {
        matchesDate = sessDate >= today && sessDate <= endOfWeek;
      } else if (selectedDate === 'next-week') {
        matchesDate = sessDate >= startOfNextWeek && sessDate <= endOfNextWeek;
      }

      // Price filter
      let matchesPrice = true;
      if (priceFilter === 'free') matchesPrice = !session.price || session.price === 0;
      if (priceFilter === 'paid') matchesPrice = session.price > 0 && !session.allowBidding;
      if (priceFilter === 'bidding') matchesPrice = session.allowBidding === true;

      return matchesSearch && matchesTeacher && matchesDate && matchesPrice;
    });

    // Enrich with teacher info
    filtered = filtered.map(session => {
      const teacher = safeTeachers.find(t => t.id === session.teacherId);
      return {
        ...session,
        teacherName: session.teacherName || teacher?.fullname || teacher?.fullName || 'Teacher',
        teacherAvatar: session.teacherAvatar || teacher?.profilePicture || teacher?.avatar
      };
    });

    // Sort
    switch (sortBy) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`) - new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`));
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`) - new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
        break;
    }

    return filtered;
  }, [safeSessions, safeTeachers, safeEnrollments, searchTerm, selectedTeacher, selectedDate, priceFilter, sortBy]);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const sessDate = new Date(date);
    sessDate.setHours(0, 0, 0, 0);
    
    if (sessDate.getTime() === today.getTime()) return 'Today';
    if (sessDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="explore-sessions-view">
      {/* Header */}
      <div className="explore-header">
        <div>
          <h1 className="explore-title">Explore Sessions</h1>
          <p className="explore-subtitle">{filteredSessions.length} live sessions available</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar premium-filters">
        {/* Search */}
        <div className="search-box-explore">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search sessions, teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-explore"
          />
        </div>

        {/* Teacher Filter */}
        <PremiumDropdown
          options={teacherOptions}
          value={selectedTeacher}
          onChange={setSelectedTeacher}
          placeholder="All Teachers"
          className="filter-dropdown"
        />

        {/* Date Filter */}
        <PremiumDropdown
          options={dateOptions}
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="All Dates"
          className="filter-dropdown"
        />

        {/* Price Filter */}
        <PremiumDropdown
          options={priceOptions}
          value={priceFilter}
          onChange={setPriceFilter}
          placeholder="All Prices"
          className="filter-dropdown"
        />

        {/* Sort */}
        <PremiumDropdown
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Sort By"
          className="filter-dropdown"
        />

        {/* View Toggle */}
        <div className="view-toggle">
          <button 
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Sessions Grid/List */}
      {filteredSessions.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <div className="empty-state-icon">
            <Calendar size={24} />
          </div>
          <h3 className="empty-state-title">No Sessions Found</h3>
          <p className="empty-state-text">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'session-cards-grid' : 'session-cards-list'}>
          {filteredSessions.map((session, idx) => (
            <SessionExploreCard
              key={session.id || idx}
              session={session}
              onEnroll={onEnroll}
              onMakeBid={onMakeBid}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Session Explore Card Component
const SessionExploreCard = ({ session, onEnroll, onMakeBid, formatDate }) => {
  const isFree = !session.price || session.price === 0;
  const allowsBidding = session.allowBidding === true;

  return (
    <div className="session-explore-card">
      {/* Header */}
      <div className="session-explore-header">
        <div className="session-date-time">
          <div className="session-date-badge-lg">
            <Calendar size={16} />
            <span>{formatDate(session.scheduledDate)}</span>
          </div>
          <div className="session-time-badge">
            <Clock size={14} />
            <span>{session.scheduledTime}</span>
          </div>
        </div>
        
        {isFree ? (
          <span className="session-price-badge-lg free">
            <Sparkles size={14} />
            Free
          </span>
        ) : allowsBidding ? (
          <span className="session-price-badge-lg bidding">
            <Gavel size={14} />
            Bidding
          </span>
        ) : (
          <span className="session-price-badge-lg paid">
            <Tag size={14} />
            NPR {session.price?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="session-explore-body">
        <h3 className="session-explore-title">{session.title}</h3>
        
        {session.description && (
          <p className="session-explore-desc">{session.description}</p>
        )}

        {/* Teacher Info */}
        <div className="session-explore-teacher">
          <div 
            className="session-explore-avatar"
            style={{
              backgroundImage: `url('${session.teacherAvatar || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(session.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
            }}
          />
          <div className="session-explore-teacher-info">
            <span className="session-explore-teacher-name">{session.teacherName}</span>
            {session.teacherTitle && (
              <span className="session-explore-teacher-title">{session.teacherTitle}</span>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="session-explore-meta">
          <span className="session-meta-tag">
            <Video size={14} />
            {session.duration || 60} mins
          </span>
          {session.maxParticipants && (
            <span className="session-meta-tag">
              <Users size={14} />
              {session.enrolledCount || 0}/{session.maxParticipants} spots
            </span>
          )}
          {session.type && (
            <span className="session-meta-tag">
              <Tag size={14} />
              {session.type}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="session-explore-footer">
        {isFree ? (
          <button 
            className="session-explore-btn enroll-free"
            onClick={() => onEnroll && onEnroll(session)}
          >
            <Play size={16} />
            Join Free
          </button>
        ) : allowsBidding ? (
          <div className="session-explore-actions">
            <button 
              className="session-explore-btn enroll-paid"
              onClick={() => onEnroll && onEnroll(session)}
            >
              Enroll Now
            </button>
            <button 
              className="session-explore-btn make-bid"
              onClick={() => onMakeBid && onMakeBid(session)}
            >
              <Gavel size={16} />
              Make a Bid
            </button>
          </div>
        ) : (
          <button 
            className="session-explore-btn enroll-paid"
            onClick={() => onEnroll && onEnroll(session)}
          >
            Enroll for NPR {session.price?.toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExploreSessionsView;
