import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Bot } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, googleLogin, facebookLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';
    
    if (clientId === 'your_google_client_id_here') {
      const mockEmail = prompt("Development Mode: Enter any Gmail address to simulate sign-up:", "test@gmail.com");
      if (mockEmail) {
        setLoading(true);
        googleLogin(`mock_token_${mockEmail}`).then(result => {
          if (result.success) navigate('/dashboard');
          else setError(result.error);
          setLoading(false);
        });
      }
      return;
    }

    if (window.google) {
      window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            setLoading(true);
            const result = await googleLogin(tokenResponse.access_token);
            if (result.success) navigate('/dashboard');
            else setError(result.error);
            setLoading(false);
          }
        },
      }).requestAccessToken();
    } else {
      setError('Google Login service is still loading. Please try again in a moment.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-left-bg-circles"></div>
          {/* Using a placeholder bot icon layout to match the provided image */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Bot size={120} color="#3b82f6" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
            <div style={{ background: '#3b82f6', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '20px', marginTop: '2rem', fontSize: '0.9rem', boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)' }}>
              Hello, Can you help me?
            </div>
            <div style={{ background: '#1e2538', color: 'white', padding: '1rem', borderRadius: '15px', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '250px' }}>
              <strong style={{ color: '#3b82f6', fontSize: '0.8rem' }}>CreatorAI!</strong>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', lineHeight: '1.4' }}>Sure, CreatorAI is ready to help you sign up.</p>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Bot size={24} />
            </div>
          </div>
          <h2 className="auth-title">Welcome to Sign Up <span>CreatorAI!</span></h2>
          <p className="auth-subtitle">Please enter your details to create an account.</p>
          
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <User className="auth-form-icon" />
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Enter your name"
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="auth-form-group">
              <Mail className="auth-form-icon" />
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="auth-form-group">
              <Lock className="auth-form-icon" />
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Enter your password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength="6"
              />
            </div>
            
            <div className="auth-terms">
              <input type="checkbox" required id="terms" />
              <label htmlFor="terms">I agree to <Link to="#">Terms of Conditions</Link> and <Link to="#">Privacy Policy</Link></label>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social-btns">
            <button type="button" className="auth-btn-social" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
          </div>

          <div className="auth-links-bottom">
            <Link to="#">Terms of Service</Link>
            <Link to="#">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
