import { createContext, useContext, useState, useEffect } from 'react';
import { onboardingAPI } from '../services/api';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const { updateUser } = useAuth();

  // Load initial state from localStorage or set defaults
  const [onboardingData, setOnboardingData] = useState(() => {
    try {
      const saved = localStorage.getItem('sc_onboarding');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      step: 1, // Current step in 1-7
      termsAccepted: false,
      authMethod: null, // "google" | "phone"
      deviceId: null,
      personalInfo: {
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        height: '',
        weight: ''
      },
      habits: {
        smoking: false,
        alcohol: false,
        sleepQuality: '', // "Good" | "Average" | "Poor"
        exerciseFrequency: '',
        waterIntake: '',
        stressLevel: ''
      },
      location: {
        state: '',
        city: ''
      },
      stepGoal: 7000,
      completed: false
    };
  });

  // Persist state whenever it changes
  useEffect(() => {
    localStorage.setItem('sc_onboarding', JSON.stringify(onboardingData));
  }, [onboardingData]);

  const updateData = (newData) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setOnboardingData(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setOnboardingData(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const setStep = (stepNumber) => {
    setOnboardingData(prev => ({ ...prev, step: stepNumber }));
  }

  const completeOnboarding = async () => {
    try {
      const finalProfile = await onboardingAPI.completeOnboarding(onboardingData);
      updateUser(finalProfile);
      updateData({ completed: true });
      // clear the local temp state
      localStorage.removeItem('sc_onboarding');
    } catch (err) {
      console.error('Failed to save onboarding profile', err);
      throw err;
    }
  };

  return (
    <OnboardingContext.Provider value={{
      onboardingData,
      updateData,
      nextStep,
      prevStep,
      setStep,
      completeOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
