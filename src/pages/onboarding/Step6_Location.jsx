import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from '../Auth.module.css';

const STATES = ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Kerala'];
const CITIES = {
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Delhi': ['New Delhi', 'Gurgaon', 'Noida'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Kerala': ['Kochi', 'Trivandrum', 'Kozhikode']
};

export default function Step6_Location() {
  const { onboardingData, updateData } = useOnboarding();
  const { handleNext, handleBack } = useOutletContext();
  const [loc, setLoc] = useState(onboardingData.location);
  const [detecting, setDetecting] = useState(false);

  const handleStateChange = e => {
    setLoc({ state: e.target.value, city: '' });
  };

  const handleCityChange = e => {
    setLoc({ ...loc, city: e.target.value });
  };

  const autoDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setLoc({ state: 'Karnataka', city: 'Bangalore' });
      setDetecting(false);
    }, 1200);
  };

  const handleContinue = () => {
    updateData({ location: loc });
    handleNext();
  };

  const isValid = loc.state && loc.city;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
      <button onClick={handleBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Your Location</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Helps us provide local emergency contacts and relevant food recommendations.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <button
          onClick={autoDetect}
          disabled={detecting}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--accent)',
            borderRadius: '8px',
            padding: '16px',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}>
          <span style={{ fontSize: '1.2rem' }}>📍</span>
          {detecting ? 'Detecting Location...' : 'Auto-detect using GPS'}
        </button>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', margin: '8px 0' }}>OR ENTER MANUALLY</div>

        <div className={styles.field}>
          <label>State</label>
          <select value={loc.state} onChange={handleStateChange} style={{ background: 'var(--bg)', color: 'var(--text)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <option value="" disabled>Select State</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label>City</label>
          <select value={loc.city} onChange={handleCityChange} disabled={!loc.state} style={{ background: 'var(--bg)', color: 'var(--text)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <option value="" disabled>Select City</option>
            {(CITIES[loc.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button className={styles.btn} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', opacity: isValid ? 1 : 0.5 }}>
          Continue
        </button>
      </div>
    </div>
  );
}
