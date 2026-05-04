import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wand2, PlayCircle, Save } from 'lucide-react';

const ScriptGenerator = ({ selectedScript }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState('');
  const [evidence, setEvidence] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [scriptId, setScriptId] = useState(null);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (selectedScript) {
      setTopic(selectedScript.topic);
      setEvidence(selectedScript.evidence || '');
      setDurationMinutes(selectedScript.durationMinutes);
      setGeneratedScript(selectedScript.content);
      setScriptId(selectedScript._id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedScript]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/scripts/generate',
        { topic, evidence, durationMinutes },
        config
      );
      
      setGeneratedScript(data.content);
      setScriptId(data._id);
    } catch (error) {
      // Show cleaner error message instead of raw JSON
      let msg = 'Error generating script';
      if (error.response?.data?.message) {
        try {
          const parsed = JSON.parse(error.response.data.message);
          msg = parsed.error?.message || error.response.data.message;
        } catch(e) {
          msg = error.response.data.message;
        }
      }
      setError(msg);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!scriptId) return;
    setSaveSuccess(false);
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      await axios.put(
        `http://localhost:5000/api/scripts/${scriptId}`,
        { content: generatedScript },
        config
      );
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setError('Failed to save changes');
    }
  };

  const launchTeleprompter = () => {
    if (generatedScript) {
      navigate('/teleprompter', { 
        state: { 
          script: generatedScript, 
          durationMinutes 
        } 
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label className="form-label">Video Topic</label>
          <input 
            type="text" 
            className="form-input" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Top 10 Destinations in Japan"
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Target Duration (Minutes)</label>
          <input 
            type="number" 
            className="form-input" 
            value={durationMinutes} 
            onChange={(e) => setDurationMinutes(e.target.value)}
            min="1"
            max="60"
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Evidence / Key Points</label>
          <textarea 
            className="form-textarea" 
            value={evidence} 
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Paste your research, links, or bullet points here..."
            required 
          />
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid var(--danger)' }}>{error}</div>}
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Wand2 size={20} /> {loading ? 'Creating...' : 'Generate Script'}
        </button>
      </form>

      {generatedScript && (
        <div style={{ marginTop: '3rem' }} className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Your Script</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleSave} className="btn btn-outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                <Save size={18} /> {saveSuccess ? 'Saved!' : 'Save Edits'}
              </button>
              <button onClick={launchTeleprompter} className="btn btn-primary">
                <PlayCircle size={18} /> Launch Teleprompter
              </button>
            </div>
          </div>
          
          <div style={{ background: 'var(--bg-primary)', borderRadius: '8px' }}>
            <textarea 
              className="form-textarea"
              value={generatedScript} 
              onChange={(e) => setGeneratedScript(e.target.value)} 
              style={{ minHeight: '400px', width: '100%', fontSize: '16px', lineHeight: '1.6' }}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="toast-notification">
          <Wand2 size={24} className="spinner" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '1rem' }}>Creating Script...</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>This may take a few seconds.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptGenerator;
