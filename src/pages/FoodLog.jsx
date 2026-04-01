import { useEffect, useState } from 'react'
import { foodAPI, profileAPI } from '../services/api'
import styles from './FoodLog.module.css'

export default function FoodLog() {
  const [log, setLog] = useState([])
  const [summary, setSummary] = useState({ caloriesIn: 0, caloriesOut: 0, balance: 0 })
  const [regions, setRegions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('South Indian')
  const [foodOptions, setFoodOptions] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ meal: 'Lunch', foodIdx: 0, size: 'medium' })

  useEffect(() => {
    Promise.all([
      foodAPI.getLog(),
      foodAPI.getDailySummary(),
      foodAPI.getAllRegions(),
      profileAPI.get()
    ]).then(([l, s, r, p]) => {
      setLog(l)
      setSummary(s)
      setRegions(r)
      const region = p.region || r[0]
      setSelectedRegion(region)
      loadFoods(region)
    }).finally(() => setLoading(false))
  }, [])

  const loadFoods = (region) => {
    foodAPI.getFoods(region).then(opts => {
      setFoodOptions(opts)
      setForm(f => ({ ...f, foodIdx: 0 }))
    })
  }

  const handleRegionChange = (e) => {
    const r = e.target.value
    setSelectedRegion(r)
    loadFoods(r)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const foodItem = foodOptions[form.foodIdx]
    if (!foodItem) return

    const newEntry = {
      meal: form.meal,
      food: foodItem.name,
      icon: foodItem.icon,
      region: selectedRegion,
      size: form.size,
      calories: foodItem.cal[form.size],
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }

    try {
      const saved = await foodAPI.addEntry(newEntry)
      setLog(prev => [...prev, saved])
    } catch {
      setLog(prev => [...prev, { ...newEntry, _id: Date.now() }]) // Mock fallback
    }

    // Update local summary approx
    setSummary(s => ({ ...s, caloriesIn: s.caloriesIn + newEntry.calories, balance: s.balance + newEntry.calories }))
    setShowAdd(false)
  }

  const handleDelete = async (id, cals) => {
    setLog(prev => prev.filter(f => f._id !== id))
    setSummary(s => ({ ...s, caloriesIn: s.caloriesIn - cals, balance: s.balance - cals }))
    try { await foodAPI.deleteEntry(id) } catch {}
  }

  const progressPct = Math.min(100, (summary.caloriesIn / 1800) * 100)
  const isOver = summary.caloriesIn > 1800

  return (
    <div className={styles.page}>
      <div className={`${styles.header} fade-up`}>
        <h2 className={styles.title}>Food & Calories</h2>
        <button className={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Log Food'}
        </button>
      </div>

      {/* Balance Ring Card */}
      <div className={`${styles.balanceCard} fade-up`}>
        <div className={styles.balHeader}>
          <span>Calories In</span>
          <span>Target: 1800 kcal</span>
        </div>
        
        <div className={styles.ringWrap}>
          <div className={styles.ringCenter}>
            <span className={styles.ringNum}>{summary.caloriesIn}</span>
            <span className={styles.ringLabel}>Eaten</span>
          </div>
          <svg viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="72" stroke="var(--surface)" strokeWidth="12" fill="none" />
            <circle cx="80" cy="80" r="72" stroke={isOver ? "var(--caution)" : "var(--safe)"} strokeWidth="12" fill="none"
              strokeDasharray="452.3" strokeDashoffset={452.3 - (progressPct / 100) * 452.3}
              strokeLinecap="round" transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
        </div>

        <div className={styles.balFooter}>
          <div className={styles.balStat}>
            <span className={styles.statIcon}>🔥</span>
            <div>
              <p className={styles.statVal}>{summary.caloriesOut} kcal</p>
              <p className={styles.statLabel}>Burned</p>
            </div>
          </div>
          <div className={styles.balDivider} />
          <div className={styles.balStat}>
            <span className={styles.statIcon}>⚖️</span>
            <div>
              <p className={styles.statVal}>{summary.balance > 0 ? `+${summary.balance}` : summary.balance}</p>
              <p className={styles.statLabel}>Balance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Food Form */}
      {showAdd && (
        <form className={`${styles.form} fade-up`} onSubmit={handleAdd}>
          <div className={styles.field}>
            <label>Meal Type</label>
            <select value={form.meal} onChange={e=>setForm(f=>({...f,meal:e.target.value}))}>
              <option>Breakfast</option><option>Lunch</option><option>Evening Snack</option><option>Dinner</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Cuisine / Region</label>
            <select value={selectedRegion} onChange={handleRegionChange}>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>What did you eat?</label>
            <select value={form.foodIdx} onChange={e=>setForm(f=>({...f,foodIdx:e.target.value}))}>
              {foodOptions.map((f, i) => <option key={i} value={i}>{f.icon} {f.name}</option>)}
            </select>
          </div>
          <div className={styles.sizeGroup}>
            <label>Portion Size</label>
            <div className={styles.sizeBtns}>
              {['small', 'medium', 'large'].map(s => (
                <button type="button" key={s} 
                  className={`${styles.szBtn} ${form.size === s ? styles.szActive : ''}`}
                  onClick={() => setForm(f=>({...f,size:s}))}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({foodOptions[form.foodIdx]?.cal[s]} cal)
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className={styles.saveBtn}>Save Entry</button>
        </form>
      )}

      {/* Today's Log */}
      {!showAdd && (
        <div className={`${styles.logSection} fade-up`}>
          <h3 className={styles.sectionTitle}>Today's Meals</h3>
          {loading ? <p className={styles.empty}>Loading...</p> : 
           log.length === 0 ? <p className={styles.empty}>No meals logged today. Tap + to add.</p> :
           <div className={styles.list}>
             {log.map((item, i) => (
               <div key={item._id} className={`${styles.logCard} fade-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                 <div className={styles.logIcon}>{item.icon}</div>
                 <div className={styles.logInfo}>
                   <h4 className={styles.logName}>{item.food}</h4>
                   <p className={styles.logMeta}>{item.meal} · {item.time}</p>
                 </div>
                 <div className={styles.logCal}>
                   <span className={styles.calVal}>{item.calories}</span>
                   <span className={styles.calLabel}>kcal</span>
                 </div>
                 <button className={styles.delBtn} onClick={() => handleDelete(item._id, item.calories)}>✕</button>
               </div>
             ))}
           </div>
          }
        </div>
      )}
    </div>
  )
}
