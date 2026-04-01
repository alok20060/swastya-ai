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
  const [language, setLanguage] = useState('en-US') // Multilingual NLP state
  const messagesEndRef = useRef(null)

  useEffect(() => {
    vitalsAPI.getLatest().then(setVitals)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg = input.trim()
    setInput('')
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }])
    setIsTyping(true)

    try {
      // Build context for AI
      const context = {
        name: user?.name,
        age: user?.age,
        conditions: user?.conditions?.join(', '),
        heartRate: vitals.heartRate,
        spo2: vitals.spo2,
        steps: vitals.steps
      }

        const res = await chatbotAPI.sendMessage(userMsg, context, language)
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: res.reply }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: "I'm having trouble connecting right now. Please try again later." }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (actionText) => {
    setInput(actionText)
    // Small timeout to allow input state to update before sending
    setTimeout(() => {
      document.getElementById('chat-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }, 50)
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
          <button onClick={() => handleQuickAction("Check my vitals")} className={styles.chip}>❤️ Vitals</button>
          <button onClick={() => handleQuickAction("I feel unwell")} className={styles.chip}>🤒 Unwell</button>
          <button onClick={() => handleQuickAction("What did I eat today?")} className={styles.chip}>🥗 Food</button>
          <button onClick={() => handleQuickAction("Check my medicine")} className={styles.chip}>💊 Medicine</button>
        </div>

        <form id="chat-form" className={styles.form} onSubmit={handleSend}>
          <button type="button" className={styles.voiceBtn} onClick={() => alert("🎤 Voice input active (Mock)")}>
            🎤
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
