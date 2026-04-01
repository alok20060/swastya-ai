import { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { authAPI } from '../../services/api';
import styles from '../Auth.module.css';

export default function Step2_Auth() {
  const { onboardingData, updateData } = useOnboarding();
  const { handleNext, handleBack } = useOutletContext();
  const [method, setMethod] = useState(''); // 'google' or 'phone'
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  const validatePhone = (p) => /^\d{10}$/.test(p);

  const handleSendOTP = () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
    if (newOtp.every(n => n !== '')) {
      verifyOTP(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const verifyOTP = async (code) => {
    setLoading(true);
    try {
      // Mocking signup/login. We'll register a temp email for the internal mock system.
      await authAPI.signup({ name: 'User', email: `${phone}@phone.com`, password: code });
      updateData({ authMethod: 'phone' });
      handleNext();
    } catch {
      setError('Invalid OTP or account exists. Try again.');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const gEmail = `google_${Date.now()}@test.com`;
      await authAPI.signup({ name: 'Google User', email: gEmail, password: 'gAuth' });
      updateData({ authMethod: 'google' });
      handleNext();
    } catch {
      setError('Google Sign-In failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '350px' }}>
      <button onClick={handleBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Back
      </button>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Log In & Sign Up</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Choose a method to secure your health data.</p>

      {error && <div style={{ color: '#FF4D4D', background: 'rgba(255,77,77,0.1)', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

      {!method ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Google button - white with border */}
          <button
            className={styles.btn}
            style={{ background: '#fff', color: '#1a1a1a', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            onClick={() => setMethod('google')}
          >
            🔵 Continue with Google
          </button>

          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0' }}>OR</div>

          {/* Phone button - solid emerald */}
          <button
            className={styles.btn}
            onClick={() => setMethod('phone')}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}
          >
            📱 Continue with Phone Number
          </button>
        </div>
      ) : method === 'phone' && !otpSent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.field}>
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoFocus
              maxLength={10}
            />
          </div>
          <button className={styles.btn} onClick={handleSendOTP} disabled={loading || phone.length < 10}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          <button onClick={() => setMethod('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '16px' }}>Use another method</button>
        </div>
      ) : method === 'phone' && otpSent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>Enter the 6-digit OTP sent to {phone}</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {otp.map((n, i) => (
              <input
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="text"
                value={n}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                style={{ width: '40px', height: '50px', fontSize: '1.2rem', textAlign: 'center', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}
                autoFocus={i === 0}
              />
            ))}
          </div>
          <button onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginTop: '16px', fontSize: '0.85rem' }}>Change Phone Number</button>
        </div>
      ) : method === 'google' ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <button className={styles.btn} onClick={handleGoogle} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign in as mock User'}
          </button>
          <button onClick={() => setMethod('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '16px' }}>Cancel</button>
        </div>
      ) : null}
    </div>
  );
}
