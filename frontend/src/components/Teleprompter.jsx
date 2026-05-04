import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, Plus, Minus, ArrowLeft, Maximize, ZoomIn, ZoomOut, MonitorSmartphone, Video, Square } from 'lucide-react';

const Teleprompter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { script, durationMinutes } = location.state || { script: 'No script provided.', durationMinutes: 1 };
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(64);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isMirrored, setIsMirrored] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const requestRef = useRef();
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  
  // Strip HTML for pure text reading if needed, but we can also just render HTML and scroll the div.
  const cleanScript = script.replace(/<[^>]+>/g, ' ');
  const wordCount = cleanScript.split(/\s+/).filter(w => w.length > 0).length;
  
  // Calculate base speed (pixels per frame) based on WPM and container height
  // Average WPM = 130
  // Total Target Seconds = durationMinutes * 60
  // Base Speed needs to scroll the entire content height within Target Seconds.
  
  const animate = () => {
    if (isPlaying && contentRef.current && containerRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const totalSeconds = durationMinutes * 60;
      const fps = 60; // Assuming 60fps for requestAnimationFrame
      const baseSpeedPerFrame = contentHeight / (totalSeconds * fps);
      
      const currentSpeed = baseSpeedPerFrame * speedMultiplier;
      
      scrollPositionRef.current += currentSpeed;
      
      // Stop when reached the end
      if (scrollPositionRef.current > contentHeight) {
        setIsPlaying(false);
      } else {
        containerRef.current.scrollTop = scrollPositionRef.current;
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, speedMultiplier, durationMinutes]);

  useEffect(() => {
    let stream;
    if (showWebcam) {
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2
        }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => console.error("Webcam/Mic error:", err));
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showWebcam]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const increaseSpeed = () => setSpeedMultiplier(prev => prev + 0.1);
  const decreaseSpeed = () => setSpeedMultiplier(prev => Math.max(0.1, prev - 0.1));
  const increaseFont = () => setFontSize(prev => prev + 4);
  const decreaseFont = () => setFontSize(prev => Math.max(16, prev - 4));
  const toggleMirror = () => setIsMirrored(!isMirrored);
  const toggleWebcam = () => setShowWebcam(!showWebcam);
  
  const handleRecordToggle = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      if (!showWebcam || !videoRef.current || !videoRef.current.srcObject) {
        alert("Please turn on your webcam first using the camera icon before recording!");
        return;
      }
      
      recordedChunksRef.current = [];
      const stream = videoRef.current.srcObject;
      
      if (stream.getAudioTracks().length === 0) {
        alert("No microphone detected! Please click the webcam icon to turn it OFF and ON again, and make sure to click 'Allow' for microphone access.");
        setIsRecording(false);
        return;
      }
      
      try {
        // Request high quality bitrates (2.5 Mbps video, 128 kbps audio)
        const options = {
          videoBitsPerSecond: 2500000,
          audioBitsPerSecond: 128000
        };
        mediaRecorderRef.current = new MediaRecorder(stream, options);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.style = 'display: none';
          a.href = url;
          a.download = `teleprompter-recording-${new Date().getTime()}.webm`;
          a.click();
          window.URL.revokeObjectURL(url);
          recordedChunksRef.current = [];
        };
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error starting recording:", err);
        alert("Failed to start recording. Your browser may not support this format.");
      }
    }
  };
  
  return (
    <div className={`teleprompter-mode teleprompter-container ${isMirrored ? 'mirrored' : ''}`}>
      <div style={{ padding: '1rem', position: 'absolute', zIndex: 10 }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div 
        className="teleprompter-text" 
        ref={containerRef} 
        style={{ fontSize: `${fontSize}px` }}
      >
        <div 
          className="teleprompter-content" 
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: script }}
          style={{ paddingTop: '50vh' }} // Start reading from the middle
        />
      </div>

      {showWebcam && (
        <div className={`webcam-container ${isMirrored ? 'mirrored' : ''} ${isRecording ? 'recording-frame' : ''}`}>
          <video ref={videoRef} autoPlay playsInline muted className="webcam-video" />
          {isRecording && <div className="recording-indicator">REC</div>}
        </div>
      )}

      <div className={`teleprompter-controls ${isMirrored ? 'mirrored' : ''}`}>
        <button className="control-btn" onClick={decreaseSpeed} title="Slow Down"><Minus size={20} /></button>
        <button className="control-btn" onClick={togglePlay} style={{ width: '64px', height: '64px', background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button className="control-btn" onClick={increaseSpeed} title="Speed Up"><Plus size={20} /></button>
        
        <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)', margin: '0 1rem' }}></div>
        
        <button className="control-btn" onClick={decreaseFont} title="Decrease Font"><ZoomOut size={20} /></button>
        <button className="control-btn" onClick={increaseFont} title="Increase Font"><ZoomIn size={20} /></button>
        
        <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)', margin: '0 1rem' }}></div>
        
        <button className="control-btn" onClick={toggleMirror} title="Mirror Mode" style={{ background: isMirrored ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
          <Maximize size={20} />
        </button>
        <button className="control-btn" onClick={toggleWebcam} title="Toggle Webcam" style={{ background: showWebcam ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
          <MonitorSmartphone size={20} />
        </button>
        
        <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)', margin: '0 1rem' }}></div>
        
        <button 
          className="control-btn" 
          onClick={handleRecordToggle} 
          title={isRecording ? "Stop Recording & Save" : "Record Video"}
          style={{ 
            background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            borderColor: isRecording ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
            color: isRecording ? '#ef4444' : 'white',
          }}
        >
          {isRecording ? <Square size={20} fill="currentColor" /> : <Video size={20} />}
        </button>
        
        <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
          {wordCount} words | {durationMinutes} min | Speed: {speedMultiplier.toFixed(1)}x
        </div>
      </div>
    </div>
  );
};

export default Teleprompter;
