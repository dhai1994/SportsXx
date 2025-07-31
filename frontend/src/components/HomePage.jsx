import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/homePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`/api/v1/videos/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        let errMsg = `Server error: ${res.status}`;
        try {
          const errObj = await res.json();
          errMsg = errObj?.error || errMsg;
        } catch {}
        setSearchResults([]);
        alert("Search failed: " + errMsg);
        return;
      }
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      setSearchResults([]);
      alert("Could not process search: " + err.message);
      console.error("Search error:", err);
    }
  };

  const handleMenuClick = (path) => {
    setMenuOpen(false);
    if (path === "logout") {
      logout();
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is SportsX?",
      answer: "SportsX is a platform for athletes and fans to share, discover, and celebrate sports highlights. Whether you're a player looking to showcase your skills or a fan wanting to follow your favorite athletes, SportsX connects the sports community."
    },
    {
      question: "How do I upload videos?",
      answer: "Simply click on the 'Upload Video' option in the menu or navigate to the upload page. You can upload videos up to 5 minutes long in MP4 format. Our system will process your video and make it available to the community."
    },
    {
      question: "Can I follow my favorite players?",
      answer: "Yes! You can follow any verified athlete on SportsX to get notified when they post new content. Go to any player's profile and click the 'Follow' button to stay updated with their latest highlights."
    },
    {
      question: "Is it free to use?",
      answer: "SportsX is completely free for basic usage. We may offer premium features in the future, but the core functionality of uploading, watching, and sharing sports highlights will always remain free."
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <nav className="navbar">
          <div className="navbar-container">
            <h1 className="brand">SportsX</h1>
            <div className="nav-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search players or highlights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>
                  <i className="search-icon">🔍</i>
                </button>
              </div>
              <div className="user-menu">
                <button 
                  className="user-avatar" 
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{ backgroundImage: user?.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}
                >
                  {!user?.avatar && (user?.name?.charAt(0) || '👤')}
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <div className="user-info">
                      <h4>{user?.name || 'User'}</h4>
                      <p>@{user?.username || 'username'}</p>
                    </div>
                    <div className="menu-item" onClick={() => handleMenuClick("/update-account")}>
                      <span>✏️</span> Update Profile
                    </div>
                    <div className="menu-item" onClick={() => handleMenuClick("/change-password")}>
                      <span>🔒</span> Change Password
                    </div>
                    <div className="menu-item" onClick={() => handleMenuClick("/upload")}>
                      <span>⬆️</span> Upload Video
                    </div>
                    <div className="menu-item" onClick={() => handleMenuClick(`/c/${user?.username}`)}>
                      <span>👤</span> My Profile
                    </div>
                    <div className="menu-divider"></div>
                    <div className="menu-item logout" onClick={() => handleMenuClick("logout")}>
                      <span>🚪</span> Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1>Elevate Your Game with <span>SportsX</span></h1>
            <p className="hero-subtitle">
              {user ? `Welcome back, ${user.name}! Ready to discover today's best highlights?` 
                   : 'Join the community of athletes and fans sharing their passion for sports'}
            </p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => navigate("/explore")}>
                Explore Highlights
              </button>
              {!user && (
                <button className="btn-secondary" onClick={() => navigate("/register")}>
                  Join Now - It's Free
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="search-results-section">
          <div className="section-container">
            <h2 className="section-title">Search Results</h2>
            <div className="video-grid">
              {searchResults.map((video) => (
                <div key={video._id} className="video-card" onClick={() => navigate(`/v/${video._id}`)}>
                  <div className="video-thumbnail">
                    <video src={video.videoUrl} muted />
                    <div className="play-overlay">▶</div>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p className="uploader">By {video.uploaderName}</p>
                    <p className="video-stats">👁️ {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Sections */}
      <section className="features-section">
        <div className="section-container">
          <div className="feature-card">
            <div className="feature-media">
              <video src="/videos/kohli.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="feature-text">
              <h2>Legendary Moments</h2>
              <p>Relive the greatest plays from sports history and current matches. Our curated collections showcase the skill, passion, and drama that make sports unforgettable.</p>
              <button className="btn-outline" onClick={() => navigate("/highlights")}>
                Browse Highlights
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section alt">
        <div className="section-container">
          <div className="feature-card reverse">
            <div className="feature-media">
              <img src="thirdimg.jpg" alt="Upload Section" />
            </div>
            <div className="feature-text">
              <h2>Your Moment to Shine</h2>
              <p>Upload your best plays with our simple tools. Get noticed by scouts, coaches, and fans. Share your journey and build your sports legacy.</p>
              <button className="btn-outline" onClick={() => navigate("/upload")}>
                Start Uploading
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-container">
          <div className="feature-card">
            <div className="feature-media">
              <video src="/videos/video2.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="feature-text">
              <h2>Watch Anywhere</h2>
              <p>Stream seamlessly across all your devices. Our adaptive technology ensures the best viewing experience whether you're on mobile, tablet, or desktop.</p>
              <div className="app-badges">
                <span>Available on:</span>
                <div className="badge">iOS</div>
                <div className="badge">Android</div>
                <div className="badge">Web</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section alt">
        <div className="section-container">
          <div className="feature-card reverse">
            <div className="feature-media">
              <img src="https://img.freepik.com/premium-photo/children-playing-outdoor-sports_1270664-25477.jpg" alt="Kids Playing" />
            </div>
            <div className="feature-text">
              <h2>Inspire the Next Generation</h2>
              <p>Young athletes can follow their role models, learn from their techniques, and dream big. Our family-friendly platform makes sports accessible to all ages.</p>
              <button className="btn-outline" onClick={() => navigate("/discover")}>
                Discover Athletes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <h3>{item.question}</h3>
                  <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>SportsX</h2>
            <p>Connecting athletes and fans through the power of sports.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Company</h4>
              <a href="/about">About</a>
              <a href="/careers">Careers</a>
              <a href="/blog">Blog</a>
            </div>
            <div className="link-column">
              <h4>Support</h4>
              <a href="/help">Help Center</a>
              <a href="/safety">Safety</a>
              <a href="/contact">Contact</a>
            </div>
            <div className="link-column">
              <h4>Legal</h4>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SportsX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;