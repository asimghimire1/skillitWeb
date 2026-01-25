import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Video,
  BookOpen,
  Users,
  MapPin,
  Grid,
  List,
  ChevronRight,
  Play,
  Award
} from 'lucide-react';
import PremiumDropdown from '../PremiumDropdown';

const ExploreTeachersView = ({
  teachers,
  content,
  onViewTeacherContent,
  onViewProfile
}) => {
  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safeContent = Array.isArray(content) ? content : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  // Auto-generate skills from teachers
  const skillOptions = useMemo(() => {
    const skills = new Set();
    safeTeachers.forEach(teacher => {
      if (teacher.skills) {
        teacher.skills.forEach(skill => skills.add(skill));
      }
    });
    return [
      { value: 'all', label: 'All Skills', icon: 'category' },
      ...Array.from(skills).map(skill => ({ value: skill, label: skill, icon: 'school' }))
    ];
  }, [safeTeachers]);

  // Sort options
  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: 'star' },
    { value: 'name', label: 'Name A-Z', icon: 'sort_by_alpha' },
    { value: 'content', label: 'Most Content', icon: 'video_library' },
    { value: 'rating', label: 'Highest Rated', icon: 'grade' }
  ];

  // Get teacher's content
  const getTeacherContent = (teacherId) => {
    return safeContent.filter(c => c.teacherId === teacherId);
  };

  // Filter and sort teachers
  const filteredTeachers = useMemo(() => {
    let filtered = safeTeachers.filter(teacher => {
      // Only show teachers with role 'teacher' or 'mentor'
      if (teacher.role !== 'teacher' && teacher.role !== 'mentor') return false;

      // Search filter
      const matchesSearch = !searchTerm || 
        teacher.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      // Skill filter
      const matchesSkill = selectedSkill === 'all' || 
        teacher.skills?.includes(selectedSkill);

      return matchesSearch && matchesSkill;
    });

    // Enrich with content count
    filtered = filtered.map(teacher => ({
      ...teacher,
      contentItems: getTeacherContent(teacher.id),
      contentCount: getTeacherContent(teacher.id).length
    }));

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.fullname || a.fullName || '').localeCompare(b.fullname || b.fullName || ''));
        break;
      case 'content':
        filtered.sort((a, b) => b.contentCount - a.contentCount);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.students || b.contentCount || 0) - (a.students || a.contentCount || 0));
        break;
    }

    return filtered;
  }, [safeTeachers, safeContent, searchTerm, selectedSkill, sortBy]);

  const toggleTeacherExpand = (teacherId) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
  };

  return (
    <div className="explore-teachers-view">
      {/* Header */}
      <div className="explore-header">
        <div>
          <h1 className="explore-title">Explore Teachers</h1>
          <p className="explore-subtitle">{filteredTeachers.length} expert teachers available</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar premium-filters">
        {/* Search */}
        <div className="search-box-explore">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search teachers, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-explore"
          />
        </div>

        {/* Skill Filter */}
        <PremiumDropdown
          options={skillOptions}
          value={selectedSkill}
          onChange={setSelectedSkill}
          placeholder="All Skills"
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

      {/* Teachers Grid/List */}
      {filteredTeachers.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <div className="empty-state-icon">
            <Users size={24} />
          </div>
          <h3 className="empty-state-title">No Teachers Found</h3>
          <p className="empty-state-text">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'teachers-explore-grid' : 'teachers-explore-list'}>
          {filteredTeachers.map((teacher, idx) => (
            <div 
              key={teacher.id || idx} 
              className={`teacher-explore-card ${viewMode} ${expandedTeacher === teacher.id ? 'expanded' : ''}`}
            >
              {/* Main Card Content */}
              <div className="teacher-card-main" onClick={() => toggleTeacherExpand(teacher.id)}>
                {/* Avatar */}
                <div 
                  className="teacher-explore-avatar"
                  style={{
                    backgroundImage: `url('${teacher.profilePicture || teacher.avatar || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.fullname || teacher.fullName || 'Teacher')}&background=ea2a33&color=fff&size=128`}')`
                  }}
                >
                  {teacher.verified && (
                    <div className="teacher-verified-badge">
                      <Award size={12} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="teacher-explore-info">
                  <h3 className="teacher-explore-name">{teacher.fullname || teacher.fullName}</h3>
                  
                  {/* Rating */}
                  <div className="teacher-explore-rating">
                    <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                    <span>{(teacher.rating || 4.5).toFixed(1)}</span>
                    <span className="rating-count">({teacher.reviewCount || 0} reviews)</span>
                  </div>

                  {/* Bio */}
                  {teacher.bio && (
                    <p className="teacher-explore-bio">{teacher.bio}</p>
                  )}

                  {/* Skills */}
                  {teacher.skills && teacher.skills.length > 0 && (
                    <div className="teacher-explore-skills">
                      {teacher.skills.slice(0, 4).map((skill, sidx) => (
                        <span key={sidx} className="skill-tag">{skill}</span>
                      ))}
                      {teacher.skills.length > 4 && (
                        <span className="skill-more">+{teacher.skills.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="teacher-explore-stats">
                    <span className="stat-item">
                      <Video size={14} />
                      {teacher.contentCount || 0} Content
                    </span>
                    <span className="stat-item">
                      <Users size={14} />
                      {teacher.students || 0} Students
                    </span>
                    {teacher.location && (
                      <span className="stat-item location">
                        <MapPin size={14} />
                        {teacher.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand Indicator */}
                <div className="teacher-expand-btn">
                  <ChevronRight 
                    size={20} 
                    className={expandedTeacher === teacher.id ? 'rotated' : ''}
                  />
                </div>
              </div>

              {/* Expanded Content Preview */}
              {expandedTeacher === teacher.id && teacher.contentItems && teacher.contentItems.length > 0 && (
                <div className="teacher-content-preview">
                  <div className="preview-header">
                    <h4>Content by {teacher.fullname || teacher.fullName}</h4>
                    <button 
                      className="view-all-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTeacherContent(teacher);
                      }}
                    >
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="preview-content-grid">
                    {teacher.contentItems.slice(0, 3).map((item, cidx) => (
                      <div key={item.id || cidx} className="preview-content-card">
                        <div 
                          className="preview-thumbnail"
                          style={{
                            backgroundImage: `url('${item.thumbnail ? 
                              (item.thumbnail.startsWith('http') ? item.thumbnail : `http://localhost:5000${item.thumbnail}`) 
                              : 'https://via.placeholder.com/150x85?text=No+Thumbnail'}')`
                          }}
                        >
                          <div className="preview-play-icon">
                            <Play size={16} />
                          </div>
                        </div>
                        <div className="preview-info">
                          <span className="preview-title">{item.title}</span>
                          <span className="preview-price">
                            {!item.price || item.price === 0 ? 'Free' : `NPR ${item.price}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Content Message */}
              {expandedTeacher === teacher.id && (!teacher.contentItems || teacher.contentItems.length === 0) && (
                <div className="teacher-no-content">
                  <BookOpen size={20} />
                  <span>No content uploaded yet</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="teacher-card-actions">
                <button 
                  className="btn-view-content"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewTeacherContent(teacher);
                  }}
                >
                  <Video size={16} />
                  View Content
                </button>
                <button 
                  className="btn-view-profile"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProfile(teacher);
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreTeachersView;
