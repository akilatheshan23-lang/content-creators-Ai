import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, History, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScriptGenerator from '../components/ScriptGenerator';
import ScriptHistory from '../components/ScriptHistory';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [selectedScript, setSelectedScript] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <p className="welcome-text">
            Welcome back, <span className="animate-shimmer" style={{ fontWeight: '700' }}>{user?.name}</span>
          </p>
        </div>
        <div className="dashboard-header-actions">
          <button onClick={() => navigate('/')} className="btn btn-outline" style={{ color: 'var(--text-primary)', borderColor: 'var(--glass-border)' }}>
            <Home size={18} /> Home
          </button>
          <button onClick={logout} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ✨ AI Script Generator
        </h2>
        <ScriptGenerator selectedScript={selectedScript} />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={24} color="var(--accent-primary)" /> Your Script History
        </h2>
        <ScriptHistory onSelectScript={setSelectedScript} />
      </div>
    </div>
  );
};

export default Dashboard;
