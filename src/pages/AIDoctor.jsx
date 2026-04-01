import { useState, useEffect, useRef } from 'react';
import { chatbotAPI } from '../services/api';
import styles from './AIDoctor.module.css';

export default function AIDoctor() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Speech Recognition (Web Speech API)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        handleUserMessage(text);
      };
      recognition.onerror = (e) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        drawOpenCVMock();
      }
    } catch (err) {
      alert("Camera/Mic permissions required for live AI Doctor session.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      setCameraActive(false);
    }
  };

  // Fake OpenCV scanning effect
  const drawOpenCVMock = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const draw = () => {
      if (!cameraActive) return;
      ctx.clearRect(0, 0, 300, 300);
      ctx.strokeStyle = '#5B6EF5';
      ctx.lineWidth = 2;
      const size = 150 + Math.sin(Date.now() / 200) * 20;
      ctx.strokeRect(150 - size/2, 150 - size/2, size, size);
      requestAnimationFrame(draw);
    };
    draw();
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    } else {
      alert("Speech Recognition not supported in this browser.");
    }
  };

  const handleUserMessage = async (msg) => {
    setIsSpeaking(true);
    setResponse("Thinking...");
    const { reply } = await chatbotAPI.sendMessage(msg);
    setResponse(reply);
    
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);
    
    // Pick a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google UK English Female'));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Live AI Doctor Session</h1>
      <p className={styles.subtitle}>Real-time voice and visual health consultation</p>

      <div className={styles.doctorContainer}>
        <div className={styles.visuals}>
          <div className={styles.videoWrapper}>
            <video ref={videoRef} autoPlay playsInline muted className={styles.videoElement} style={{ display: cameraActive ? 'block' : 'none' }}></video>
            <canvas ref={canvasRef} width="300" height="300" className={styles.canvasOverlay}></canvas>
            {!cameraActive && (
              <div className={styles.cameraPlaceholder}>
                <span style={{ fontSize: '3rem' }}>📷</span>
                <p>Camera Off</p>
              </div>
            )}
            {cameraActive && <div className={styles.openCVBadge}>OpenCV Analysis Active</div>}
          </div>

          <div className={styles.controls}>
            {cameraActive ? (
              <button className={styles.btnDanger} onClick={stopCamera}>End Session</button>
            ) : (
              <button className={styles.btnPrimary} onClick={startCamera}>Start Consultation</button>
            )}
          </div>
        </div>

        <div className={styles.interaction}>
          <div className={styles.chatBox}>
            <div className={styles.messageRow}>
              <strong>You: </strong> {transcript || "..."}
            </div>
            <div className={styles.messageRow} style={{ color: '#5B6EF5' }}>
              <strong>AI Doctor: </strong> {response || "Hello! How can I help you today?"}
            </div>
          </div>
          
          <button 
            className={`${styles.micBtn} ${isListening ? styles.listening : ''}`} 
            onClick={startListening}
            disabled={!cameraActive || isSpeaking}
          >
            {isListening ? "Listening..." : "🎤 Speak"}
          </button>
          
          {isSpeaking && <div className={styles.speakingIndicator}>Audio playing...</div>}
        </div>
      </div>
    </div>
  );
}
