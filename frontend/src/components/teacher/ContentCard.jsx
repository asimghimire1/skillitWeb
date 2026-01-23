import React from 'react';

const ContentCard = ({ upload, teacher, onAction }) => {
    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="aspect-video bg-black relative group/image cursor-pointer shrink-0">
                {upload.videoUrl || (upload.fileUrl && (upload.fileUrl.endsWith('.mp4') || upload.fileUrl.endsWith('.mov'))) ? (
                    <video
                        src={(upload.videoUrl || upload.fileUrl).startsWith('http') ? (upload.videoUrl || upload.fileUrl) : `http://localhost:5000${(upload.videoUrl || upload.fileUrl)}`}
                        poster={upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : null}
                        controls
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <>
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover/image:scale-105"
                            style={{ backgroundImage: `url('${upload.thumbnail ? (upload.thumbnail.startsWith('http') ? upload.thumbnail : `http://localhost:5000${upload.thumbnail}`) : 'https://via.placeholder.com/300?text=No+Thumbnail'}')` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/image:bg-black/30 transition-all">
                            <span className="material-symbols-outlined text-white text-5xl opacity-0 group-hover/image:opacity-100 transform scale-75 group-hover/image:scale-100 transition-all duration-300 drop-shadow-lg">image</span>
                        </div>
                    </>
                )}

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${upload.status === 'published' ? 'bg-white text-[#07885d]' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {upload.status || 'Published'}
                </div>

                {/* Duration Badge */}
                {upload.duration && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm">
                        {upload.duration}
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4 relative">
                {/* Header: Category/New & Rating */}
                <div className="flex justify-between items-start">
                    <div className="bg-[#ea2a33]/10 text-[#ea2a33] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                        {upload.category || 'New Content'}
                    </div>
                    <div className="flex items-center gap-1 text-[#886364]">
                        <span className="material-symbols-outlined text-xs filled">star</span>
                        <span className="text-[10px] font-black">4.9</span>
                    </div>
                </div>

                {/* Title & Description */}
                <div>
                    <h4 className="text-lg font-black text-[#181111] line-clamp-1 mb-1">{upload.title}</h4>
                    <p className="text-xs text-[#886364] line-clamp-2 leading-relaxed h-[2.5em]">
                        {upload.description || 'No description provided.'}
                    </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 w-full"></div>

                {/* Footer: Teacher Info & Actions */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="size-8 rounded-full bg-gray-200 bg-cover bg-center border border-gray-100"
                            style={{ backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || teacher?.fullName || "Teacher") + "&background=ea2a33&color=fff"}')` }}
                        ></div>
                        <span className="text-[11px] font-black text-[#181111]">
                            {teacher?.fullname || teacher?.fullName || 'Teacher'}
                        </span>
                    </div>

                    {onAction && (
                        <button
                            className="size-8 rounded-full bg-gray-50 hover:bg-[#ffe5e7] hover:text-[#ea2a33] flex items-center justify-center text-gray-400 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onAction('deleteContent', upload.id); }}
                            title="Delete content"
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentCard;
