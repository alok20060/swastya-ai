// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState('email') // 'email' or 'phone'
  const [otpSent, setOtpSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { authAPI } = await import('../services/api');
      await authAPI.sendOTP(form.phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Ensure phone auth is configured in Supabase.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <svg style={{ marginBottom: '8px' }} width="54" height="32" viewBox="0 0 40 24">
            <polyline points="2,14 10,14 14,4 18,22 22,2 26,16 30,12 38,12"
              stroke="url(#lgMain)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <defs>
              <linearGradient id="lgMain" x1="0" y1="0" x2="1" y2="0">
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
        <h2 className={styles.title} style={{ marginTop: '16px' }}>Welcome back</h2>
        <p className={styles.sub}>Sign in to your health dashboard</p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button type="button" onClick={() => setLoginMethod('email')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', background: loginMethod === 'email' ? '#e0e7ff' : '#fff', color: loginMethod === 'email' ? '#5B6EF5' : '#333' }}>Email</button>
          <button type="button" onClick={() => setLoginMethod('phone')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', background: loginMethod === 'phone' ? '#e0e7ff' : '#fff', color: loginMethod === 'phone' ? '#5B6EF5' : '#333' }}>Phone OTP</button>
        </div>

        {loginMethod === 'email' ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={otpSent ? handleSubmit : handleSendOTP} className={styles.form}>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input name="phone" type="tel" value={form.phone}
                onChange={handleChange} placeholder="+91 9876543210" required disabled={otpSent} />
            </div>
            {otpSent && (
              <div className={styles.field}>
                <label>Enter 6-Digit OTP</label>
                <input name="otp" type="text" value={form.otp}
                  onChange={handleChange} placeholder="123456" required />
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Please wait…' : otpSent ? 'Verify & Login' : 'Send OTP'}
            </button>
            {otpSent && (
              <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: '#5B6EF5', marginTop: '10px', cursor: 'pointer' }}>
                Change Phone Number
              </button>
            )}
          </form>
        )}
        <p className={styles.switch}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
