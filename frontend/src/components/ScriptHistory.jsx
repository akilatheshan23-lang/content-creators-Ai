import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, Clock, Trash2 } from 'lucide-react';

const ScriptHistory = ({ onSelectScript }) => {
  const { user } = useContext(AuthContext);
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scriptToDelete, setScriptToDelete] = useState(null);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/scripts', config);
        setScripts(data);
      } catch (error) {
        console.error('Error fetching scripts', error);
      }
      setLoading(false);
    };
    fetchScripts();
  }, [user]);

  const confirmDelete = async () => {
    if (!scriptToDelete) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/scripts/${scriptToDelete}`, config);
      setScripts(scripts.filter(s => s._id !== scriptToDelete));
    } catch (error) {
      console.error('Error deleting script', error);
      alert('Failed to delete script');
    }
    setScriptToDelete(null);
  };

  const handleDeleteClick = (e, scriptId) => {
    e.stopPropagation();
    setScriptToDelete(scriptId);
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading history...</div>;
  if (scripts.length === 0) return <div style={{ color: 'var(--text-secondary)' }}>No saved scripts yet. Generate one above to see it here!</div>;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {scripts.map((script, index) => (
          <div 
            key={script._id} 
            className="glass-card animate-fade-in" 
            style={{ 
              padding: '1.5rem', 
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              position: 'relative',
              animationDelay: `${index * 0.08}s`,
              animationFillMode: 'both'
            }} 
            onClick={() => onSelectScript(script)} 
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.15)';
            }} 
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '85%' }}>
                <FileText size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{script.topic}</h4>
              </div>
              <button 
                onClick={(e) => handleDeleteClick(e, script._id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                title="Delete Script"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              <Clock size={14} />
              <span>{script.durationMinutes} min • {script.wordCount} words</span>
            </div>
            
            <button 
              className="btn btn-outline" 
              style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem' }}
            >
              Load & Edit
            </button>
          </div>
        ))}
      </div>

      {scriptToDelete && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Trash2 size={32} color="var(--danger)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Delete Script?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Are you sure you want to permanently delete this script? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setScriptToDelete(null)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn"
                style={{ flex: 1, backgroundColor: 'var(--danger)', color: 'white', border: 'none' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScriptHistory;
