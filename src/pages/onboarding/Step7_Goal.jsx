import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from '../Auth.module.css';

export default function Step7_Goal() {
  const { onboardingData, updateData } = useOnboarding();
  const { handleNext, handleBack } = useOutletContext();
  const [goal, setGoal] = useState(onboardingData.stepGoal || 7000);
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async () => {
    setSubmitting(true);
    updateData({ stepGoal: goal });
    await handleNext();
  };

  const getPresetLabel = (val) => {
    if (val <= 5000) return 'Beginner';
    if (val <= 8500) return 'Moderate';
    return 'Active';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '450px' }}>
      <button onClick={handleBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Daily Step Goal</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '40px' }}>Set a target to keep yourself moving every day.</p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>
          {goal.toLocaleString()}
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Steps / day • <span style={{ color: 'var(--text)' }}>{getPresetLabel(goal)}</span>
        </div>

        <input
          type="range"
          min="2000"
          max="20000"
          step="500"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '32px', gap: '8px' }}>
          <button
            onClick={() => setGoal(4000)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid', borderColor: goal === 4000 ? 'var(--accent)' : 'var(--border)', color: goal === 4000 ? 'var(--accent)' : 'var(--text)' }}
          >
            <div style={{ fontWeight: 600 }}>4,000</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Beginner</div>
          </button>

          <button
            onClick={() => setGoal(7000)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid', borderColor: goal === 7000 ? 'var(--accent)' : 'var(--border)', color: goal === 7000 ? 'var(--accent)' : 'var(--text)' }}
          >
            <div style={{ fontWeight: 600 }}>7,000</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Moderate</div>
          </button>

          <button
            onClick={() => setGoal(10000)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid', borderColor: goal === 10000 ? 'var(--accent)' : 'var(--border)', color: goal === 10000 ? 'var(--accent)' : 'var(--text)' }}
          >
            <div style={{ fontWeight: 600 }}>10,000</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active</div>
          </button>
        </div>

      </div>

      <div style={{ marginTop: '24px' }}>
        <button className={styles.btn} onClick={handleFinish} disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Creating Profile...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}
