import React, { useState, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Clock,
  Eye
} from 'lucide-react';

const VideoPlayerModal = ({ 
  content, 
  onClose, 
  suggestedContent = [], 
  onSelectContent,
  baseUrl = 'http://localhost:5000'
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const videoUrl = content.videoUrl?.startsWith('http') 
    ? content.videoUrl 
    : `${baseUrl}${content.videoUrl}`;

  const getThumbnailUrl = (item) => {
    if (!item.thumbnail) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || 'Video')}&background=ea2a33&color=fff&size=200`;
    }
    return item.thumbnail.startsWith('http') ? item.thumbnail : `${baseUrl}${item.thumbnail}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="video-player-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="video-player-layout">
          {/* Main Video Section - 70% */}
          <div className="video-player-main">
            {/* Video Player */}
            <div 
              className="video-wrapper"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(isPlaying ? false : true)}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                className="video-element"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Play/Pause Overlay */}
              {!isPlaying && (
                <div className="video-play-overlay" onClick={togglePlay}>
                  <div className="video-play-btn-large">
                    <Play size={48} fill="white" />
                  </div>
                </div>
              )}

              {/* Video Controls */}
              <div className={`video-controls ${showControls ? 'visible' : ''}`}>
                {/* Progress Bar */}
                <div className="video-progress" onClick={handleSeek}>
                  <div 
                    className="video-progress-filled"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>

                <div className="video-controls-row">
                  {/* Left Controls */}
                  <div className="video-controls-left">
                    <button className="video-control-btn" onClick={togglePlay}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="video-control-btn" onClick={toggleMute}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <span className="video-time">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls */}
                  <div className="video-controls-right">
                    <button className="video-control-btn" onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="video-info">
              <h1 className="video-title">{content.title}</h1>
              
              <div className="video-meta-row">
                <span className="video-meta-item">
                  <Eye size={16} />
                  {content.views || 0} views
                </span>
                <span className="video-meta-item">
                  <Clock size={16} />
                  {formatDate(content.created_at)}
                </span>
                {content.category && (
                  <span className="video-category-badge">{content.category}</span>
                )}
              </div>

              {/* Uploader Info */}
              <div className="video-uploader">
                <div 
                  className="video-uploader-avatar"
                  style={{
                    backgroundImage: `url('${content.teacherAvatar || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(content.teacherName || 'Teacher')}&background=ea2a33&color=fff`}')`
                  }}
                />
                <div className="video-uploader-info">
                  <span className="video-uploader-name">{content.teacherName || 'Teacher'}</span>
                  <span className="video-uploader-role">Instructor</span>
                </div>
              </div>

              {/* Description */}
              {content.description && (
                <div className="video-description">
                  <p>{content.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Videos Sidebar - 30% */}
          <div className="video-sidebar">
            <h3 className="video-sidebar-title">Up Next</h3>
            
            <div className="video-suggested-list">
              {suggestedContent.length === 0 ? (
                <p className="video-no-suggestions">No more videos available</p>
              ) : (
                suggestedContent.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="video-suggested-card"
                    onClick={() => onSelectContent && onSelectContent(item)}
                  >
                    <div 
                      className="video-suggested-thumb"
                      style={{ backgroundImage: `url('${getThumbnailUrl(item)}')` }}
                    >
                      {item.duration && (
                        <span className="video-suggested-duration">{item.duration}</span>
                      )}
                    </div>
                    <div className="video-suggested-info">
                      <h4 className="video-suggested-title">{item.title}</h4>
                      <span className="video-suggested-teacher">{item.teacherName || 'Teacher'}</span>
                      <span className="video-suggested-views">{item.views || 0} views</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
