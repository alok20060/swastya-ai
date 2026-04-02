import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { chatbotAPI, vitalsAPI } from '../services/api'
import styles from './Chatbot.module.css'

export default function Chatbot() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'bot', text: `Namaste ${user?.name?.split(' ')[0] || 'Ji'}! 🙏 I am Swastya AI, your health companion. How can I help you today?` }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [vitals, setVitals] = useState({})
  const [language, setLanguage] = useState('en-US') 
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(SpeechRecognition ? new SpeechRecognition() : null);

  useEffect(() => {
    vitalsAPI.getLatest().then(setVitals)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (e, customMsg) => {
    e?.preventDefault()
    const userMsg = customMsg || input.trim()
    if (!userMsg || isTyping) return

    setInput('')
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }])
    setIsTyping(true)

    try {
      const context = {
        name: user?.name,
        age: user?.age,
        gender: user?.gender,
        conditions: user?.conditions?.join(', '),
        heartRate: vitals.heartRate || 74,
        spo2: vitals.spo2 || 97,
        steps: vitals.steps || 6420,
        daily_summary: `The patient has taken ${vitals.steps || 6420} steps and their recovery score is 78%. Recommend daily improvements.`
      }

      const res = await chatbotAPI.sendMessage(userMsg, context, language)
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: res.reply }])
      
      // Auto-speak the AI doctor's response for better accessibility
      const utterance = new SpeechSynthesisUtterance(res.reply);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);

    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: "I'm having trouble connecting to my medical database. Please try again." }])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleVoice = () => {
    if (!recognition.current) {
       alert("Voice not supported in this browser.")
       return
    }
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.lang = language;
      recognition.current.start();
      setIsListening(true);
      recognition.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        handleSend(null, text);
        setIsListening(false);
      }
      recognition.current.onend = () => setIsListening(false);
    }
  }

  const handleQuickAction = (actionText) => {
    handleSend(null, actionText)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.botInfo}>
          <div className={styles.botAvatar}>🧠</div>
          <div>
            <h2 className={styles.botName}>Swastya AI NLP</h2>
            <p className={styles.botStatus}><span className={styles.statusDot}/> Professional Advice Active</p>
          </div>
        </div>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}>
          <option value="en-US">English</option>
          <option value="hi-IN">Hindi</option>
          <option value="kn-IN">Kannada</option>
        </select>
      </div>

      {/* System Prompt Info (For Hackathon Demo) */}
      <div className={styles.debugBanner}>
        <span className={styles.debugIcon}>ℹ️</span>
        <div>
          <p className={styles.debugTitle}>AI Context Loaded</p>
          <p className={styles.debugText}>HR: {vitals.heartRate} · SpO2: {vitals.spo2}% · Conditions: {user?.conditions?.join(', ') || 'None'}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className={styles.messagesWrap}>
        {messages.map((msg, i) => (
          <div key={msg.id} className={`${styles.messageRow} ${styles[msg.sender]} fade-up`} style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}>
            {msg.sender === 'bot' && <div className={styles.msgAvatar}>🧠</div>}
            <div className={styles.msgBubble}>{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.messageRow} ${styles.bot}`}>
            <div className={styles.msgAvatar}>🧠</div>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button onClick={() => handleQuickAction("Give me a health checkup summary based on my vitals")} className={styles.chip}>👨‍⚕️ Health Summary</button>
          <button onClick={() => handleQuickAction("Suggest 3 ayurvedic tips for my daily energy")} className={styles.chip}>🌿 Ayurvedic Tips</button>
          <button onClick={() => handleQuickAction("Analyze my step count and sleep for today")} className={styles.chip}>🏃 Daily Activity</button>
          <button onClick={() => handleQuickAction("Suggest a traditional Indian diet plan for today")} className={styles.chip}>🥗 Diet Advice</button>
        </div>

        <form id="chat-form" className={styles.form} onSubmit={handleSend}>
          <button type="button" className={`${styles.voiceBtn} ${isListening ? styles.activeVoice : ''}`} onClick={toggleVoice}>
            {isListening ? '🛑' : '🎤'}
          </button>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask anything..." 
            className={styles.input}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isTyping}>
            ➤
          </button>
        </form>
      </div>
    </div>
  )
}
