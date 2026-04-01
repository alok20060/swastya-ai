import { createContext, useContext, useState, useEffect } from 'react';

const HealthContext = createContext(null);

export function HealthProvider({ children }) {
  const [healthData, setHealthData] = useState(() => {
    try {
      const saved = localStorage.getItem('v2_health');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      score: 0,
      streak: 0,
      lastCompletionDate: null,
      dailyProgress: 0, // 0-100
    };
  });

  useEffect(() => {
    localStorage.setItem('v2_health', JSON.stringify(healthData));
  }, [healthData]);

  const addPoints = (pts) => {
    setHealthData(prev => ({ ...prev, score: prev.score + pts }));
  };

  const updateProgress = (pct) => {
    setHealthData(prev => {
      const today = new Date().toDateString();
      const isNewCompletion = pct === 100 && prev.dailyProgress < 100;

      let newStreak = prev.streak;
      let newLastDate = prev.lastCompletionDate;

      if (isNewCompletion) {
        if (prev.lastCompletionDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (prev.lastCompletionDate === yesterday.toDateString()) {
            newStreak += 1;
          } else if (prev.lastCompletionDate !== today) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }
        newLastDate = today;
      }

      return {
        ...prev,
        dailyProgress: pct,
        streak: newStreak,
        lastCompletionDate: newLastDate,
      };
    });
  };

  return (
    <HealthContext.Provider value={{
      ...healthData,
      addPoints,
      updateProgress
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => useContext(HealthContext);
