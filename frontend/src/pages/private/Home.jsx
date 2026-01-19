import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/HomePage.css';

const HomePage = () => {
  const [notificationCount, setNotificationCount] = useState(0);
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

  const skillsData = [
    {
      id: 1,
      title: 'Photography',
      description: 'Master lighting, composition, and post-processing.',
      mentors: '120+',
      price: 50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzZevrQVfYyTCkpCcb0OnevuONiJMURDIw1SmJfqJOe9WJLk1JBhKIPD99HD_me4kTn6QzBmfzLeOVZ1tTidSLCHaP4hBKLaj63him_0fy8SdYw7qW7oeexmnkzM-qBwPstjijuFlv9iSq738xVFJWZtRnJQXwxS-u4XfdNkMNLjcIjpsAYa5gOZh0SKahxSHNSfY2RRGJg7eTGw5Z-wisj8HKcY1_9adG8y-y7zhDiG4NT6aeNxk3WyfSQ4CJ5pKJvFqqbok7WWA'
    },
    {
      id: 2,
      title: 'Advanced Coding',
      description: 'React, Python, System Architecture & more.',
      mentors: '340+',
      price: 80,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeZ61Y_AJdJo2gDsqi3q3E-NWrjbI-ct3fW7q6HToUUB0vFS5PQJ6TjShRcITlCUF_qZ3J_bywOb7W9vCE7ibgtMyRWIIXO9Y8LaEVixQ3QbT_M6hgfGpEgZ1TgruquR_H2ExfDZydPT_w9qO4gjk0YX7XQT8C7wBwTBNSsozYeNEpWhEpe4DXJQ9BA-3cgzuRK3RewTtwPEfeKVfGUQjCKsUSeYCU8as2-2ZRipsoR-WtjBy5rojAUexyf2zC9ST0XqdG-MISavA'
    },
    {
      id: 3,
      title: 'Public Speaking',
      description: 'Conquer stage fright and articulate your ideas.',
      mentors: '85+',
      price: 40,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqMIhNF5UQcMoCqpGeWhiYwD7FcGBfAjiggKRODyWspg3e15P0KCtXaF9DWRk74R8jpL32IdOPs2kQBQgbU0dAow5Uv9P4RMlktrEFTG8T3WTb6NGSlHw8bTTIMUpYMMCKZOIGGfdho30ony4nKi0hJgho4HaR_zfe8GWCrvJjNCEWwzlbDEByEYKqKqzcb4kWyzYyC6ANfMRdU1EX4U5EkwfM8amMfiixQ3V8HpKKPmUMfxWGUOWnAJ8NS1ijcsA470o0GhCBqYk'
    },
    {
      id: 4,
      title: 'Digital Marketing',
      description: 'SEO, SEM, and social media growth hacking.',
      mentors: '210+',
      price: 60,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY7j-jbSxbR1lOxvFBj0myGuHRC4x0AYXmk17Hjet6nxUl2JoHLudp6gjqaaFabOab0_HJLelRAN0NG4jImmiK_Zrn0vZv_TS8uHuh6S0HwWtzwn62RDbVaKpjTIVyXPOT6XvczwoXWP4P20aoqVNjmE6qpTHX9oymPjRoiSmmOVln7jxJQlyxt2woADkwP6D0eSINSG2rQ4RGcIJ6jbkuyuG0PXKfYLS10d92RcFYQ84ULVkIbJW0okamdPEAKIAz9OvumzwzAGI'
    }
  ];

  const teachersData = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      title: 'Product Design Lead',
      bio: 'I help designers bridge the gap between UI and UX. 10 years experience at top tech firms.',
      rating: 4.9,
      reviews: 120,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDktHx1b5I-E-VWsDYes5VMJjZ2SEZGMOuMJ7eH35mpICO_T_FqPdUXTdpIO4pWZlzi9J418fQZs0I4cZFbSjaDJj6WV0uFKyScyzj1n7jFXa604WJ5xnFvOOud5HskODi9TRfQXxs3beojo8z_uIFqdAIs5U1be1dMH9uMgoSXBV3CHhPouchtvBPHaaIsV65kYX6CmN4vMy0VWaFH5Z6jvEZ_zWkJ_BDYaJBnpMvxAQe7VZdjdKxvEE0CmY1rWcLxC6wboRiYOUY'
    },
    {
      id: 2,
      name: 'Marcus Chen',
      title: 'Senior Developer',
      bio: 'Specializing in React, Node.js, and scaling systems. Let\'s debug your career path together.',
      rating: 5.0,
      reviews: 85,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiRfdk5l9Y2mvE0DxXCCHA9Sva4BOV8gy43NSWi9GUqz8gv8I7MCSGVZCXONq7451JqS0IXUfRWdNoP_bF_rccRI37g7sQsz--EgOuiefDMtVltKmQUeTPm4G_8YIBFnfV4iOj4tQb-JHXn7qT0F5Fe5PgnhqaPYyPjYBMrG4flgQtsrH7ZG5gcGx_-SwpGKZ06Aaz6vgbwoNCnLfJQRcUaB9Kir-xOihQeQ4-NfnmDCcNlWPyhr5fL3pt-8ki0bbuzVuyLl3Usc4'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      title: 'Marketing Strategist',
      bio: 'From startup to IPO. I teach growth marketing strategies that actually work in 2024.',
      rating: 4.8,
      reviews: 203,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBilw5bC17lEA-kqkT7vLgbKeW4y8mSsdTZpeXQ1G524xrNiXijkwYwGov2nZLbRj3cPpPRuphNOTauD1OZqgzzomFXDXm5Pn-0AyjHpQX8Wfec41SA4GrB6QSEKynVsNE3UtzfLYPO5LsIHDB98STgU5CDTOEUae-k0emqy38tELbO613uCAMdH0H2L7RbhwdPblaqCS0m2ADktnAMHl17-2DRARaiK5LWMctGFin7xBtnIV-rzaI-KXf-909Sg3kpkcffJIlq2g'
    }
  ];

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo-section">
            <img 
              src="http://localhost:5000/uploads/images/logo.png" 
              alt="Skillit Logo" 
              className="logo-icon"
            />
          </div>

          {/* Navigation */}
          <nav className="nav-menu">
            <a href="#" className="nav-link">Browse</a>
            <a href="#" className="nav-link">Bid</a>
            <a href="#" className="nav-link">Session</a>
            <a href="#" className="nav-link">Swap</a>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <button 
              onClick={handleLoginClick}
              className="btn-login"
            >
              Login
            </button>
            <button 
              onClick={handleSignupClick}
              className="btn-signup"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">
              Turn Your Skills <br/>
              <span className="hero-highlight">Into Value.</span>
            </h1>
            <p className="hero-description">
              The premium marketplace for exchanging expertise. Join a community of professionals sharing knowledge, growing networks, and earning value.
            </p>
            <div className="hero-buttons">
              <button onClick={() => handleCTAClick('login')} className="btn-primary">Find a Mentor</button>
              <button onClick={() => handleCTAClick('signup')} className="btn-secondary">Become a Pro</button>
            </div>
          </div>
          <div className="hero-image" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop)'
          }}>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="logo-cloud-section">
        <h3 className="section-subtitle">Featured Companies</h3>
        <div className="logo-grid">
          <div className="logo-item">Google</div>
          <div className="logo-item">Microsoft</div>
          <div className="logo-item">Amazon</div>
          <div className="logo-item">Apple</div>
          <div className="logo-item">Meta</div>
          <div className="logo-item">Xoventra</div>
        </div>
      </section>

      {/* Trending Skills */}
      <section className="skills-section">
        <div className="section-header">
          <h2 className="section-title">Trending Skills</h2>
          <a href="#" className="view-all-link">View all →</a>
        </div>
        <div className="skills-grid">
          {skillsData.map(skill => (
            <div key={skill.id} className="skill-card">
              <div className="skill-image" style={{
                backgroundImage: `url(${skill.image})`
              }}></div>
              <div className="skill-content">
                <h3 className="skill-title">{skill.title}</h3>
                <p className="skill-description">{skill.description}</p>
                <div className="skill-footer">
                  <span className="skill-mentors">{skill.mentors} Mentors</span>
                  <span className="skill-price">From ${skill.price}/hr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teachers Section */}
      <section className="teachers-section">
        <div className="section-header">
          <h2 className="section-title">Recommended Teachers</h2>
          <p className="section-subtitle">Top-rated professionals ready to help you grow</p>
        </div>
        <div className="teachers-grid">
          {teachersData.map(teacher => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-avatar" style={{
                backgroundImage: `url(${teacher.avatar})`
              }}></div>
              <h3 className="teacher-name">{teacher.name}</h3>
              <p className="teacher-title">{teacher.title}</p>
              <p className="teacher-bio">"{teacher.bio}"</p>
              <div className="teacher-footer">
                <div className="teacher-rating">
                  ⭐ {teacher.rating} <span className="rating-count">({teacher.reviews})</span>
                </div>
                <button onClick={() => handleCTAClick('login')} className="btn-profile">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section" style={{
        backgroundImage: 'url(https://api.mapbox.com/styles/v1/mapbox/light-v11/static/85.3240,27.7172,12,500x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycW1qbTBzdWcxdmsifQ.rJcFIG214AriISLbB6B5aw)'
      }}>
        <div className="map-overlay"></div>
        <div className="map-content">
          <div>
            <h2 className="section-title">Skills Near You</h2>
            <p className="section-subtitle">Discover workshops and mentors in Kathmandu</p>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search by city or zip code" className="search-input"/>
            <button onClick={() => handleCTAClick('login')} className="search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4 className="footer-title">Skillit</h4>
            <p className="footer-description">The premium marketplace for exchanging expertise.</p>
            <div className="social-icons">
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">in</a>
            </div>
          </div>
          <div className="footer-column">
            <h5 className="footer-heading">Product</h5>
            <a href="#" className="footer-link">Browse</a>
            <a href="#" className="footer-link">Pricing</a>
            <a href="#" className="footer-link">FAQ</a>
          </div>
          <div className="footer-column">
            <h5 className="footer-heading">Company</h5>
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Careers</a>
          </div>
          <div className="footer-column">
            <h5 className="footer-heading">Support</h5>
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">Contact</a>
            <a href="#" className="footer-link">Status</a>
          </div>
          <div className="footer-column">
            <h5 className="footer-heading">Legal</h5>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Cookies</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Skillit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;


