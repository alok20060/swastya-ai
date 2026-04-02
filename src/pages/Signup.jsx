// src/pages/Signup.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '',
    height: '', weight: '', smoke: 'No', exercise: 'Rarely'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectStyle = (selected, value) => ({
    flex: 1,
    padding: '10px 6px',
    borderRadius: '10px',
    border: '2px solid',
    borderColor: selected === value ? '#5B6EF5' : '#e0e0e0',
    background: selected === value ? '#e0e7ff' : '#fff',
    color: selected === value ? '#5B6EF5' : '#555',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.82rem',
    transition: 'all 0.2s'
  })

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg style={{ marginBottom: '8px' }} width="54" height="32" viewBox="0 0 40 24">
            <polyline points="2,14 10,14 14,4 18,22 22,2 26,16 30,12 38,12"
              stroke="url(#lgMain2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <defs>
              <linearGradient id="lgMain2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent2)" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ display: 'flex', gap: '6px', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            <span>Swastya</span>
            <span style={{ color: '#2998FF' }}>AI</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: 600 }}>Predict Health Early</p>
        </div>

        <h2 className={styles.title} style={{ marginTop: '16px' }}>Create Account</h2>
        <p className={styles.sub}>Tell us about yourself for personalized care</p>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Basic Info */}
          <p style={{ fontWeight: 700, color: '#5B6EF5', margin: '12px 0 4px', fontSize: '0.85rem' }}>👤 Basic Info</p>
          <div className={styles.field}>
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" required />
          </div>
          <div className={styles.field}>
            <label>Gmail / Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@gmail.com" required />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className={styles.field} style={{ flex: 1 }}>
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="28" required />
            </div>
            <div className={styles.field} style={{ flex: 1 }}>
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="000000" required />
            </div>
          </div>

          {/* Physical Stats */}
          <p style={{ fontWeight: 700, color: '#5B6EF5', margin: '12px 0 4px', fontSize: '0.85rem' }}>📏 Physical Stats</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className={styles.field} style={{ flex: 1 }}>
              <label>Height (cm)</label>
              <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="170" />
            </div>
            <div className={styles.field} style={{ flex: 1 }}>
              <label>Weight (kg)</label>
              <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="65" />
            </div>
          </div>

          {/* Smoking */}
          <p style={{ fontWeight: 700, color: '#5B6EF5', margin: '12px 0 6px', fontSize: '0.85rem' }}>🚬 Do you smoke?</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['No', 'Occasionally', 'Yes'].map(opt => (
              <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, smoke: opt }))}
                style={selectStyle(form.smoke, opt)}>
                {opt === 'No' ? '🚭 No' : opt === 'Occasionally' ? '🌫️ Sometimes' : '🚬 Yes'}
              </button>
            ))}
          </div>

          {/* Exercise */}
          <p style={{ fontWeight: 700, color: '#5B6EF5', margin: '12px 0 6px', fontSize: '0.85rem' }}>🏃 How often do you exercise?</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {['Rarely', '1-2x/week', '3-4x/week', 'Daily'].map(opt => (
              <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, exercise: opt }))}
                style={{ ...selectStyle(form.exercise, opt), flex: 'none', minWidth: '45%' }}>
                {opt === 'Rarely' ? '😴 Rarely' : opt === '1-2x/week' ? '🚶 1-2x/week' : opt === '3-4x/week' ? '🏃 3-4x/week' : '💪 Daily'}
              </button>
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : '🎉 Create My Health Profile'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
