// src/pages/HealthTree.jsx
import { useState, useEffect, useRef } from 'react';
import { useHealth } from '../context/HealthContext';
import styles from './HealthTree.module.css';

const MOTIVATION = [
  "Let's start your healthy day 🌱",
  "Great start! You're on your way 🌿",
  "Halfway there! Keep it up 💪",
  "Almost done! Final push 🌲",
  "Amazing! Your tree is fully grown 🌳✨",
];

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.5);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.5);
    });
  } catch { /* silently skip */ }
}

export default function HealthTree() {
  const { score, streak, dailyProgress } = useHealth();
  const [confetti, setConfetti] = useState([]);
  const completedFired = useRef(false);

  const pct = dailyProgress;
  const stage = pct < 30 ? 0 : pct < 70 ? 1 : 2;

  // Map 0-100 to 0-4 for motivation
  const msgIdx = Math.min(4, Math.floor(pct / 25));

  /* Full-completion effects */
  useEffect(() => {
    if (pct === 100 && !completedFired.current) {
      completedFired.current = true;
      launchConfetti();
      playChime();
    }
    if (pct < 100) completedFired.current = false;
  }, [pct]);

  /* Confetti */
  const launchConfetti = () => {
    const colors = ['#22c55e', '#86efac', '#fbbf24', '#f472b6', '#60a5fa', '#fb923c'];
    const pieces = Array.from({ length: 80 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
      round: Math.random() > 0.5,
      dur: 1.5 + Math.random() * 2,
      delay: Math.random() * 0.6,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 4000);
  };

  return (
    <div className={styles.page}>
      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} className={styles.confetti}
          style={{
            left: c.left + 'vw', background: c.color, width: c.size, height: c.size,
            borderRadius: c.round ? '50%' : '2px',
            animationDuration: c.dur + 's', animationDelay: c.delay + 's'
          }} />
      ))}

      {/* Stats Dashboard */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🏆</span>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Score</span>
            <span className={styles.statValue}>{score} <small>pts</small></span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔥</span>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Current Streak</span>
            <span className={styles.statValue}>{streak} <small>days</small></span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>🌿 Your Health Tree</h1>
        <p className={styles.subtitle}>Tree grows as you complete your daily reminders</p>
      </div>

      {/* Tree Card */}
      <div className={`${styles.treeCard} ${pct === 100 ? styles.treeCardFull : ''}`}>
        {/* SVG Tree */}
        <div className={styles.treeStage}>
          {/* Stage 0 — Seedling */}
          <svg className={`${styles.treeSvg} ${stage === 0 ? styles.visible : styles.hidden}`}
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="192" rx="50" ry="9" fill="#a3d977" opacity="0.5" />
            <rect x="93" y="155" width="14" height="35" rx="7" fill="#8B6636" />
            <ellipse cx="100" cy="145" rx="22" ry="18" fill="#4ade80" opacity="0.9" />
            <ellipse cx="84" cy="152" rx="14" ry="11" fill="#22c55e" opacity="0.75" transform="rotate(-20,84,152)" />
            <ellipse cx="116" cy="152" rx="14" ry="11" fill="#22c55e" opacity="0.75" transform="rotate(20,116,152)" />
            <line x1="100" y1="140" x2="90" y2="128" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="100" y1="140" x2="110" y2="128" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Stage 1 — Growing */}
          <svg className={`${styles.treeSvg} ${stage === 1 ? styles.visible : styles.hidden}`}
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="194" rx="56" ry="9" fill="#a3d977" opacity="0.5" />
            <rect x="91" y="120" width="18" height="72" rx="9" fill="#8B6636" />
            <line x1="100" y1="145" x2="68" y2="125" stroke="#8B6636" strokeWidth="7" strokeLinecap="round" />
            <line x1="100" y1="145" x2="132" y2="125" stroke="#8B6636" strokeWidth="7" strokeLinecap="round" />
            <circle cx="100" cy="118" r="42" fill="#4ade80" opacity="0.85" />
            <circle cx="70" cy="128" r="26" fill="#22c55e" opacity="0.80" />
            <circle cx="130" cy="128" r="26" fill="#22c55e" opacity="0.80" />
            <circle cx="100" cy="98" r="30" fill="#16a34a" opacity="0.75" />
          </svg>

          {/* Stage 2 — Full */}
          <svg className={`${styles.treeSvg} ${stage === 2 ? styles.visible : styles.hidden}`}
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="195" rx="66" ry="10" fill="#86efac" opacity="0.6" />
            <rect x="88" y="112" width="24" height="80" rx="12" fill="#6d4c2a" />
            <path d="M100,190 Q82,196 72,192" stroke="#6d4c2a" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d="M100,190 Q118,196 128,192" stroke="#6d4c2a" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
            <line x1="100" y1="148" x2="55" y2="120" stroke="#6d4c2a" strokeWidth="9" strokeLinecap="round" />
            <line x1="100" y1="148" x2="145" y2="120" stroke="#6d4c2a" strokeWidth="9" strokeLinecap="round" />
            <line x1="55" y1="120" x2="40" y2="100" stroke="#6d4c2a" strokeWidth="6" strokeLinecap="round" />
            <line x1="145" y1="120" x2="160" y2="100" stroke="#6d4c2a" strokeWidth="6" strokeLinecap="round" />
            <circle cx="100" cy="108" r="56" fill="#4ade80" opacity="0.80" />
            <circle cx="60" cy="120" r="36" fill="#22c55e" opacity="0.82" />
            <circle cx="140" cy="120" r="36" fill="#22c55e" opacity="0.82" />
            <circle cx="40" cy="102" r="26" fill="#16a34a" opacity="0.78" />
            <circle cx="160" cy="102" r="26" fill="#16a34a" opacity="0.78" />
            <circle cx="100" cy="80" r="42" fill="#15803d" opacity="0.75" />
            <circle cx="80" cy="68" r="26" fill="#166534" opacity="0.70" />
            <circle cx="120" cy="68" r="26" fill="#166534" opacity="0.70" />
            <circle cx="100" cy="54" r="20" fill="#14532d" opacity="0.65" />
            <circle cx="78" cy="90" r="6" fill="#fbbf24" opacity="0.9" />
            <circle cx="122" cy="86" r="6" fill="#fbbf24" opacity="0.9" />
            <circle cx="100" cy="72" r="6" fill="#fb923c" opacity="0.85" />
            <circle cx="60" cy="108" r="5" fill="#f472b6" opacity="0.8" />
            <circle cx="140" cy="108" r="5" fill="#f472b6" opacity="0.8" />
          </svg>

          <div className={styles.ground} />
        </div>

        {/* Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            <span className={`${styles.progressPct} ${pct === 100 ? styles.progressPctGold : ''}`}>
              {pct}%
            </span>
            <span className={styles.progressText}>Daily Goal Progress</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={`${styles.progressFill} ${pct === 100 ? styles.progressFillGold : ''}`}
              style={{ width: pct + '%' }} />
          </div>
        </div>

        {/* Motivation */}
        <div className={`${styles.motivation} ${pct === 100 ? styles.motivationGold : ''}`}>
          {MOTIVATION[msgIdx]}
        </div>
      </div>

      <div className={styles.infoCard}>
        <h3>How to grow your tree?</h3>
        <p>Your tree reflects your daily health habits. Go to <strong>Reminders</strong> and complete your tasks (medicine, water, walks) to see it grow! Each task also earns you <strong>10 points</strong>. 🏆</p>
      </div>
    </div>
  );
}
