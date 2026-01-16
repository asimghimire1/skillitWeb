import { useState } from 'react';

function Home() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? 'dark' : ''}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Spline Sans', sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out 3s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#211111] dark:via-[#2a1515] dark:to-[#211111] text-gray-900 dark:text-gray-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
          
          {/* Floating Skill Icons */}
          <div className="absolute top-[15%] right-[12%] text-red-500/20 animate-float">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div className="absolute top-[45%] left-[8%] text-blue-500/20 animate-float-delayed">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
            </svg>
          </div>
          <div className="absolute bottom-[30%] right-[18%] text-green-500/20 animate-float">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-.78.78-.78 2.05 0 2.83l4.19 6.01zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
            </svg>
          </div>
          <div className="absolute bottom-[15%] left-[20%] text-orange-500/20 animate-float-delayed">
            <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-8 lg:px-16 py-6 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#ea2a33] to-[#ff5c63] rounded-xl shadow-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-wide">Skillit</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-700 dark:text-gray-300 hover:text-[#ea2a33] dark:hover:text-[#ea2a33] font-semibold transition-colors">
              Browse Skills
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-[#ea2a33] dark:hover:text-[#ea2a33] font-semibold transition-colors">
              Teach
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-[#ea2a33] dark:hover:text-[#ea2a33] font-semibold transition-colors">
              About
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-88px)] py-16">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  <span className="block">Learn Skills.</span>
                  <span className="block">Share Knowledge.</span>
                  <span className="block text-[#ea2a33] drop-shadow-sm">Set Your Price.</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed font-medium">
                  The marketplace for learners and teachers worldwide. Connect with experts, master new skills, and earn money sharing your expertise.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group px-8 py-4 bg-[#ea2a33] hover:bg-[#d41b24] text-white text-lg font-bold rounded-xl shadow-xl shadow-red-500/25 transition-all hover:shadow-2xl hover:shadow-red-500/30 active:scale-95 flex items-center justify-center gap-2">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-lg font-bold rounded-xl transition-all active:scale-95">
                  Login
                </button>
              </div>

              <div className="pt-4 text-sm text-gray-500 dark:text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="underline hover:text-[#ea2a33] transition-colors">Terms of Service</a>
                {' & '}
                <a href="#" className="underline hover:text-[#ea2a33] transition-colors">Privacy Policy</a>.
              </div>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
              {[
                { icon: '🎵', title: 'Music Lessons', desc: 'Master instruments with expert teachers', color: 'from-purple-500 to-pink-500' },
                { icon: '💻', title: 'Tech Skills', desc: 'Learn coding, design, and more', color: 'from-blue-500 to-cyan-500' },
                { icon: '🍳', title: 'Cooking Classes', desc: 'Discover cuisines from around the world', color: 'from-orange-500 to-red-500' },
                { icon: '🏋️', title: 'Fitness Training', desc: 'Get fit with personal trainers', color: 'from-green-500 to-emerald-500' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-16">
          <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#ea2a33] mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-400 font-semibold">Expert Teachers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#ea2a33] mb-2">50K+</div>
                <div className="text-gray-600 dark:text-gray-400 font-semibold">Active Learners</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#ea2a33] mb-2">200+</div>
                <div className="text-gray-600 dark:text-gray-400 font-semibold">Skill Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;