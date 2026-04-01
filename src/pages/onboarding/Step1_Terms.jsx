import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from '../Auth.module.css';

export default function Step1_Terms() {
  const { onboardingData, updateData } = useOnboarding();
  const { handleNext } = useOutletContext();
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      if (Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 5) {
        setScrolled(true);
      }
    }
  };

  useEffect(() => {
    if (onboardingData.termsAccepted) setScrolled(true);
  }, [onboardingData.termsAccepted]);

  const onNext = () => {
    updateData({ termsAccepted: true });
    handleNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '16px' }}>Terms & Conditions</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Please scroll and read our privacy policy to proceed.</p>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--bg)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          marginBottom: '24px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          height: '200px'
        }}
      >
        <h3 style={{ color: 'var(--text)', marginBottom: '8px' }}>Privacy Policy</h3>
        <p style={{ marginBottom: '12px' }}>Welcome to Swastya AI. By continuing to use this application, you agree to our collection of health data and location analytics.</p>
        <p style={{ marginBottom: '12px' }}>Your data is securely stored and used exclusively for your predictive health assessments.</p>
        <h3 style={{ color: 'var(--text)', marginBottom: '8px', marginTop: '16px' }}>Data Usage</h3>
        <p style={{ marginBottom: '12px' }}>We use your inputs points like step counts, connected devices (via bluetooth), and user habits to model predictions using our AI framework.</p>
        <p style={{ marginBottom: '12px' }}>We do not sell your personal data to third parties.</p>
        <h3 style={{ color: 'var(--text)', marginBottom: '8px', marginTop: '16px' }}>Emergency Contacts</h3>
        <p style={{ marginBottom: '12px' }}>Permissions requested for contacts and GPS allows us to reach out to your designated caregivers automatically during significant health anomalies.</p>
        <p>Please accept these terms below to continue your journey.</p>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px' }}>
        <input
          type="checkbox"
          checked={onboardingData.termsAccepted}
          onChange={(e) => updateData({ termsAccepted: e.target.checked })}
          style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
        />
        <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
          I have read and agree to the Terms & Conditions
        </span>
      </label>

      <div style={{ marginTop: 'auto' }}>
        <button
          className={styles.btn}
          onClick={onNext}
          disabled={!onboardingData.termsAccepted}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
