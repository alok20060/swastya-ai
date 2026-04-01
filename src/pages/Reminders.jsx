import { useEffect, useState } from 'react'
import { remindersAPI } from '../services/api'
import { useHealth } from '../context/HealthContext'
import HealthTreeVisual from '../components/HealthTreeVisual'
import styles from './Reminders.module.css'

const ICONS = { medicine: '💊', water: '💧', meal: '🍽️', walk: '🚶', sleep: '😴', appointment: '🏥', custom: '📋' };

export default function Reminders() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('today') // today | all
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({ title: '', time: '', type: 'custom' })
  const [saving, setSaving] = useState(false)
  const { score, streak, updateProgress, addPoints } = useHealth()

  useEffect(() => {
    remindersAPI.getAll()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const takenCount = items.filter(i => i.status === 'done').length
    const totalCount = items.length
    const progressPct = totalCount ? Math.round((takenCount / totalCount) * 100) : 0
    updateProgress(progressPct)
  }, [items, updateProgress])

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done'
    // Optimistic UI update
    setItems(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r))
    try {
      await remindersAPI.updateStatus(id, newStatus)
      if (newStatus === 'done') addPoints(10);
    } catch {
      // Revert on fail
      setItems(prev => prev.map(r => r._id === id ? { ...r, status: currentStatus } : r))
    }
  }

  const handleDelete = async (id) => {
    setItems(prev => prev.filter(r => r._id !== id))
    try { await remindersAPI.delete(id) } catch { }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    const newRem = { ...form, icon: ICONS[form.type] }
    try {
      const created = await remindersAPI.create(newRem)
      setItems(prev => [...prev, created])
    } catch {
      setItems(prev => [...prev, { ...newRem, _id: Date.now().toString(), status: 'pending' }])
    }
    setSaving(false)
    setShowForm(false)
    setForm({ title: '', time: '', type: 'custom' })
  }

  // Sort by time (rough string comparison works well enough for 12hr AM/PM format here)
  const sortedItems = [...items].sort((a, b) => {
    const parseTime = t => {
      if (!t) return 0;
      const [time, modifier] = t.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      return parseInt(hours, 10) * 100 + parseInt(minutes, 10);
    }
    return parseTime(a.time) - parseTime(b.time)
  })

  // In a real app 'today' would filter by date, here we just show all non-done items first 
  // or everything depending on the visual tab.
  const displayItems = filter === 'today'
    ? sortedItems.filter(i => i.status === 'pending' || i.type === 'appointment')
    : sortedItems

  const takenCount = items.filter(i => i.status === 'done').length
  const totalCount = items.length
  const progressPct = totalCount ? Math.round((takenCount / totalCount) * 100) : 0

  return (
    <div className={styles.page}>
      <div className={`${styles.header} fade-up`}>
        <h2 className={styles.title}>Reminders</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {/* Integrated Health Tree Visual */}
      <div className="fade-up">
        <HealthTreeVisual pct={progressPct} score={score} streak={streak} />
      </div>

      {/* Form */}
      {showForm && (
        <form className={`${styles.form} fade-up`} onSubmit={handleAdd}>
          <div className={styles.field}>
            <label>Reminder Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Call Doctor" required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Time</label>
              <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="08:00 AM" required />
            </div>
            <div className={styles.field}>
              <label>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {Object.entries(ICONS).map(([key, icon]) => (
                  <option key={key} value={key}>{icon} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Reminder'}
          </button>
        </form>
      )}

      {/* Tabs */}
      {!showForm && (
        <div className={`${styles.tabs} fade-up`}>
          <button className={`${styles.tab} ${filter === 'today' ? styles.active : ''}`} onClick={() => setFilter('today')}>Pending Today</button>
          <button className={`${styles.tab} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All Schedule</button>
        </div>
      )}

      {/* List */}
      {!showForm && (
        <div className={styles.list}>
          {loading ? <p className={styles.empty}>Loading schedule...</p> :
            displayItems.length === 0 ? <p className={styles.empty}>All caught up! 🎉</p> :
              displayItems.map((item, i) => (
                <div key={item._id} className={`${styles.card} ${item.status === 'done' ? styles.done : ''} fade-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.icon}>{item.icon}</div>
                  <div className={styles.info}>
                    <h3 className={styles.name}>{item.title}</h3>
                    <p className={styles.time}>{item.time} {item.date ? `· ${item.date}` : ''}</p>
                    {item.editable === 'both' && <span className={styles.caretakerBadge}>👨‍👩‍👧 Caretaker synced</span>}
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.toggleBtn} ${item.status === 'done' ? styles.btnDone : ''}`}
                      onClick={() => handleToggle(item._id, item.status)}
                    >
                      {item.status === 'done' ? '✓' : 'Mark Done'}
                    </button>
                    <button className={styles.delBtn} onClick={() => handleDelete(item._id)}>✕</button>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  )
}
