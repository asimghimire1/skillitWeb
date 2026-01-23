import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Video,
  BookOpen,
  Users,
  MapPin,
  Filter,
  Grid,
  List
} from 'lucide-react';

const TeachersView = ({
  teachers,
  onViewProfile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  // Extract unique skills
  const allSkills = useMemo(() => {
    const skills = new Set();
    teachers.forEach(teacher => {
      if (teacher.skills) {
        teacher.skills.forEach(skill => skills.add(skill));
      }
    });
    return ['all', ...Array.from(skills)];
  }, [teachers]);

  // Filter and sort teachers
  const filteredTeachers = useMemo(() => {
    let filtered = teachers.filter(teacher => {
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

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => (a.fullname || a.fullName || '').localeCompare(b.fullname || b.fullName || ''));
    } else if (sortBy === 'sessions') {
      filtered.sort((a, b) => (b.sessionCount || 0) - (a.sessionCount || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [teachers, searchTerm, selectedSkill, sortBy]);

  return (
    <div className="teachers-view">
      {/* Header */}
      <div className="teachers-header">
        <div>
          <h1 className="teachers-title">Find Teachers</h1>
          <p className="teachers-subtitle">{filteredTeachers.length} teachers available</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="teachers-filters-bar">
        {/* Search */}
        <div className="search-box-teachers">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search teachers, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-teachers"
          />
        </div>

        {/* Skill Filter */}
        <div className="filter-group">
          <Filter size={16} />
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="filter-select"
          >
            {allSkills.map(skill => (
              <option key={skill} value={skill}>
                {skill === 'all' ? 'All Skills' : skill}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="sessions">Most Sessions</option>
            <option value="rating">Highest Rated</option>
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
        <div className={viewMode === 'grid' ? 'teachers-grid' : 'teachers-list'}>
          {filteredTeachers.map((teacher, idx) => (
            <div 
              key={teacher.id || idx} 
              className={`teacher-card ${viewMode}`}
              onClick={() => onViewProfile(teacher)}
            >
              {/* Avatar */}
              <div 
                className="teacher-card-avatar"
                style={{
                  backgroundImage: `url('${teacher.profilePicture || teacher.avatar || "https://ui-avatars.com/api/?name=" + (teacher.fullname || teacher.fullName || "Teacher") + "&background=ea2a33&color=fff&size=128"}')`
                }}
              />

              {/* Info */}
              <div className="teacher-card-info">
                <h3 className="teacher-card-name">{teacher.fullname || teacher.fullName}</h3>
                
                {/* Rating */}
                {teacher.rating > 0 && (
                  <div className="teacher-rating">
                    <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                    <span>{teacher.rating.toFixed(1)}</span>
                    {teacher.reviewCount > 0 && (
                      <span className="review-count">({teacher.reviewCount} reviews)</span>
                    )}
                  </div>
                )}

                {/* Bio */}
                {teacher.bio && (
                  <p className="teacher-bio">{teacher.bio}</p>
                )}

                {/* Skills */}
                {teacher.skills && teacher.skills.length > 0 && (
                  <div className="teacher-skills">
                    {teacher.skills.slice(0, 3).map((skill, sidx) => (
                      <span key={sidx} className="teacher-skill-tag">{skill}</span>
                    ))}
                    {teacher.skills.length > 3 && (
                      <span className="teacher-skill-more">+{teacher.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="teacher-card-stats">
                  <span>
                    <Video size={14} />
                    {teacher.sessionCount || 0} Sessions
                  </span>
                  <span>
                    <BookOpen size={14} />
                    {teacher.contentCount || 0} Content
                  </span>
                  {teacher.students > 0 && (
                    <span>
                      <Users size={14} />
                      {teacher.students} Students
                    </span>
                  )}
                </div>

                {/* Location */}
                {teacher.location && (
                  <div className="teacher-location">
                    <MapPin size={12} />
                    <span>{teacher.location}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="teacher-card-action">
                <button className="btn-view-profile">
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

export default TeachersView;
