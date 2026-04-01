// src/pages/HealthDashboard.jsx
import { useEffect, useState } from 'react'
import { vitalsAPI } from '../services/api'
import styles from './HealthDashboard.module.css'

export default function HealthDashboard() {
  const [vitals, setVitals] = useState({ heartRate: null, spo2: null, stressScore: null })
  const [alertState, setAlertState] = useState({ status: 'STABLE', reasons: [], action: '' })
  const [history, setHistory] = useState([])
  const [riskData, setRiskData] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulation controls
  const [simHR, setSimHR] = useState(null)
  const [simSpO2, setSimSpO2] = useState(null)

  useEffect(() => {
    Promise.all([
      vitalsAPI.getLatest(),
      vitalsAPI.getHistory(),
      vitalsAPI.getRiskAssessment()
    ]).then(([v, h, r]) => {
      setVitals(v)
      setSimHR(v.heartRate)
      setSimSpO2(v.spo2)
      setHistory(h)
      setRiskData(r)
      checkAlerts({ ...v, heartRate: v.heartRate, spo2: v.spo2 })
    }).finally(() => setLoading(false))
  }, [])

  const checkAlerts = async (data) => {
    const res = await vitalsAPI.checkHealth(data)
    setAlertState(res)
  }

  // Handle slider change simulating live watch data
  const handleSimChange = (type, val) => {
    const num = Number(val)
    if (type === 'hr') setSimHR(num)
    if (type === 'spo2') setSimSpO2(num)

    const updated = { ...vitals, heartRate: type === 'hr' ? num : simHR, spo2: type === 'spo2' ? num : simSpO2 }
    setVitals(updated)
    checkAlerts(updated)
  }

  // SVG Chart Generators (since we aren't using an external chart library)
  const maxHR = Math.max(...history.map(h => h.heartRate), 120)
  const minHR = Math.min(...history.map(h => h.heartRate), 50)
  const hrPoints = history.map((h, i) => `${(i / Math.max(1, history.length - 1)) * 300},${100 - ((h.heartRate - minHR) / (maxHR - minHR)) * 80}`).join(' ')

  return (
    <div className={styles.page}>
      <h2 className={`${styles.pageTitle} fade-up`}>Health Dashboard</h2>

      {/* Alert Banner System */}
      <div className={`${styles.alertCard} ${styles[`alert${alertState.status}`]} fade-up`}>
        <div className={styles.alertHeader}>
          <span className={styles.alertDot} />
          <span className={styles.alertStatus}>{alertState.status}</span>
        </div>
        {alertState.reasons.length > 0 && (
          <ul className={styles.alertReasons}>
            {alertState.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        )}
        <p className={styles.alertAction}><strong>Action:</strong> {alertState.action}</p>
      </div>

      {/* Vitals Simulator (for hackathon demo) */}
      <div className={`${styles.simulator} fade-up`}>
        <h3 className={styles.simTitle}>⌚ Watch Data Simulator (Demo)</h3>
        <p className={styles.simSub}>Adjust sliders to trigger BLE watch alerts</p>

        <div className={styles.simRow}>
          <label>Heart Rate ({simHR ?? '--'} BPM)</label>
          <input type="range" min="40" max="180" value={simHR || 72} onChange={e => handleSimChange('hr', e.target.value)} />
          <div className={styles.simTicks}><span>40</span><span>60</span><span>100</span><span>130</span><span>180</span></div>
        </div>

        <div className={styles.simRow}>
          <label>SpO₂ ({simSpO2 ?? '--'}%)</label>
          <input type="range" min="80" max="100" value={simSpO2 || 98} onChange={e => handleSimChange('spo2', e.target.value)} />
          <div className={styles.simTicks}><span>80</span><span>90</span><span>95</span><span>100</span></div>
        </div>
      </div>

      {/* Live Vitals Gauge Grid */}
      <div className={`${styles.gaugeGrid} fade-up`}>
        <div className={styles.gaugeCard}>
          <div className={styles.gTitle}>Heart Rate</div>
          <div className={`${styles.gValue} ${simHR > 100 ? styles.textCrit : simHR && simHR < 60 ? styles.textCaut : styles.textSafe}`}>
            {simHR ?? '--'} <span className={styles.gUnit}>BPM</span>
          </div>
          <div className={styles.barWrap}><div className={styles.barFill} style={{ width: `${Math.min(100, ((simHR || 0) / 180) * 100)}%`, background: simHR && (simHR > 100 || simHR < 60) ? 'var(--critical)' : 'var(--safe)' }} /></div>
        </div>

        <div className={styles.gaugeCard}>
          <div className={styles.gTitle}>Blood Oxygen</div>
          <div className={`${styles.gValue} ${simSpO2 && simSpO2 < 90 ? styles.textCrit : simSpO2 && simSpO2 < 95 ? styles.textCaut : styles.textSafe}`}>
            {simSpO2 ?? '--'} <span className={styles.gUnit}>%</span>
          </div>
          <div className={styles.barWrap}><div className={styles.barFill} style={{ width: `${simSpO2 || 0}%`, background: simSpO2 && simSpO2 < 90 ? 'var(--critical)' : simSpO2 && simSpO2 < 95 ? 'var(--caution)' : 'var(--primary)' }} /></div>
        </div>

        <div className={styles.gaugeCard}>
          <div className={styles.gTitle}>Stress Level</div>
          <div className={`${styles.gValue} ${vitals.stressScore > 70 ? styles.textCaut : styles.textSafe}`}>
            {vitals.stressScore ?? '--'} <span className={styles.gUnit}>/100</span>
          </div>
          <div className={styles.barWrap}><div className={styles.barFill} style={{ width: `${vitals.stressScore || 0}%`, background: vitals.stressScore > 70 ? 'var(--caution)' : 'var(--safe)' }} /></div>
        </div>
      </div>

      {/* 24h Trend Chart (Custom SVG) */}
      <div className={`${styles.chartCard} fade-up`}>
        <h3 className={styles.cardTitle}>24h Heart Rate Trend</h3>
        <div className={styles.svgWrap}>
          <svg viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Guide lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="var(--border)" strokeDasharray="4" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="var(--border)" strokeDasharray="4" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="var(--border)" strokeDasharray="4" />

            {/* Safe zone line 100bpm & 60bpm approximations based on scaling */}
            <line x1="0" y1="30" x2="300" y2="30" stroke="var(--critical)" strokeDasharray="2" opacity="0.5" />

            {/* Real data line */}
            <polyline points={hrPoints} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Gradient fill below line */}
            <polygon points={`0,100 ${hrPoints} 300,100`} fill="url(#hrGrad)" opacity="0.2" />

            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* AI Risk Assessment Model Summary */}
      <div className={`${styles.riskCard} fade-up`}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>AI Risk Prediction</h3>
          <span className={styles.aiBadge}>Based on ML Model</span>
        </div>
        <p className={styles.riskDesc}>Analysis based on vitals history, profile data, and recent food logs.</p>

        <div className={styles.riskList}>
          {riskData.map((risk, i) => (
            <div key={i} className={styles.riskItem}>
              <div className={styles.riskLabelRow}>
                <span>{risk.disease}</span>
                <span className={styles[`risk${risk.level}`]}>{risk.level} Risk</span>
              </div>
              <div className={styles.riskBarBg}>
                <div
                  className={`${styles.riskBarFill} ${styles[`bg${risk.level}`]}`}
                  style={{ width: `${risk.risk}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
