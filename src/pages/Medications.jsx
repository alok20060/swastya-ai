// src/pages/Medications.jsx
import { useEffect, useState } from 'react'
import { medicationsAPI } from '../services/api'
import styles from './Medications.module.css'

const MOCK = [
  { _id: '1', name: 'Metformin 500mg', dose: 'After breakfast · 8:00 AM', taken: true,  icon: '💊' },
  { _id: '2', name: 'Vitamin D3',      dose: 'With lunch · 1:00 PM',      taken: false, icon: '🧪' },
  { _id: '3', name: 'Omega-3',         dose: 'After dinner · 8:00 PM',    taken: false, icon: '🫙' },
]

export default function Medications() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', dose: '', icon: '💊' })

  useEffect(() => {
    medicationsAPI.getAll()
      .then(setItems)
      .catch(() => setItems(MOCK))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (id) => {
    try { await medicationsAPI.toggle(id) } catch {}
    setItems(prev => prev.map(i => i._id === id ? { ...i, taken: !i.taken } : i))
  }

  const handleAdd = async e => {
    e.preventDefault()
    try {
      const created = await medicationsAPI.create(form)
      setItems(prev => [...prev, created])
    } catch {
      setItems(prev => [...prev, { ...form, _id: Date.now().toString(), taken: false }])
    }
    setShowForm(false)
    setForm({ name: '', dose: '', icon: '💊' })
  }

  const handleDelete = async (id) => {
    try { await medicationsAPI.delete(id) } catch {}
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const taken = items.filter(i => i.taken).length
  const pct   = items.length ? Math.round((taken / items.length) * 100) : 0

  return (
    <div className={styles.page}>
      <div className={`${styles.pageHead} fade-up`}>
        <h2 className={styles.pageTitle}>Medications</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕' : '+ Add'}
        </button>
      </div>

      {/* Progress */}
      <div className={`${styles.progress} fade-up`}>
        <div className={styles.progressInfo}>
          <span>{taken}/{items.length} taken today</span>
          <span className={styles.pct}>{pct}%</span>
        </div>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {showForm && (
        <form className={`${styles.form} fade-up`} onSubmit={handleAdd}>
          <input name="name" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Medicine name & dose" required />
          <input name="dose" value={form.dose} onChange={e => setForm(f=>({...f,dose:e.target.value}))} placeholder="When to take (e.g. After breakfast · 8:00 AM)" required />
          <select name="icon" value={form.icon} onChange={e => setForm(f=>({...f,icon:e.target.value}))}>
            <option value="💊">💊 Pill</option>
            <option value="🧪">🧪 Liquid</option>
            <option value="🫙">🫙 Capsule</option>
            <option value="💉">💉 Injection</option>
          </select>
          <button className={styles.saveBtn} type="submit">Save</button>
        </form>
      )}

      {loading ? (
        <p className={styles.empty}>Loading…</p>
      ) : (
        <div className={styles.list}>
          {items.map((item, i) => (
            <div key={item._id} className={`${styles.card} fade-up`} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={`${styles.icon} ${item.taken ? styles.iconTaken : ''}`}>{item.icon}</div>
              <div className={styles.info}>
                <p className={`${styles.name} ${item.taken ? styles.strikethrough : ''}`}>{item.name}</p>
                <p className={styles.dose}>{item.dose}</p>
              </div>
              <div className={styles.actions}>
                <div
                  className={`${styles.toggle} ${item.taken ? styles.on : styles.off}`}
                  onClick={() => toggle(item._id)}
                  title={item.taken ? 'Mark as not taken' : 'Mark as taken'}
                />
                <button className={styles.del} onClick={() => handleDelete(item._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
