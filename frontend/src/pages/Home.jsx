import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wand2, MonitorPlay, History, Sparkles, Mail, Phone, Video } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ paddingBottom: '4rem', overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#0f172a' }}>
          <Sparkles color="var(--accent-primary)" />
          CreatorAI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ border: 'none', background: 'transparent' }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Create Account</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container" style={{ textAlign: 'center', padding: '6rem 2rem', maxWidth: '900px' }}>
        <h1 className="text-primary hero-gradient-text animate-fade-up-big" style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1', animationDelay: '0.1s' }}>
          Write and Record Faster Than Ever.
        </h1>
        <p className="text-secondary animate-fade-up-big" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto', animationDelay: '0.3s' }}>
          An all-in-one platform for modern content creators. Generate flawless YouTube scripts in seconds using advanced AI, and practice them perfectly with our built-in smart teleprompter.
        </p>
        <div className="animate-fade-up-big" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', animationDelay: '0.5s' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              <Wand2 size={20} /> Access AI Generator
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Creating for Free
            </Link>
          )}
        </div>
      </header>

      {/* Services Section */}
      <section className="container animate-fade-up-big" style={{ padding: '4rem 2rem', animationDelay: '0.7s' }}>
        <h2 className="text-primary" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Our Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-card hover-lift" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'; }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Wand2 size={32} color="var(--accent-primary)" />
            </div>
            <h3 className="text-primary" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI Script Writer</h3>
            <p className="text-secondary">Provide your topic and evidence, and let our AI build a perfect, engaging script tailored exactly to your video's desired duration.</p>
          </div>

          <div className="glass-card hover-lift" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'; }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <MonitorPlay size={32} color="var(--success)" />
            </div>
            <h3 className="text-primary" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Smart Teleprompter</h3>
            <p className="text-secondary">Read your scripts flawlessly with our built-in scrolling teleprompter. Features mirror mode for glass hardware and a webcam overlay.</p>
          </div>

          <div className="glass-card hover-lift" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'; }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <History size={32} color="#8b5cf6" />
            </div>
            <h3 className="text-primary" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Script History</h3>
            <p className="text-secondary">Never lose a brilliant idea. Your entire script history is safely stored in our database so you can view, edit, and use them anytime.</p>
          </div>

          <div className="glass-card hover-lift" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'; }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Video size={32} color="#ec4899" />
            </div>
            <h3 className="text-primary" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Video Recording</h3>
            <p className="text-secondary">Capture your final take perfectly using your webcam directly from the browser. Automatically download your recorded video locally when you finish.</p>
          </div>

        </div>
      </section>

      {/* About Us & Contact */}
      <section className="container animate-fade-up-big" style={{ padding: '4rem 2rem', animationDelay: '1s' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
          
          <div>
            <h2 className="text-primary" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>About Us</h2>
            <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              We are passionate about helping content creators streamline their workflow. Writing scripts from scratch and fumbling over words during recording takes away from the creativity of video production. That's why we built this platform—to handle the heavy lifting so you can focus on being creative and confident on camera.
            </p>
          </div>

          <div className="glass-card hover-lift" style={{ padding: '2.5rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'; }}>
            <h2 className="text-primary" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Get in Touch</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              Have a question or need support with your account? We're here to help. Reach out to us directly through the contact details below.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={24} color="var(--accent-primary)" />
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Call Us</div>
                  <strong className="text-primary" style={{ fontSize: '1.1rem' }}>070577935</strong>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={24} color="var(--accent-primary)" />
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Email Us</div>
                  <strong className="text-primary" style={{ fontSize: '1.1rem' }}>akilatheshan23@gmail.com</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
