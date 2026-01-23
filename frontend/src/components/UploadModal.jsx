import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import PremiumDropdown from './PremiumDropdown';
import '../css/upload-modal.css';

export default function UploadModal({ isOpen, onClose, onUpload, teacherName }) {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [customCategory, setCustomCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isDragging, setIsDragging] = useState(false);
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // New State for Payment Options
  const [paymentType, setPaymentType] = useState('free'); // 'free' or 'bid'
  const [price, setPrice] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    } else if (selectedFile) {
      showToast('Please select a video file', 'error');
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
      showToast('Please select a video file', 'error');
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

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload timer (3 seconds)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 250);

    setTimeout(async () => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category === 'Other' ? customCategory : category);
      formData.append('level', level);
      formData.append('status', 'published');
      formData.append('paymentType', paymentType);
      formData.append('price', paymentType === 'free' ? 0 : price);
      formData.append('teacherId', JSON.parse(localStorage.getItem('user')).id);

      if (file) {
        formData.append('file', file);
      }
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      // DEBUG: Log FormData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      try {
        await onUpload(formData);
        showToast('Content uploaded successfully', 'success');
      } catch (error) {
        console.error("Upload failed", error);
        showToast("Upload failed. Please try again.", "error");
      } finally {
        setIsUploading(false);
        onClose();
        resetForm();
      }
    }, 3000); // Keep the simulated delay if desired, or remove it.
  };

  const resetForm = () => {
    setFile(null);
    setThumbnail(null);
    setTitle('');
    setDescription('');
    setCategory('Technology');
    setCustomCategory('');
    setLevel('Beginner');
    setPaymentType('free');
    setPrice(0);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleDiscard = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="bg-white w-full max-w-5xl rounded-3xl border border-[#e5dcdd] shadow-2xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-black text-[#171112] tracking-tight">Upload Content</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black">1</div>
                <span className="text-xs font-bold text-[#171112]">Upload</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-black ${file ? 'bg-primary text-white' : 'bg-gray-100 text-[#876467]'}`}>2</div>
                <span className={`text-xs font-bold ${file ? 'text-[#171112]' : 'text-[#876467]'}`}>Details</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#876467]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Upload Form */}
            <div className="space-y-8">
              {/* Upload Zone */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">movie</span>
                  Step 1: Media Asset
                </h3>
                <div
                  className={`border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${isDragging ? 'border-primary bg-primary/5' : 'border-[#e5dcdc] bg-[#f8f6f6] hover:bg-gray-100'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#171112]">Click to upload or drag and drop</p>
                    <p className="text-xs text-[#876467] mt-1 font-medium">MP4, MOV (Max 500MB)</p>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {file && (
                  <div className="flex items-center justify-between bg-primary/5 border border-primary/10 p-3 rounded-2xl animate-fade-in">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span className="text-xs font-bold text-[#171112] truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button
                      className="text-[10px] font-black text-primary hover:underline"
                      onClick={() => setFile(null)}
                    >
                      CHANGE
                    </button>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className={`space-y-6 transition-opacity duration-300 ${!file ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  Step 2: Information
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#171112]">Content Title</label>
                  <input
                    type="text"
                    className="w-full bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium transition-all text-[#171112] placeholder:text-gray-400"
                    placeholder="e.g. Advanced Portrait Lighting Masterclass"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#171112]">Description</label>
                  <textarea
                    className="w-full bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-medium transition-all text-[#171112] placeholder:text-gray-400 min-h-[120px]"
                    placeholder="What will your students learn?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#171112]">Category</label>
                    <PremiumDropdown
                      options={[
                        { value: 'Technology', label: 'Technology', icon: 'devices' },
                        { value: 'Business', label: 'Business', icon: 'payments' },
                        { value: 'Marketing', label: 'Marketing', icon: 'trending_up' },
                        { value: 'Health & Fitness', label: 'Health & Fitness', icon: 'fitness_center' },
                        { value: 'Design', label: 'Design', icon: 'palette' },
                        { value: 'Culinary Arts', label: 'Culinary Arts', icon: 'restaurant' },
                        { value: 'Music', label: 'Music', icon: 'music_note' },
                        { value: 'Personal Development', label: 'Personal Development', icon: 'psychology' },
                        { value: 'Other', label: 'Other', icon: 'more_horiz' },
                      ]}
                      value={category}
                      onChange={setCategory}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#171112]">Level</label>
                    <PremiumDropdown
                      options={[
                        { value: 'Beginner', label: 'Beginner', icon: 'signal_cellular_1_bar' },
                        { value: 'Intermediate', label: 'Intermediate', icon: 'signal_cellular_3_bar' },
                        { value: 'Expert', label: 'Expert', icon: 'signal_cellular_4_bar' },
                      ]}
                      value={level}
                      onChange={setLevel}
                    />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-[#171112]">Pricing Model</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => { setPaymentType('free'); setPrice(0); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${paymentType === 'free'
                        ? 'bg-[#171112] text-white shadow-xl'
                        : 'bg-[#f8f6f6] text-[#876467] hover:bg-gray-200'
                        }`}
                    >
                      <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                      Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('bid')}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${paymentType === 'bid'
                        ? 'bg-[#171112] text-white shadow-xl'
                        : 'bg-[#f8f6f6] text-[#876467] hover:bg-gray-200'
                        }`}
                    >
                      <span className="material-symbols-outlined text-lg">gavel</span>
                      Bidding
                    </button>
                  </div>

                  {paymentType === 'bid' && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-sm font-bold text-[#171112]">Starting Price (NPR)</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">Rs.</span>
                        <input
                          className="w-full pl-12 bg-[#f8f6f6] border-none rounded-2xl focus:ring-2 focus:ring-primary/20 px-5 py-4 text-sm font-black text-[#171112]"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          min="0"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">image</span>
                    Step 3: Thumbnail (Optional)
                  </h3>
                  <div
                    className={`border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${isThumbnailDragging ? 'border-primary bg-primary/5' : 'border-[#e5dcdc] bg-[#f8f6f6] hover:bg-gray-100'}`}
                    onDragOver={handleThumbnailDragOver}
                    onDragLeave={handleThumbnailDragLeave}
                    onDrop={handleThumbnailDrop}
                    onClick={() => document.getElementById('thumbnail-input').click()}
                  >
                    <span className="material-symbols-outlined text-[#876467] text-3xl">add_photo_alternate</span>
                    <p className="text-xs font-bold text-[#171112]">Click to add thumbnail</p>
                    <input
                      id="thumbnail-input"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </div>
                  {thumbnail && (
                    <p className="text-[10px] font-bold text-center text-[#876467]">
                      {thumbnail.name} selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Preview Area */}
            <div className="bg-[#fcfafa] rounded-3xl p-10 flex flex-col items-center justify-center sticky top-0 border border-[#f0e8e9]">
              <div className="w-full max-w-[320px] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 transform rotate-1 scale-105">
                <div className="aspect-video bg-black relative group">
                  {thumbnail ? (
                    <img src={URL.createObjectURL(thumbnail)} alt="preview" className="w-full h-full object-cover" />
                  ) : file ? (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 opacity-20">
                      <span className="material-symbols-outlined text-6xl">play_circle</span>
                    </div>
                  )}
                  {file && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                      <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">New Content</div>
                    <div className="flex items-center gap-1 text-[#876467]">
                      <span className="material-symbols-outlined text-xs">star</span>
                      <span className="text-[10px] font-black">4.9</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-[#171112] line-clamp-1">{title || 'Your Content Title'}</h4>
                  <p className="text-xs text-[#876467] line-clamp-2 leading-relaxed">
                    {description || 'The description will appear here for your students to see...'}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKp2LOu34hcxh7LHZsAo0cTXSQQIWtGnOKsCakyjNAKADpsFWBoK65kszWXCKc5P6Mpc65u7QLHq0ylGKYvV5JIMuoFkBWjCt44tmaCFXL1dXyb6XLbxBNSCO6KKlYUtyECgvK4V9I25fRHqluSissRVhzMHpIwVkvWEw06NOP-FuQ8LecRvSykV3aEWUY9LiUy-rfWAum9gt-h6ZrNAeSvte--O_n9RoeXwh1PzDxGlqPpmoC9KYQ2thKnwVO_2vnY997LNZRVoE')" }}></div>
                    <span className="text-[11px] font-black text-[#171112]">{teacherName || 'Teacher'}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#876467] font-medium mt-10 max-w-[280px] text-center italic">
                This is a live preview of how your course will look to potential students.
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-8 border-t border-gray-100 bg-[#fcfafa] shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={handleDiscard}
              className="text-sm font-black text-[#876467] hover:text-[#171112] transition-colors"
            >
              Discard Changes
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDiscard}
                className="btn-premium btn-secondary py-4 px-10"
              >
                Save Draft
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || !title || isUploading}
                className={`btn-premium btn-primary py-4 px-12 min-w-[200px] ${(!file || !title || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    <span>Uploading {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <span>Publish Content</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
