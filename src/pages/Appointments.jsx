// src/pages/Appointments.jsx
import { useEffect, useState } from 'react'
import { appointmentsAPI } from '../services/api'
import styles from './Appointments.module.css'

const MOCK = [
  { _id: '1', doctor: 'Dr. Priya Sharma', specialty: 'General Physician', date: '2026-04-02', time: '11:00 AM', icon: '🩺' },
  { _id: '2', doctor: 'Dr. Anil Mehta',   specialty: 'Cardiologist',      date: '2026-04-05', time: '4:30 PM',  icon: '🫀' },
]

export default function Appointments() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ doctor: '', specialty: '', date: '', time: '', icon: '🩺' })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    appointmentsAPI.getAll()
      .then(setItems)
      .catch(() => setItems(MOCK))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const created = await appointmentsAPI.create(form)
      setItems(prev => [...prev, created])
      setShowForm(false)
      setForm({ doctor: '', specialty: '', date: '', time: '', icon: '🩺' })
    } catch (err) {
      // fallback: add locally with temp id
      setItems(prev => [...prev, { ...form, _id: Date.now().toString() }])
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try { await appointmentsAPI.delete(id) } catch {}
    setItems(prev => prev.filter(i => i._id !== id))
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.pageHead} fade-up`}>
        <h2 className={styles.pageTitle}>Appointments</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form className={`${styles.form} fade-up`} onSubmit={handleAdd}>
          <input name="doctor"    value={form.doctor}    onChange={handleChange} placeholder="Doctor Name"  required />
          <input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Specialty"    required />
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <input name="time"      value={form.time}      onChange={handleChange} placeholder="Time e.g. 10:00 AM" required />
          <select name="icon" value={form.icon} onChange={handleChange}>
            <option value="🩺">🩺 General</option>
            <option value="🫀">🫀 Cardio</option>
            <option value="🧠">🧠 Neuro</option>
            <option value="🦷">🦷 Dental</option>
            <option value="👁️">👁️ Eye</option>
          </select>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.saveBtn} type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Appointment'}
          </button>
        </form>
      )}

      {loading ? (
        <p className={styles.empty}>Loading…</p>
      ) : items.length === 0 ? (
        <p className={styles.empty}>No appointments yet. Add one!</p>
      ) : (
        <div className={styles.list}>
          {items.map((item, i) => (
            <div key={item._id} className={`${styles.card} fade-up`} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={styles.icon}>{item.icon || '🩺'}</div>
              <div className={styles.info}>
                <p className={styles.name}>{item.doctor}</p>
                <p className={styles.spec}>{item.specialty}</p>
                <p className={styles.time}>{item.date} · {item.time}</p>
              </div>
              <button className={styles.del} onClick={() => handleDelete(item._id)}>🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
