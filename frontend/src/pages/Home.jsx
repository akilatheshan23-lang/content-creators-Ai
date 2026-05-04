import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Force fusion theme on mount
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.add('fusion-body');
    return () => {
      document.body.classList.remove('fusion-body');
    };
  }, []);

  return (
    <div className="fusion-container">
      {/* Navigation */}
      <nav className="fusion-nav animate-slide-down">
        <div className="fusion-logo">
          <img src="/logo-transparent.png" alt="CreatorAI Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          CreatorAI
        </div>
        <div className="fusion-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="fusion-nav-actions">
          <div className="fusion-search">
            <Search size={16} color="#4b5563" />
            <input type="text" placeholder="Search" />
          </div>
          {user ? (
            <Link to="/dashboard" className="fusion-btn">Dashboard</Link>
          ) : (
            <Link to="/login" className="fusion-btn">Login</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="fusion-hero">
        <div className="fusion-hero-content">
          <h3 className="fusion-subtitle">THE NEW</h3>
          <h1 className="fusion-title fusion-animated-title">
            ARTIFICIAL<br/>INTELLIGENCE<br/>
          </h1>
          <h1 className="fusion-title-sm">PLATFORM</h1>
          <p className="fusion-desc">
            Experience the future of content creation. Generate flawless YouTube scripts instantly with generative AI, and practice them using our smart teleprompter directly from your browser.
          </p>
          <button className="fusion-btn-blue" onClick={() => navigate(user ? '/dashboard' : '/register')}>READ MORE</button>
        </div>
        <div className="fusion-hero-image-container">
          <img src="/hero-bird.png" alt="Vibrant AI Platform" className="fusion-hero-img" />
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="fusion-section">
        <h2 className="fusion-section-title">Our Services</h2>
        <div className="fusion-grid">
          <div className="fusion-card">
            <h3>AI Script Writer</h3>
            <p>Provide your topic and evidence, and let our AI build a perfect, engaging script tailored exactly to your video's desired duration.</p>
          </div>
          <div className="fusion-card">
            <h3>Smart Teleprompter</h3>
            <p>Read your scripts flawlessly with our built-in scrolling teleprompter. Features mirror mode for glass hardware and a webcam overlay.</p>
          </div>
          <div className="fusion-card">
            <h3>Script History</h3>
            <p>Never lose a brilliant idea. Your entire script history is safely stored in our database so you can view, edit, and use them anytime.</p>
          </div>
          <div className="fusion-card">
            <h3>Video Recording</h3>
            <p>Capture your final take perfectly using your webcam directly from the browser. Automatically download your recorded video locally when you finish.</p>
          </div>
        </div>
      </section>

      {/* About Us & Contact */}
      <section id="about" className="fusion-section fusion-footer" style={{ paddingBottom: '8rem' }}>
        <div className="fusion-split">
          
          <div className="fusion-about">
            <h2 className="fusion-section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>About Us</h2>
            <p className="fusion-desc" style={{ margin: 0, maxWidth: '100%' }}>
              We are passionate about helping content creators streamline their workflow. Writing scripts from scratch and fumbling over words during recording takes away from the creativity of video production. That's why we built this platform—to handle the heavy lifting so you can focus on being creative and confident on camera.
            </p>
          </div>

          <div id="contact" className="fusion-card" style={{ padding: '3rem' }}>
            <h2 className="fusion-section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Get in Touch</h2>
            <div className="fusion-contact-item" style={{ marginBottom: '2rem' }}>
              <div>
                <div className="fusion-contact-label">Call Us</div>
                <div className="fusion-contact-value">0705777925</div>
              </div>
            </div>
            <div className="fusion-contact-item">
              <div>
                <div className="fusion-contact-label">Email Us</div>
                <div className="fusion-contact-value">shanweerashingha0@gmail.com</div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
