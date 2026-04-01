import { useState, useEffect, useRef } from 'react';
import styles from './HealthTreeVisual.module.css';

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

export default function HealthTreeVisual({ pct, score, streak }) {
  const [confetti, setConfetti] = useState([]);
  const completedFired = useRef(false);

  const stage = pct < 30 ? 0 : pct < 70 ? 1 : 2;
  const msgIdx = Math.min(4, Math.floor(pct / 25.1));

  useEffect(() => {
    if (pct === 100 && !completedFired.current) {
      completedFired.current = true;
      launchConfetti();
      playChime();
    }
    if (pct < 100) completedFired.current = false;
  }, [pct]);

  const launchConfetti = () => {
    const colors = ['#22c55e', '#86efac', '#fbbf24', '#f472b6', '#60a5fa', '#fb923c'];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
      round: Math.random() > 0.5,
      dur: 1.5 + Math.random() * 2,
      delay: Math.random() * 0.6,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 4000);
  };

  return (
    <div className={styles.treeCardWrapper}>
      {confetti.map(c => (
        <div key={c.id} className={styles.confetti}
          style={{
            left: c.left + 'vw', background: c.color, width: c.size, height: c.size,
            borderRadius: c.round ? '50%' : '2px',
            animationDuration: c.dur + 's', animationDelay: c.delay + 's'
          }} />
      ))}

      {/* Stats Row */}
      {(score !== undefined || streak !== undefined) && (
        <div className={styles.statsRow}>
          <div className={styles.statMini}>
            <span className={styles.statIcon}>🏆</span>
            <div>
              <div className={styles.statLabel}>Score</div>
              <div className={styles.statValue}>{score}</div>
            </div>
          </div>
          <div className={styles.statMini}>
            <span className={styles.statIcon}>🔥</span>
            <div>
              <div className={styles.statLabel}>Streak</div>
              <div className={styles.statValue}>{streak}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tree Visualization */}
      <div className={`${styles.treeCard} ${pct === 100 ? styles.treeCardFull : ''}`}>
        <div className={styles.treeStage}>
          {/* Stage 0 */}
          <svg className={`${styles.treeSvg} ${stage === 0 ? styles.visible : styles.hidden}`}
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="192" rx="50" ry="9" fill="#a3d977" opacity="0.5" />
            <rect x="93" y="155" width="14" height="35" rx="7" fill="#8B6636" />
            <ellipse cx="100" cy="145" rx="22" ry="18" fill="#4ade80" opacity="0.9" />
            <ellipse cx="84" cy="152" rx="14" ry="11" fill="#22c55e" opacity="0.75" transform="rotate(-20,84,152)" />
            <ellipse cx="116" cy="152" rx="14" ry="11" fill="#22c55e" opacity="0.75" transform="rotate(20,116,152)" />
          </svg>

          {/* Stage 1 */}
          <svg className={`${styles.treeSvg} ${stage === 1 ? styles.visible : styles.hidden}`}
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="194" rx="56" ry="9" fill="#a3d977" opacity="0.5" />
            <rect x="91" y="120" width="18" height="72" rx="9" fill="#8B6636" />
            <line x1="100" y1="145" x2="68" y2="125" stroke="#8B6636" strokeWidth="7" strokeLinecap="round" />
            <line x1="100" y1="145" x2="132" y2="125" stroke="#8B6636" strokeWidth="7" strokeLinecap="round" />
            <circle cx="100" cy="118" r="42" fill="#4ade80" opacity="0.85" />
            <circle cx="70" cy="128" r="26" fill="#22c55e" opacity="0.80" />
            <circle cx="130" cy="128" r="26" fill="#22c55e" opacity="0.80" />
          </svg>

          {/* Stage 2 */}
          <svg className={`${styles.treeSvg} ${stage === 2 ? styles.visible : styles.hidden}`}
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="195" rx="66" ry="10" fill="#86efac" opacity="0.6" />
            <rect x="88" y="112" width="24" height="80" rx="12" fill="#6d4c2a" />
            <line x1="100" y1="148" x2="55" y2="120" stroke="#6d4c2a" strokeWidth="9" strokeLinecap="round" />
            <line x1="100" y1="148" x2="145" y2="120" stroke="#6d4c2a" strokeWidth="9" strokeLinecap="round" />
            <circle cx="100" cy="108" r="56" fill="#4ade80" opacity="0.80" />
            <circle cx="60" cy="120" r="36" fill="#22c55e" opacity="0.82" />
            <circle cx="140" cy="120" r="36" fill="#22c55e" opacity="0.82" />
            <circle cx="100" cy="80" r="42" fill="#15803d" opacity="0.75" />
            <circle cx="78" cy="90" r="6" fill="#fbbf24" opacity="0.9" />
          </svg>
          <div className={styles.ground} />
        </div>

        {/* Progress Display */}
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            <span className={`${styles.progressPct} ${pct === 100 ? styles.progressPctGold : ''}`}>{pct}%</span>
            <span className={styles.progressText}>{MOTIVATION[msgIdx]}</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={`${styles.progressFill} ${pct === 100 ? styles.progressFillGold : ''}`}
              style={{ width: pct + '%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
