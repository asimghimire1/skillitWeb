import React, { useState } from 'react';
import '../css/upload-modal.css';

export default function UploadModal({ isOpen, onClose, onUpload, teacherName }) {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [customCategory, setCustomCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isDragging, setIsDragging] = useState(false);
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    } else if (selectedFile) {
      alert('Please select a video file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    } else if (droppedFile) {
      alert('Please select a video file.');
    }
  };

  const handleThumbnailChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
    }
  };

  const handleThumbnailDragOver = (e) => {
    e.preventDefault();
    setIsThumbnailDragging(true);
  };

  const handleThumbnailDragLeave = () => {
    setIsThumbnailDragging(false);
  };

  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    setIsThumbnailDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setThumbnail(droppedFile);
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category === 'Other' ? customCategory : category);
    formData.append('level', level);
    formData.append('status', 'published');
    formData.append('trimStart', trimStart);
    formData.append('trimEnd', trimEnd);

    if (file) {
      formData.append('file', file);
    }
    if (thumbnail) { // Added thumbnail to FormData
      formData.append('thumbnail', thumbnail);
    }

    // Pass FormData to parent handler
    onUpload(formData);
    onClose();

    // Reset form
    setFile(null);
    setThumbnail(null);
    setTitle('');
    setDescription('');
    setCategory('Technology');
    setCustomCategory('');
    setLevel('Beginner');
    setTrimStart(0);
    setTrimEnd(0);
    setVideoDuration(0);
  };

  const handleVideoMetadata = (e) => {
    const duration = Math.floor(e.target.duration);
    setVideoDuration(duration);
    setTrimEnd(duration);
  };

  const resetForm = () => {
    setFile(null);
    setThumbnail(null);
    setTitle('');
    setDescription('');
    setCategory('Photography');
    setLevel('Beginner');
  };

  const handleDiscard = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="upload-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h1 className="modal-title">Upload Content</h1>
            <div className="modal-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <span className="step-label">Upload</span>
              </div>
              <div className="step-divider"></div>
              <div className="step-item">
                <div className={`step-number ${!file ? 'inactive' : ''}`}>2</div>
                <span className={`step-label ${!file ? 'inactive' : ''}`}>Details</span>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Left: Upload Form */}
          <div className="modal-left">
            <div className="modal-form-container">
              {/* Upload Zone */}
              <div>
                <label className="upload-label">Step 1: Media Asset</label>
                <div
                  className={`drag-drop-zone ${isDragging ? 'active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div className="upload-icon-container">
                    <span className="material-symbols-outlined upload-icon">cloud_upload</span>
                  </div>
                  <div className="upload-text">
                    <p className="upload-title">Click to upload or drag and drop</p>
                    <p className="upload-subtitle">MP4, MOV (Max 500MB)</p>
                  </div>
                  <button type="button" className="upload-button">
                    Select Video
                  </button>
                  <input
                    id="file-input"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </div>
                {file && (
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <p className="upload-subtitle" style={{ margin: 0 }}>
                      Selected: <strong>{file.name}</strong>
                    </p>
                    <button
                      className="discard-btn"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => setFile(null)}
                    >
                      Re-upload
                    </button>
                  </div>
                )}
              </div>

              {/* Trimming Section */}
              {file && (
                <div className="form-section">
                  <label className="upload-label">Step 2: Trim Video (Optional)</label>
                  <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Start Time (sec)</label>
                        <input
                          type="number"
                          className="form-input"
                          min="0"
                          max={trimEnd}
                          value={trimStart}
                          onChange={(e) => setTrimStart(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Time (sec)</label>
                        <input
                          type="number"
                          className="form-input"
                          min={trimStart}
                          max={videoDuration}
                          value={trimEnd}
                          onChange={(e) => setTrimEnd(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <p className="upload-subtitle" style={{ marginTop: '0.5rem' }}>
                      Duration: {trimEnd - trimStart}s (Total: {videoDuration}s)
                    </p>
                  </div>
                </div>
              )}

              {/* Details Section */}
              <div className={!file ? 'form-section-dimmed' : ''}>
                <label className="upload-label">Step 3: Information</label>
                <div className="form-group">
                  <label className="form-label">Content Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Advanced Portrait Lighting Masterclass"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!file}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="What will your students learn?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!file}
                  ></textarea>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={!file}
                    >
                      <option>Technology</option>
                      <option>Business</option>
                      <option>Marketing</option>
                      <option>Health & Fitness</option>
                      <option>Design</option>
                      <option>Culinary Arts</option>
                      <option>Music</option>
                      <option>Personal Development</option>
                      <option>Other</option>
                    </select>
                  </div>
                  {category === 'Other' && (
                    <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '-1.5rem' }}>
                      <label className="form-label">Specify Category</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Type your category here..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select
                      className="form-select"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={!file}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Expert</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Thumbnail Upload Section */}
              {file && (
                <div>
                  <label className="upload-label">Step 4: Thumbnail (Optional)</label>
                  <div
                    className={`drag-drop-zone ${isThumbnailDragging ? 'active' : ''}`}
                    onDragOver={handleThumbnailDragOver}
                    onDragLeave={handleThumbnailDragLeave}
                    onDrop={handleThumbnailDrop}
                    onClick={() => document.getElementById('thumbnail-input').click()}
                  >
                    <div className="upload-icon-container">
                      <span className="material-symbols-outlined upload-icon">image</span>
                    </div>
                    <div className="upload-text">
                      <p className="upload-title">Click to upload or drag and drop</p>
                      <p className="upload-subtitle">PNG or JPEG (Max 5MB)</p>
                    </div>
                    <button type="button" className="upload-button">
                      Select Thumbnail
                    </button>
                    <input
                      id="thumbnail-input"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </div>
                  {thumbnail && (
                    <p className="upload-subtitle" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                      Selected: <strong>{thumbnail.name}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="modal-right">
            <div className="preview-header">
              <h3 className="preview-title">Live Preview</h3>
              <span className="preview-status">Syncing</span>
            </div>

            <div className="preview-card">
              <div className="preview-thumbnail">
                {thumbnail ? (
                  <img src={URL.createObjectURL(thumbnail)} alt="preview" className="preview-image" />
                ) : file ? (
                  file.type.startsWith('video/') ? (
                    <video
                      src={URL.createObjectURL(file)}
                      className="preview-image"
                      controls
                      onLoadedMetadata={handleVideoMetadata}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={URL.createObjectURL(file)} alt="preview" className="preview-image" />
                  )
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.3 }}>image</span>
                )}
                {!thumbnail && file && file.type.startsWith('video/') && (
                  <div className="play-button">
                    <span className="material-symbols-outlined">play_arrow</span>
                  </div>
                )}
              </div>
              <div className="preview-content">
                <div className="preview-badge">New Course</div>
                <h4 className="preview-content-title">
                  {title || 'Your Content Title'}
                </h4>
                <div className="preview-meta" style={{ fontSize: '0.75rem', color: '#876467', display: 'flex', gap: '0.5rem' }}>
                  <span>{category === 'Other' ? customCategory || 'Other' : category}</span>
                  <span>•</span>
                  <span>{level}</span>
                </div>
                <p className="preview-description">
                  {description || 'Your content description will appear here'}
                </p>
                <div className="preview-separator"></div>
                <div className="preview-footer">
                  <div className="teacher-info">
                    <div
                      className="teacher-avatar"
                      style={{
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKp2LOu34hcxh7LHZsAo0cTXSQQIWtGnOKsCakyjNAKADpsFWBoK65kszWXCKc5P6Mpc65u7QLHq0ylGKYvV5JIMuoFkBWjCt44tmaCFXL1dXyb6XLbxBNSCO6KKlYUtyECgvK4V9I25fRHqluSissRVhzMHpIwVkvWEw06NOP-FuQ8LecRvSykV3aEWUY9LiUy-rfWAum9gt-h6ZrNAeSvte--O_n9RoeXwh1PzDxGlqPpmoC9KYQ2thKnwVO_2vnY997LNZRVoE')",
                      }}
                    ></div>
                    <span className="teacher-name">{teacherName || 'Teacher'}</span>
                  </div>
                  <div className="teacher-rating">
                    <span className="material-symbols-outlined rating-star">star</span>
                    <span className="rating-value">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="preview-info-box">
              <div className="info-box-content">
                <span className="material-symbols-outlined info-icon">info</span>
                <p className="info-text">
                  This is how your content will appear to students on the marketplace. Make sure your thumbnail and title are eye-catching!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="discard-btn" onClick={handleDiscard}>
            Discard Changes
          </button>
          <div className="footer-actions">
            <button className="draft-btn" onClick={handleDiscard}>
              Save Draft
            </button>
            <button
              className="continue-btn"
              onClick={handleUpload}
              disabled={!file || !title}
              style={{ opacity: (file && title) ? 1 : 0.5, cursor: (file && title) ? 'pointer' : 'not-allowed' }}
              title={!file ? 'Please upload a file first' : !title ? 'Please enter a title' : ''}
            >
              <span>Upload</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
