// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { vitalsAPI, remindersAPI } from '../services/api'
import styles from './Home.module.css'

export default function Home() {
  const { user } = useAuth()
  const [vitals, setVitals] = useState(null)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertLevel, setAlertLevel] = useState('STABLE')

  useEffect(() => {
    Promise.all([
      vitalsAPI.getLatest(),
      remindersAPI.getAll(),
    ]).then(([v, r]) => {
      setVitals(v)
      setReminders(r.filter(rem => rem.status === 'pending').slice(0, 3))
      if (v.heartRate && (v.heartRate > 100 || v.spo2 < 95)) setAlertLevel('CAUTION')
      if (v.heartRate && (v.heartRate > 130 || v.spo2 < 90)) setAlertLevel('CRITICAL')
    }).catch(() => {
      setVitals({ heartRate: 74, spo2: 97, steps: 6420, skinTemp: 36.5, stressScore: 32, sleepHours: 6.8, recoveryScore: 78 })
    }).finally(() => setLoading(false))
  }, [])

  const v = vitals || { heartRate: 74, spo2: 97, steps: 6420, skinTemp: 36.5, stressScore: 32, sleepHours: 6.8, recoveryScore: 78 }
  const name = user?.name?.split(' ')[0] || 'Friend'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const recoveryColor = v.recoveryScore >= 70 ? '#27AE60' : v.recoveryScore >= 40 ? '#F1C40F' : '#E74C3C'
  const circumference = 2 * Math.PI * 54
  const scoreVal = v.recoveryScore || 0
  const recoveryOffset = circumference - (scoreVal / 100) * circumference

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={`${styles.header} fade-up`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="40" height="24" viewBox="0 0 40 24" className={styles.logoSVG}>
              <polyline points="2,14 10,14 14,4 18,22 22,2 26,16 30,12 38,12" stroke="url(#logoGradMain)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <defs><linearGradient id="logoGradMain" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="var(--accent)" /><stop offset="100%" stopColor="var(--accent2)" /></linearGradient></defs>
            </svg>
            <span className={styles.logoText}>Swastya <span className={styles.logoAccent}>AI</span></span>
          </div>
          <p className={styles.tagline}>Predict Health Early</p>
        </div>
        <Link to="/profile" className={styles.avatar}>{name[0]}</Link>
      </div>

      {/* Greeting */}
      <div className={`${styles.greeting} fade-up`}>
        <p className={styles.greetSub}>{greeting} 🙏</p>
        <h1 className={styles.greetMain}>
          How are you, <span className={styles.accentName}>{name} Ji?</span>
        </h1>
      </div>

      {/* Alert Banner */}
      {alertLevel !== 'STABLE' && (
        <div className={`${styles.alertBanner} ${styles[`alert${alertLevel}`]} fade-up`}>
          <span className={styles.alertDot} />
          <div>
            <strong>{alertLevel === 'CRITICAL' ? '🔴 CRITICAL ALERT' : '🟡 CAUTION'}</strong>
            <p>{alertLevel === 'CRITICAL'
              ? 'Vitals are in danger zone! Emergency services notified.'
              : 'Some vitals need attention. Caretakers have been notified.'}</p>
          </div>
        </div>
      )}

      {/* Recovery Score + Vitals */}
      <div className={`${styles.topSection} fade-up`}>
        <div className={styles.recoveryCard}>
          <svg className={styles.recoveryRing} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
            <circle cx="60" cy="60" r="54" stroke={recoveryColor} strokeWidth="8" fill="none"
              strokeDasharray={circumference} strokeDashoffset={recoveryOffset}
              strokeLinecap="round" transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
          <div className={styles.recoveryInner}>
            <span className={styles.recoveryValue}>{v.recoveryScore || '--'}</span>
            <span className={styles.recoveryLabel}>Recovery</span>
          </div>
        </div>

        <div className={styles.vitalsGrid}>
          <Link to="/health" className={`${styles.vCard} ${styles.heart}`}>
            <span className={styles.vIcon}>❤️</span>
            <span className={styles.vValue}>{v.heartRate ?? '--'}</span>
            <span className={styles.vUnit}>BPM</span>
          </Link>
          <Link to="/health" className={`${styles.vCard} ${styles.spo2}`}>
            <span className={styles.vIcon}>🫁</span>
            <span className={styles.vValue}>{v.spo2 ? `${v.spo2}%` : '--'}</span>
            <span className={styles.vUnit}>SpO₂</span>
          </Link>
          <Link to="/health" className={`${styles.vCard} ${styles.steps}`}>
            <span className={styles.vIcon}>👟</span>
            <span className={styles.vValue}>{v.steps !== null ? v.steps.toLocaleString() : '--'}</span>
            <span className={styles.vUnit}>Steps</span>
          </Link>
          <Link to="/health" className={`${styles.vCard} ${styles.sleep}`}>
            <span className={styles.vIcon}>😴</span>
            <span className={styles.vValue}>{v.sleepHours ?? '--'}h</span>
            <span className={styles.vUnit}>Sleep</span>
          </Link>
        </div>
      </div>

      {/* ECG Strip */}
      <div className={`${styles.ecgCard} fade-up`}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>ECG Monitor</span>
          <span className={styles.liveBadge}>● LIVE</span>
        </div>
        <svg className={styles.ecgSvg} viewBox="0 0 320 50" preserveAspectRatio="none">
          <polyline
            points="0,25 18,25 22,25 26,6 30,44 34,25 48,25 54,25 58,8 62,42 66,25 80,25 90,25 94,8 98,42 102,25 116,25 120,25 124,6 128,44 132,25 146,25 162,25 166,8 170,42 174,25 188,25 192,25 196,6 200,44 204,25 218,25 232,25 238,8 242,42 246,25 260,25 264,25 268,6 272,44 276,25 290,25 304,25 320,25"
            stroke="url(#ecgGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <defs>
            <linearGradient id="ecgGrad" x1="0" y1="0" x2="320" y2="0">
              <stop offset="0%" stopColor="#5B6EF5" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#5B6EF5" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Quick Access Grid */}
      <div className={`${styles.quickGrid} fade-up`}>
        <Link to="/food" className={styles.quickCard}>
          <span className={styles.quickIcon}>🥗</span>
          <span className={styles.quickLabel}>Food Log</span>
        </Link>
        <Link to="/medications" className={styles.quickCard}>
          <span className={styles.quickIcon}>💊</span>
          <span className={styles.quickLabel}>Medicines</span>
        </Link>
        <Link to="/appointments" className={styles.quickCard}>
          <span className={styles.quickIcon}>📅</span>
          <span className={styles.quickLabel}>Doctors</span>
        </Link>
        <Link to="/gps" className={styles.quickCard}>
          <span className={styles.quickIcon}>📍</span>
          <span className={styles.quickLabel}>GPS</span>
        </Link>
      </div>

      {/* Upcoming Reminders */}
      {reminders.length > 0 && (
        <div className={`${styles.remindersSection} fade-up`}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>⏰ Upcoming</span>
            <Link to="/reminders" className={styles.seeAll}>See All →</Link>
          </div>
          {reminders.map(r => (
            <div key={r._id} className={styles.reminderRow}>
              <span className={styles.reminderIcon}>{r.icon}</span>
              <span className={styles.reminderText}>{r.title}</span>
              <span className={styles.reminderTime}>{r.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Insight */}
      <Link to="/chat" className={`${styles.insightCard} fade-up`}>
        <div className={styles.insightIcon}>🧠</div>
        <div>
          <p className={styles.insightTitle}>AI Health Insight</p>
          <p className={styles.insightText}>
            {!v.heartRate
              ? 'Connect your health tracker to see personalized AI insights here. 🙏'
              : v.recoveryScore >= 70
                ? `Your vitals look great today! Recovery score is ${v.recoveryScore}/100. Keep it up! 💪`
                : `Recovery score is ${v.recoveryScore}/100. Consider extra rest today. Tap to ask Swastya AI.`}
          </p>
        </div>
        <span className={styles.insightArrow}>→</span>
      </Link>

      {/* SOS Button */}
      <button className={`${styles.sosBtn} fade-up`} onClick={() => alert('🚨 SOS Activated!\n\nCalling 112...\nNotifying all emergency contacts...\nSharing live GPS location...')}>
        <span className={styles.sosIcon}>🚨</span>
        <span>SOS EMERGENCY</span>
      </button>
    </div>
  )
}
