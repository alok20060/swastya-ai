import { useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import styles from '../pages/Auth.module.css';

export default function OnboardingLayout() {
  const { onboardingData, prevStep, updateData, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  if (onboardingData.completed) {
    return <Navigate to="/" replace />;
  }

  const { step } = onboardingData;

  useEffect(() => {
    const expectedPath = getStepPath(step);
    if (location.pathname === '/onboarding' || location.pathname === '/onboarding/') {
      navigate(expectedPath, { replace: true });
    } else if (location.pathname !== expectedPath) {
      // Sync internal state to match URL instead of forcing redirect, so user can press back.
      const pathMap = {
        '/onboarding/terms': 1,
        '/onboarding/auth': 2,
        '/onboarding/permissions': 3,
        '/onboarding/device': 4,
        '/onboarding/personal': 5,
        '/onboarding/location': 6,
        '/onboarding/goal': 7
      };
      const foundStep = pathMap[location.pathname];
      if (foundStep && foundStep !== step) {
        updateData({ step: foundStep });
      }
    }
  }, [location.pathname, step, navigate, updateData]);

  const handleNext = async () => {
    if (step === 7) {
      await completeOnboarding();
      navigate('/');
    } else {
      // Just visually update step internally, outlet manages path if we do this right,
      // actually let's use router mapping
      const nextPath = getStepPath(step + 1);
      updateData({ step: step + 1 });
      navigate(nextPath);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prevPath = getStepPath(step - 1);
      updateData({ step: step - 1 });
      navigate(prevPath);
    }
  };

  const getStepPath = (s) => {
    switch (s) {
      case 1: return '/onboarding/terms';
      case 2: return '/onboarding/auth';
      case 3: return '/onboarding/permissions';
      case 4: return '/onboarding/device';
      case 5: return '/onboarding/personal';
      case 6: return '/onboarding/location';
      case 7: return '/onboarding/goal';
      default: return '/onboarding/terms';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card} style={{ maxWidth: '450px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            <span>Swastya</span><span style={{ color: '#2998FF' }}>AI</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Step {step} of 7
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(to right, var(--accent), var(--accent2))',
            width: `${(step / 7) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div style={{ minHeight: '300px' }}>
          <Outlet context={{ handleNext, handleBack }} />
        </div>

      </div>
    </div>
  );
}
