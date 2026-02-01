import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleCTAClick = (target = 'login') => {
    navigate(target === 'signup' ? '/register' : '/login');
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // Trigger for hero content immediately
    const heroContent = document.getElementById('hero-content');
    if (heroContent) heroContent.classList.add('visible');

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white text-charcoal font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-[100] transition-all duration-500 glass-navbar">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Skillit Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold tracking-tight font-display text-charcoal">Skillit</span>
            </div>
            <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-charcoal/60">
              <a href="#" className="hover:text-primary transition-colors">Browse</a>
              <a href="#" className="hover:text-primary transition-colors">Skills</a>
              <a href="#" className="hover:text-primary transition-colors">Sessions</a>
              <a href="#" className="hover:text-primary transition-colors">Bid</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={handleLoginClick} className="text-sm font-bold text-charcoal/60 hover:text-charcoal transition-colors border border-charcoal/10 rounded-full px-6 py-2.5">Log in</button>
            <button onClick={handleSignupClick} className="px-6 py-2.5 bg-charcoal text-white hover:bg-black text-sm font-bold rounded-full transition-all">Sign up</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-gradient-to-br from-primary/5 to-transparent blur-[120px] rounded-full animate-breathe"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-gray-200/20 blur-[100px] rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 reveal-on-scroll" id="hero-content">
            <span className="inline-flex items-center gap-3 px-5 py-2 mb-10 text-[10px] font-extrabold tracking-[0.2em] text-primary uppercase bg-white/50 backdrop-blur-sm border border-primary/10 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              The Future of Learning
            </span>
            <h1 className="text-5xl lg:text-6xl font-display font-extrabold tracking-[-0.03em] leading-[0.9] mb-8 text-gradient-premium pb-2">
              Turn Your Skills<br />Into Value.
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 leading-relaxed mb-12 max-w-lg font-light tracking-wide">
              Exchange expertise in an elite marketplace. Join 10,000+ top professionals today in Nepal.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <button onClick={() => handleCTAClick('login')} className="relative px-10 py-5 bg-gradient-to-b from-[#ff4d55] to-[#ea2a33] text-white font-bold rounded-2xl transition-all btn-3d flex items-center gap-3 group overflow-hidden">
                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <span className="relative z-10">Find a Mentor</span>
                <span className="material-symbols-outlined relative z-10 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button onClick={() => handleCTAClick('signup')} className="px-10 py-5 bg-white/60 hover:bg-white border border-charcoal/5 hover:border-charcoal/10 text-charcoal font-bold rounded-2xl transition-all shadow-sm hover:shadow-md backdrop-blur-sm">
                Become a Pro
              </button>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-6 relative h-[800px] reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
              <div className="relative w-[500px] h-[500px] animate-float z-20">
                <div className="absolute inset-0 rounded-full glass-sphere overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full opacity-30 text-charcoal" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.7,-62.9C50.9,-52.8,49.8,-34.4,54.6,-18.6C59.4,-2.8,70.1,10.4,69.9,23.5C69.7,36.6,58.6,49.6,45.8,58.3C33,67,18.5,71.4,3.3,66.8C-11.9,62.3,-27.8,48.8,-42.6,35.4C-57.4,22,-71.1,8.7,-72.6,-5.5C-74.1,-19.7,-63.4,-34.8,-50.2,-45.4C-37,-56,-21.3,-62.1,-4.2,-56.3C12.9,-50.5,34.5,-73,42.7,-62.9Z" fill="none" stroke="currentColor" strokeWidth="0.5" transform="translate(100 100)"></path>
                    <circle cx="100" cy="100" fill="none" r="60" stroke="currentColor" strokeDasharray="4 4" strokeWidth="0.2"></circle>
                    <circle cx="100" cy="100" fill="none" r="80" stroke="currentColor" strokeWidth="0.1"></circle>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full mix-blend-overlay"></div>
                </div>
                <div className="absolute -right-12 top-20 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white z-30 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">palette</span>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Skill Verified</div>
                      <div className="text-sm font-bold text-charcoal">Design Lead</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-8 bottom-32 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white z-30 animate-float" style={{ animationDuration: '9s' }}>
                  <div className="flex items-center gap-3">
                    <img alt="Mentor" className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKp3iEx7lanvdsfbrubnIXGVPibWotQZX4G9eAdYnboUb7R6WUzoZ7DgbNTeXY7SkOvaKYCbJzSZ3jUqFvRq8hgYt0XqlDxy2DMXsQHKGhDkHwkuAZrSkSdz16BbRIf9baGV83lnlx0oFsw9piQNkObZckQeMPBMuDo_gpYXDo8ddZcPTS6zojH4nH-B-dcvjt5FryePRNvb1v1-VMyp1TJIQQtJnKJlczRvkdpw56eukHdMR58G6TQHbvBdprJmQpHxE-XXNIMHg" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Top Mentor</div>
                      <div className="text-sm font-bold text-charcoal">Sita Sharma</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-10 opacity-60 mix-blend-multiply pointer-events-none">
                <img alt="Mentor and Student" className="w-full h-full object-cover rounded-full blur-[2px] opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2ZtTyM_HXOK8s4hgR2BstHNUcOKnbLcv2T6cRonWzVEpiLtDozDsoaVanE0TjQ1RS9HoAYakPWQu6JtXrg__Pv0gYfUFO0qG2oeRVy-eRMoMzBRiwBQ1MQQmEKtVhVlirL9X-QSqMI_0Itw3r4tDwn1gf_NU6dDXQhbRVnCUft2TLIImTnZjsMEbDTkbOHSjO68zTL1E7ulaP8DsrYmFxiJmJTlO6dL0W9TIZpMaYxLTM6deR6lZDiq3NphtsEuqJ-sXsbZifBn0" style={{ maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)', WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-black/5 bg-white overflow-hidden">
        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center gap-24 py-4 px-12">
            {['Innovation', 'Growth', 'Expertise', 'Network', 'Creativity', 'Future', 'Value'].map((item) => (
              <span key={item} className="text-4xl font-display font-black text-charcoal/10 tracking-tighter hover:text-charcoal/40 transition-colors cursor-default uppercase">{item}</span>
            ))}
          </div>
          <div className="flex absolute top-0 animate-marquee whitespace-nowrap items-center gap-24 py-4 px-12" style={{ left: '100%' }}>
            {['Innovation', 'Growth', 'Expertise', 'Network', 'Creativity', 'Future', 'Value'].map((item) => (
              <span key={item + '-dup'} className="text-4xl font-display font-black text-charcoal/10 tracking-tighter hover:text-charcoal/40 transition-colors cursor-default uppercase">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 reveal-on-scroll">
            <div className="mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 tracking-tight text-charcoal">Trending Skills</h2>
              <p className="text-charcoal/50 text-xl font-light max-w-xl">Curated elite expertise in high demand across global tech and creative industries.</p>
            </div>
            <a href="#" className="group flex items-center gap-3 text-sm font-bold text-primary">
              Explore Entire Universe
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 reveal-on-scroll">
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[3rem] bg-soft-gray min-h-[400px] shadow-sm hover:shadow-2xl transition-all duration-700">
              <img alt="Photography" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTKkWZ06jsiPsONEGsFjSmZfgF-YTxZfTfDVKt1LpHQK8AEf34onniY07rig0vIJh3PM0NZTjWUrOpwdsd9bVv7M1q2Btv1lANaYdmLRC5dKHVDuUb16Xpfb1nS80tFSaAv_dIK-75dJ-VuTGtHqDPGmbg4ELdBV7S9-HEMN2zk_Eab7UCO53hdKzpbgzomVaz_IdQbXuSVbrUAlauESq4ImuW5Wf76TQyeSM-CYQbiL9BXn1ziGVih_4eNbHUSQUAzdMPM7oZ94k" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <span className="w-fit px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">Creative Arts</span>
                <h3 className="text-3xl md:text-4xl font-display font-extrabold mb-6 text-white leading-tight">Visual Storytelling</h3>
                <div className="max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-white/80 text-lg mb-8 leading-relaxed font-light">Direct mentorship from the world's most awarded visual directors and photographers.</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-white/60">From Rs. 2000/hr</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span className="text-sm font-bold text-white">4.9/5 Rating</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 group relative overflow-hidden rounded-[3rem] bg-soft-gray shadow-sm hover:shadow-xl transition-all duration-500 min-h-[200px]">
              <img alt="Coding" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJuX_uT3K_VDUq7aNve2uL2LLx4lrYPuGezIc7EzbZdFc17I3nh-gcNCGFyzL27ogRE4c46g4BaytaqvUuXVYzzhFAJbsHtxzPCMK-UegiLUgDr8iLPP-aOfEYo8HrdcKbxU7GfJqj_LQ4wvCOu-OxBVPVc83yOfQ90VQqZY7tTlIPrGF8NKARO0zW5EYa4TM217Geq1WuGP0ELeNY-A33e6eY9s28VCiut6BxF1xXAenae6Y6z1WSOTVDSTSnaX0_2U5aKQOU2fM" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-center max-w-[65%]">
                <h3 className="text-xl font-display font-extrabold mb-3 text-charcoal">AI &amp; Systems</h3>
                <p className="text-charcoal/60 text-base mb-6 font-light">Architecture, LLMs, and high-scale engineering.</p>
                <button className="w-fit text-sm font-bold text-primary flex items-center gap-2 group/btn">
                  Learn more <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-[3rem] bg-soft-gray shadow-sm hover:shadow-xl transition-all duration-500 min-h-[200px]">
              <img alt="Public Speaking" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGdHS0uxkdMpCZ1pxRCNaVloTO6mw7NRFz_FQfPyVksqJXUC9sUdoH0fipmgEL8LIbyfoatZMarfBGTb0ypNprCizHfkJnOMm5heElsuvbR95C9lgqY6wHvg2c-nTn67-98xMuKVCicvRZOR2f5-azCEOAttt2ptZd3bM7j43WCxMOlvqyrJpDS3qArrN5g_yYGIIKclzizYt8H4tHwXIjxFZkWFq9Sv4HjUXQzAKoORikGtirehGB938dVGw_gbh8OxGSO-98Kg" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-lg font-display font-extrabold text-white">Rhetoric</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">85 Mentors</span>
                  <span className="text-primary material-symbols-outlined font-bold">north_east</span>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-[3rem] bg-soft-gray shadow-sm hover:shadow-xl transition-all duration-500 min-h-[200px]">
              <img alt="Marketing" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqnZiXpjAk9uEJ0osEGBclgoHRo7V960ZtcqXhBXerGdMGmwQB19sbj7ME3d39V9lx5ZSSTs7kIxJatcmao7KddEhQUWOlc304kT-MZidsTARNAJCIYWmeeTsbGVsNy4jUNJZfk-vNlj7codX4Mft0e0NzuUsiRE3XEPLINBwkBrMthaiKG7ENSIUHSbyjSWHFma3HN2wArs9axNpbaNld1w89oNdSMXBEJtmoBEbLjFMLoY4wN0_cAWKZcTIV6ANLKShq6lDbw48" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-lg font-display font-extrabold text-white">Growth</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">210 Mentors</span>
                  <span className="text-primary material-symbols-outlined font-bold">north_east</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-soft-gray overflow-hidden reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center">
            <span className="text-[11px] font-black tracking-[0.5em] uppercase text-primary mb-6 block">Elite Mentorship</span>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-8 tracking-tight text-charcoal">Recommended Mentors</h2>
            <p className="text-charcoal/50 max-w-2xl mx-auto text-xl font-light">Access the specialized knowledge of leaders from Nepal's most innovative organizations.</p>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-10 overflow-x-auto hide-scrollbar pb-12 snap-x px-[10%]">
            {/* Mentor 1 */}
            <div className="min-w-[320px] snap-center group">
              <div className="bg-white p-12 rounded-[3.5rem] border border-black/5 shadow-xl shadow-black/[0.02] h-full transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img alt="Sita Sharma" className="relative w-28 h-28 rounded-[2.5rem] object-cover ring-8 ring-soft-gray group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKp3iEx7lanvdsfbrubnIXGVPibWotQZX4G9eAdYnboUb7R6WUzoZ7DgbNTeXY7SkOvaKYCbJzSZ3jUqFvRq8hgYt0XqlDxy2DMXsQHKGhDkHwkuAZrSkSdz16BbRIf9baGV83lnlx0oFsw9piQNkObZckQeMPBMuDo_gpYXDo8ddZcPTS6zojH4nH-B-dcvjt5FryePRNvb1v1-VMyp1TJIQQtJnKJlczRvkdpw56eukHdMR58G6TQHbvBdprJmQpHxE-XXNIMHg" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-charcoal">Sita Sharma</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Product Design @ Khalti</p>
                  <p className="text-charcoal/60 mb-8 leading-relaxed italic text-sm font-light">
                    "Bridging the gap between human psychology and digital interfaces."
                  </p>
                  <button onClick={() => handleCTAClick('login')} className="w-full py-4 bg-soft-gray text-charcoal hover:bg-primary hover:text-white transition-all duration-300 font-bold rounded-2xl flex items-center justify-center gap-2 group/btn text-sm">
                    View Expert Profile
                    <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Mentor 2 */}
            <div className="min-w-[320px] snap-center group">
              <div className="bg-white p-12 rounded-[3.5rem] border border-black/5 shadow-xl shadow-black/[0.02] h-full transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img alt="Aarav Bhattarai" className="relative w-28 h-28 rounded-[2.5rem] object-cover ring-8 ring-soft-gray group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLxjZG4u8bFSrIhRdj1MtOgcFOmhnLRqn5uW2XUH866dFTb51JzrLmpsiNDrAyjnKvYKJQ2kl1HIssu3tBMqWjXJIfN31n74XiKla2AK30KPekazOxPGE4nxhczIWm_moI6IkMbhmsMTbbP7QYGsHaU11ssf6w5CLQIdVq7blzApYGCSjzOWnKv3wDkHqS8gsgp1U-Fs82ykO_fKAGopW2iF1zfQTkVBl2xNjULRn-M96-3qWysJ8cdFbq_ocHZiT11yr2PQ6F6A8" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-charcoal">Asim Ghimire</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">CEO @ XOVENTRA</p>
                  <p className="text-charcoal/60 mb-8 leading-relaxed italic text-sm font-light">
                    "Specializing in high-scale distributed systems and architecture."
                  </p>
                  <button onClick={() => handleCTAClick('login')} className="w-full py-4 bg-soft-gray text-charcoal hover:bg-primary hover:text-white transition-all duration-300 font-bold rounded-2xl flex items-center justify-center gap-2 group/btn text-sm">
                    View Expert Profile
                    <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Mentor 3 */}
            <div className="min-w-[320px] snap-center group">
              <div className="bg-white p-12 rounded-[3.5rem] border border-black/5 shadow-xl shadow-black/[0.02] h-full transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img alt="Priya Karki" className="relative w-28 h-28 rounded-[2.5rem] object-cover ring-8 ring-soft-gray group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvruiR72_8U47ADtzqne5qn_ZCKiXjy3ePs7DIPXCnb6rUd2nLn-vt3LYFfn69QNcybDT_90AUImExW-KZS_6VhDkrbYqTw_cZS6ozccy_A1_OKwJmtyYBEdbyfDCK4oy3e_FobBFG39vN4ZdobxiNal_-NEvlg-dWVHvuu7yfAowW5FO552RjHDUmRGwb7C8mUyH9K86Jn2FcBMx0PwEApQs1QQxsXIq62lu8cApeuiIVzX9dHlaDDPJmtXMMKd7ZYhaNvhiN46U" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-400 border-4 border-white rounded-full shadow-lg"></div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-charcoal">Priya Karki</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Growth VP @ Daraz</p>
                  <p className="text-charcoal/60 mb-8 leading-relaxed italic text-sm font-light">
                    "Mastering viral loops and retention through data-driven creativity."
                  </p>
                  <button onClick={() => handleCTAClick('login')} className="w-full py-4 bg-soft-gray text-charcoal hover:bg-primary hover:text-white transition-all duration-300 font-bold rounded-2xl flex items-center justify-center gap-2 group/btn text-sm">
                    View Expert Profile
                    <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden bg-white reveal-on-scroll">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-10 tracking-tighter text-charcoal">Find Your Passion.</h2>
          <p className="text-charcoal/40 uppercase tracking-[0.6em] text-[11px] font-black mb-16">Search for skills to learn or share</p>
          <div className="relative group max-w-3xl mx-auto">
            <div className="relative flex flex-col md:flex-row gap-4 p-4 red-glow-card rounded-[2.5rem] transition-all duration-500 focus-within:shadow-[0_0_70px_-10px_rgba(234,42,51,0.2)]">
              <div className="flex-grow flex items-center px-8">
                <span className="material-symbols-outlined text-primary mr-5 text-2xl">search</span>
                <input className="w-full bg-transparent border-none focus:ring-0 text-2xl py-6 placeholder:text-charcoal/20 font-light text-charcoal" placeholder="What do you want to learn?" type="text" />
              </div>
              <button className="px-14 py-6 bg-primary text-white hover:bg-red-600 font-bold rounded-[1.8rem] transition-all shadow-xl shadow-primary/20 text-lg">
                Discover Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white pt-24 pb-20 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-20 mb-32">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-12">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Skillit Logo" className="h-12 w-auto" />
                  <span className="text-4xl font-bold tracking-tighter font-display text-charcoal">Skillit</span>
                </div>
              </div>
              <p className="text-charcoal/50 max-w-sm mb-12 text-xl font-light leading-relaxed">
                Elevating professional excellence through direct, peer-to-peer skill exchange on a global scale.
              </p>
              <div className="flex gap-4">
                {/* Social Icons */}
                <a href="#" className="w-14 h-14 rounded-2xl bg-soft-gray flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-black/5">
                  <span className="material-symbols-outlined">public</span>
                </a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-soft-gray flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-black/5">
                  <span className="material-symbols-outlined">group</span>
                </a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-soft-gray flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-black/5">
                  <span className="material-symbols-outlined">chat</span>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-black mb-10 uppercase text-[11px] tracking-[0.4em] text-charcoal">Platform</h5>
              <ul className="space-y-6 text-sm font-medium text-charcoal/50">
                <li><a href="#" className="hover:text-primary transition-colors">Experts Library</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Exchange Model</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Enterprise Tier</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support Lab</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black mb-10 uppercase text-[11px] tracking-[0.4em] text-charcoal">Company</h5>
              <ul className="space-y-6 text-sm font-medium text-charcoal/50">
                <li><a href="#" className="hover:text-primary transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Manifesto</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Career Path</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Newsroom</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black mb-10 uppercase text-[11px] tracking-[0.4em] text-charcoal">Legal</h5>
              <ul className="space-y-6 text-sm font-medium text-charcoal/50">
                <li><a href="#" className="hover:text-primary transition-colors">Trust Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Protocol</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-16 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] text-charcoal/30 font-black tracking-[0.2em] uppercase">© 2026 SKILLIT GLOBAL INC. BEYOND LIMITS.</p>
            <div className="flex gap-10 text-[11px] text-charcoal/30 font-black uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-charcoal transition-colors">Status</a>
              <a href="#" className="hover:text-charcoal transition-colors">Legal</a>
              <a href="#" className="hover:text-charcoal transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
