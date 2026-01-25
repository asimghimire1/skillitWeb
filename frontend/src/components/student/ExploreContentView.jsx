import React, { useState, useMemo } from 'react';
import {
  Search,
  Play,
  Clock,
  User,
  Tag,
  Grid,
  List,
  Filter,
  Sparkles,
  Lock,
  Gavel
} from 'lucide-react';
import PremiumDropdown from '../PremiumDropdown';
import StudentContentCard from './StudentContentCard';

const ExploreContentView = ({
  content,
  unlockedContent,
  onJoinContent,
  onMakeBid
}) => {
  // Safe array defaults
  const safeContent = Array.isArray(content) ? content : [];
  const safeUnlockedContent = Array.isArray(unlockedContent) ? unlockedContent : [];

  // Debug logging
  console.log('[ExploreContentView] content prop:', content);
  console.log('[ExploreContentView] safeContent:', safeContent);
  console.log('[ExploreContentView] safeContent.length:', safeContent.length);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Auto-generate categories from content metadata
  const categories = useMemo(() => {
    const cats = [...new Set(safeContent.map(c => c.category).filter(Boolean))];
    return [
      { value: 'all', label: 'All', icon: 'category' },
      ...cats.map(cat => ({ value: cat, label: cat, icon: 'folder' }))
    ];
  }, [safeContent]);

  // Auto-generate teachers from content
  const teachers = useMemo(() => {
    const teacherMap = new Map();
    safeContent.forEach(c => {
      if (c.teacherId && (c.teacherName || c.teacherFullname)) {
        teacherMap.set(c.teacherId, c.teacherName || c.teacherFullname);
      }
    });
    return [
      { value: 'all', label: 'All', icon: 'person' },
      ...Array.from(teacherMap.entries()).map(([id, name]) => ({ 
        value: id.toString(), 
        label: name, 
        icon: 'school' 
      }))
    ];
  }, [safeContent]);

  // Content types
  const contentTypes = [
    { value: 'all', label: 'All', icon: 'apps' },
    { value: 'video', label: 'Videos', icon: 'play_circle' },
    { value: 'course', label: 'Courses', icon: 'menu_book' },
    { value: 'tutorial', label: 'Tutorials', icon: 'auto_stories' }
  ];

  // Price filter options
  const priceOptions = [
    { value: 'all', label: 'All', icon: 'payments' },
    { value: 'free', label: 'Free', icon: 'money_off' },
    { value: 'paid', label: 'Paid', icon: 'attach_money' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: 'schedule' },
    { value: 'oldest', label: 'Oldest', icon: 'history' },
    { value: 'price-low', label: 'Price ↑', icon: 'trending_up' },
    { value: 'price-high', label: 'Price ↓', icon: 'trending_down' },
    { value: 'popular', label: 'Popular', icon: 'star' }
  ];

  // Check if content is already unlocked/joined
  const isUnlocked = (contentItem) => {
    return safeUnlockedContent.some(u => 
      u.contentId === contentItem.id || u.id === contentItem.id
    );
  };

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = safeContent.filter(item => {
      // Exclude already unlocked content
      if (isUnlocked(item)) return false;

      // Search filter
      const matchesSearch = !searchTerm || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Teacher filter
      const matchesTeacher = selectedTeacher === 'all' || 
        item.teacherId?.toString() === selectedTeacher;

      // Type filter
      const matchesType = selectedType === 'all' || 
        item.type?.toLowerCase() === selectedType;

      // Price filter
      let matchesPrice = true;
      if (priceFilter === 'free') matchesPrice = !item.price || item.price === 0;
      if (priceFilter === 'paid') matchesPrice = item.price > 0 && !item.allowBidding;
      if (priceFilter === 'bidding') matchesPrice = item.allowBidding === true;

      return matchesSearch && matchesCategory && matchesTeacher && matchesType && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }

    return filtered;
  }, [safeContent, safeUnlockedContent, searchTerm, selectedCategory, selectedTeacher, selectedType, priceFilter, sortBy]);

  // Get content type badge
  const getContentTypeBadge = (item) => {
    if (!item.price || item.price === 0) {
      return { text: 'Free', className: 'badge-free', icon: <Sparkles size={12} /> };
    }
    if (item.allowBidding) {
      return { text: 'Bidding', className: 'badge-bidding', icon: <Gavel size={12} /> };
    }
    return { text: `NPR ${item.price?.toLocaleString()}`, className: 'badge-paid', icon: <Tag size={12} /> };
  };

  // Get action button text and handler
  const getActionButton = (item) => {
    if (!item.price || item.price === 0) {
      return {
        text: 'Join Free',
        className: 'btn-join-free',
        onClick: () => onJoinContent(item, 'free')
      };
    }
    if (item.allowBidding) {
      return {
        text: 'Place Bid',
        className: 'btn-place-bid',
        onClick: () => onMakeBid(item)
      };
    }
    return {
      text: 'Join Now',
      className: 'btn-join-paid',
      onClick: () => onJoinContent(item, 'paid')
    };
  };

  return (
    <div className="explore-content-view">
      {/* Header */}
      <div className="explore-header">
        <div>
          <h1 className="explore-title">Explore Content</h1>
          <p className="explore-subtitle">{filteredContent.length} videos & courses available</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar premium-filters">
        {/* Search */}
        <div className="search-box-explore">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search content, teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-explore"
          />
        </div>

        {/* Category Filter */}
        <PremiumDropdown
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="All Categories"
          className="filter-dropdown"
        />

        {/* Teacher Filter */}
        <PremiumDropdown
          options={teachers}
          value={selectedTeacher}
          onChange={setSelectedTeacher}
          placeholder="All Teachers"
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

      {/* Content Grid/List */}
      {filteredContent.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <div className="empty-state-icon">
            <Search size={24} />
          </div>
          <h3 className="empty-state-title">No Content Found</h3>
          <p className="empty-state-text">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'student-content-grid' : 'content-explore-list'}>
          {filteredContent.map((item, idx) => (
            <StudentContentCard
              key={item.id || idx}
              content={item}
              isUnlocked={false}
              onJoinContent={onJoinContent}
              onMakeBid={onMakeBid}
              onViewDetails={(contentItem) => console.log('View details:', contentItem)}
              onNotInterested={(contentItem) => console.log('Not interested:', contentItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreContentView;
