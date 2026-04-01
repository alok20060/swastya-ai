import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from '../Auth.module.css';

export default function Step5_PersonalInfo() {
  const { onboardingData, updateData } = useOnboarding();
  const { handleNext, handleBack } = useOutletContext();

  const [info, setInfo] = useState(onboardingData.personalInfo);
  const [habits, setHabits] = useState(onboardingData.habits);

  const handleChange = e => setInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleHabit = (key, val) => setHabits(prev => ({ ...prev, [key]: val }));

  const [error, setError] = useState('');

  const getMissingFields = () => {
    const missing = [];
    if (!info.firstName) missing.push('First Name');
    if (!info.age) missing.push('Age');
    if (!info.gender) missing.push('Gender');
    if (!info.height) missing.push('Height');
    if (!info.weight) missing.push('Weight');
    return missing;
  };

  const onSubmit = () => {
    const missing = getMissingFields();
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ')}`);
      return;
    }
    setError('');
    updateData({ personalInfo: info, habits });
    handleNext();
  };

  const Chip = ({ active, label, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '20px',
        border: '1px solid',
        borderColor: active ? 'var(--accent)' : 'var(--border)',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#FFF' : 'var(--text-muted)',
        fontSize: '0.8rem',
        cursor: 'pointer',
        fontWeight: active ? 600 : 400
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
      <button onClick={handleBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Personal Profile</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Tell us about yourself to personalize your insights.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>First Name*</label>
            <input name="firstName" value={info.firstName} onChange={handleChange} placeholder="First" required />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Last Name</label>
            <input name="lastName" value={info.lastName} onChange={handleChange} placeholder="Last" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Age*</label>
            <input type="number" name="age" value={info.age} onChange={handleChange} placeholder="e.g. 68" required />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Gender*</label>
            <select name="gender" value={info.gender} onChange={handleChange} required style={{ background: 'var(--bg)', color: 'var(--text)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <option value="" disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Height (cm)*</label>
            <input type="number" name="height" value={info.height} onChange={handleChange} placeholder="e.g. 170" required />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Weight (kg)*</label>
            <input type="number" name="weight" value={info.weight} onChange={handleChange} placeholder="e.g. 72" required />
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginTop: '16px', marginBottom: '8px' }}>Lifestyle & Habits</h3>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Smoking / Alcohol</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip active={habits.smoking} label="Smoking" onClick={() => handleHabit('smoking', !habits.smoking)} />
            <Chip active={habits.alcohol} label="Alcohol" onClick={() => handleHabit('alcohol', !habits.alcohol)} />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Sleep Quality</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Good', 'Average', 'Poor'].map(lvl => (
              <Chip key={lvl} active={habits.sleepQuality === lvl} label={lvl} onClick={() => handleHabit('sleepQuality', lvl)} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Exercise Frequency</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Rarely', '1-2 times/week', '3-4 times/week', 'Daily'].map(lvl => (
              <Chip key={lvl} active={habits.exerciseFrequency === lvl} label={lvl} onClick={() => handleHabit('exerciseFrequency', lvl)} />
            ))}
          </div>
        </div>

      </div>

      <div style={{ marginTop: '24px' }}>
        {error && <div style={{ color: '#FF4D4D', background: 'rgba(255,77,77,0.1)', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
        <button className={styles.btn} onClick={onSubmit} style={{ width: '100%' }}>
          Continue
        </button>
      </div>
    </div>
  );
}
