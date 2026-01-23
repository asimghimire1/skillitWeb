import React from 'react';

export default function PostsView({ posts, teacher, onCreate, onEdit, onDelete }) {

    const canEdit = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffMinutes = (now - created) / 1000 / 60;
        return diffMinutes <= 30;
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#ea2a33]">
                        Posts & Announcements
                    </h2>
                    <p className="text-gray-500 mt-1">Manage your updates and announcements.</p>
                </div>
                <button
                    onClick={onCreate}
                    className="btn-premium btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Post
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center shrink-0"
                                    style={{
                                        backgroundImage: `url('${teacher?.profilePicture || "https://ui-avatars.com/api/?name=" + (teacher?.fullname || "Teacher") + "&background=ea2a33&color=fff"}')`
                                    }}
                                />
                                <div>
                                    <h3 className="font-bold text-[#181111]">{post.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString()} • {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                {/* Only show actions if needed, for now standard edit/delete */}
                            </div>
                        </div>

                        <p className="text-[#564e4e] text-sm mb-6 line-clamp-3">
                            {post.content}
                        </p>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                            <div className="flex gap-2">
                                {canEdit(post.created_at) ? (
                                    <button
                                        onClick={() => onEdit(post)}
                                        className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                                        title="Edit (Available for 30m)"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                ) : (
                                    <span className="p-2 text-gray-300 cursor-not-allowed" title="Edit unavailable (>30m)">
                                        <span className="material-symbols-outlined text-[20px]">edit_off</span>
                                    </span>
                                )}
                                <button
                                    onClick={() => onDelete(post.id)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                        <span className="material-symbols-outlined text-[48px] mb-4 text-gray-300">post_add</span>
                        <p className="text-lg font-medium text-gray-500">No posts yet</p>
                        <p className="text-sm mt-1 mb-6">Share updates and announcements with your students.</p>
                        <button onClick={onCreate} className="btn-premium btn-secondary py-2 px-6">
                            Create First Post
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
