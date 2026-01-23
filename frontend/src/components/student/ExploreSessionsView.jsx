import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Users,
  Filter,
  Tag,
  Grid,
  List
} from 'lucide-react';

const ExploreSessionsView = ({
  sessions,
  enrollments,
  onEnroll,
  onMakeBid
}) => {
  // Safe array defaults
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [priceFilter, setPriceFilter] = useState('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(safeSessions.map(s => s.category).filter(Boolean))];
    return ['all', ...cats];
  }, [safeSessions]);

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let filtered = safeSessions.filter(session => {
      // Exclude already enrolled
      const isEnrolled = safeEnrollments.some(e => e.sessionId === session.id || e.id === session.id);
      if (isEnrolled) return false;

      // Search filter
      const matchesSearch = !searchTerm || 
        session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.teacherName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;

      // Price filter
      let matchesPrice = true;
      if (priceFilter === 'free') matchesPrice = !session.price || session.price === 0;
      if (priceFilter === 'paid') matchesPrice = session.price > 0;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
    }

    return filtered;
  }, [sessions, enrollments, searchTerm, selectedCategory, sortBy, priceFilter]);

  const isUpcoming = (session) => {
    const sessionDate = new Date(`${session.scheduledDate}T${session.scheduledTime}`);
    return sessionDate > new Date();
  };

  return (
    <div className="explore-sessions-view">
      {/* Header */}
      <div className="explore-header">
        <div>
          <h1 className="explore-title">Explore Sessions</h1>
          <p className="explore-subtitle">{filteredSessions.length} sessions available</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        {/* Search */}
        <div className="search-box-explore">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-explore"
          />
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <Filter size={16} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="filter-group">
          <Tag size={16} />
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Prices</option>
            <option value="free">Free Only</option>
            <option value="paid">Paid Only</option>
          </select>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

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
            <Search size={24} />
          </div>
          <h3 className="empty-state-title">No Sessions Found</h3>
          <p className="empty-state-text">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'sessions-explore-grid' : 'sessions-explore-list'}>
          {filteredSessions.map((session, idx) => (
            <div key={session.id || idx} className={`session-explore-card ${viewMode}`}>
              {/* Card Header */}
              <div className="session-explore-header">
                <div className="session-badges">
                  {session.category && (
                    <span className="session-category-badge">{session.category}</span>
                  )}
                  {!isUpcoming(session) && (
                    <span className="session-past-badge">Past</span>
                  )}
                </div>
                <span className="session-price-badge-large">
                  {!session.price || session.price === 0 ? 'Free' : `NPR ${session.price.toLocaleString()}`}
                </span>
              </div>

              {/* Card Body */}
              <div className="session-explore-body">
                <h3 className="session-explore-title">{session.title}</h3>
                {session.description && (
                  <p className="session-explore-desc">{session.description}</p>
                )}

                <div className="session-explore-meta">
                  <div className="session-meta-item">
                    <Calendar size={14} />
                    <span>{session.scheduledDate}</span>
                  </div>
                  <div className="session-meta-item">
                    <Clock size={14} />
                    <span>{session.scheduledTime}</span>
                  </div>
                  {session.duration && (
                    <div className="session-meta-item">
                      <Clock size={14} />
                      <span>{session.duration} min</span>
                    </div>
                  )}
                </div>

                {/* Teacher Info */}
                {session.teacherName && (
                  <div className="session-teacher-info">
                    <div
                      className="session-teacher-avatar"
                      style={{
                        backgroundImage: `url('${session.teacherAvatar || "https://ui-avatars.com/api/?name=" + session.teacherName + "&background=ea2a33&color=fff"}')`
                      }}
                    />
                    <span>{session.teacherName}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="session-explore-footer">
                {isUpcoming(session) ? (
                  <>
                    <button 
                      className="btn-enroll-full"
                      onClick={() => onEnroll(session)}
                    >
                      {!session.price || session.price === 0 ? 'Enroll Free' : 'Enroll Now'}
                    </button>
                    {session.price > 0 && (
                      <button 
                        className="btn-bid-full"
                        onClick={() => onMakeBid(session)}
                      >
                        Make a Bid
                      </button>
                    )}
                  </>
                ) : (
                  <button className="btn-disabled" disabled>
                    Session Ended
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreSessionsView;
