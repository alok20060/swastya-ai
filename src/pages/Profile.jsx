import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileAPI } from '../services/api'
import AyurvedaTips from '../components/AyurvedaTips'
import DiseaseSelection from '../components/DiseaseSelection'
import CommunityChat from '../components/CommunityChat'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, logout, updateUser: updateContextUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  
  // States for Extra Features
  const [activeTab, setActiveTab] = useState('profile')
  const [selectedDisease, setSelectedDisease] = useState(null)

  // Medical Report Scanner
  const [scanResult, setScanResult] = useState(null)
  const [scanLoading, setScanLoading] = useState(false)
  const scanInputRef = useRef(null)

  const handleScanReport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanLoading(true);
    setScanResult(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBpDJ8O2uSceTergSF8gE62L9MbDIgbpjM';

    if (apiKey) {
      try {
        // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result.split(',')[1];
          const mimeType = file.type;

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: 'You are a medical AI. Analyze this medical report image and provide a clear, concise summary of the key findings, any abnormal values, and simple recommendations in plain language a patient can understand. Keep it under 150 words.' },
                  { inline_data: { mime_type: mimeType, data: base64 } }
                ]
              }]
            })
          });

          const json = await response.json();
          if (json.candidates?.[0]) {
            setScanResult(json.candidates[0].content.parts[0].text);
          } else {
            setScanResult('Could not analyze the report. Please try a clearer image.');
          }
          setScanLoading(false);
        };
      } catch (err) {
        setScanResult('Error analyzing report: ' + err.message);
        setScanLoading(false);
      }
    } else {
      // Mock fallback
      await new Promise(r => setTimeout(r, 2000));
      setScanResult('📋 Mock Scan Result:\n\nReport analyzed successfully. Key findings:\n• Blood Sugar (Fasting): 112 mg/dL — Slightly elevated, monitor diet\n• Hemoglobin: 13.2 g/dL — Normal range\n• Blood Pressure: 128/84 mmHg — Borderline, reduce salt intake\n\n💡 Recommendation: Schedule a follow-up with your doctor within 2 weeks. Maintain a low-sugar, low-sodium diet and continue daily walks.');
      setScanLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      profileAPI.get(),
      profileAPI.getEmergencyContacts()
    ]).then(([p, c]) => {
      setProfile(p)
      setEditForm(p)
      setContacts(c.sort((a,b) => a.priority - b.priority))
    }).finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    const updated = await profileAPI.update(editForm)
    setProfile(updated)
    updateContextUser(updated)
    setIsEditing(false)
    setLoading(false)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.page}>
      
      {/* Header / Avatar */}
      <div className={`${styles.header} fade-up`}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>{profile?.name?.[0] || 'U'}</div>
          {profile?.blood && <div className={styles.bloodBadge}>{profile.blood}</div>}
        </div>
        <h2 className={styles.name}>{profile?.name}</h2>
        <p className={styles.subtext}>Swastya-AI ID: SW-{profile?.email?.split('@')[0] || '1234'}</p>
        {!isEditing && (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>✎ Edit Profile</button>
        )}
      </div>

      {isEditing ? (
        <form className={`${styles.editForm} fade-up`} onSubmit={handleSave}>
          <h3 className={styles.sectionTitle}>Basic Info</h3>
          <div className={styles.field}>
            <label>Full Name</label>
            <input value={editForm.name||''} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Age</label>
              <input type="number" value={editForm.age||''} onChange={e=>setEditForm(f=>({...f,age:e.target.value}))} />
            </div>
            <div className={styles.field}>
              <label>Gender</label>
              <select value={editForm.gender||''} onChange={e=>setEditForm(f=>({...f,gender:e.target.value}))}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Blood</label>
              <input value={editForm.blood||''} onChange={e=>setEditForm(f=>({...f,blood:e.target.value}))} placeholder="e.g. O+" />
            </div>
          </div>
          
          <h3 className={styles.sectionTitle}>Physical</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Height (cm)</label>
              <input type="number" value={editForm.height||''} onChange={e=>setEditForm(f=>({...f,height:e.target.value}))} />
            </div>
            <div className={styles.field}>
              <label>Weight (kg)</label>
              <input type="number" value={editForm.weight||''} onChange={e=>setEditForm(f=>({...f,weight:e.target.value}))} />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => {setEditForm(profile); setIsEditing(false)}}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>Save Changes</button>
          </div>
        </form>
      ) : (
        <div className={styles.viewMode}>
          
          {/* Vitals Summary */}
          <div className={`${styles.statsCard} fade-up`}>
            <div className={styles.statBox}>
              <span className={styles.sLabel}>Age</span>
              <span className={styles.sVal}>{profile?.age || '--'}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.sLabel}>Height</span>
              <span className={styles.sVal}>{profile?.height ? profile.height+' cm' : '--'}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.sLabel}>Weight</span>
              <span className={styles.sVal}>{profile?.weight ? profile.weight+' kg' : '--'}</span>
            </div>
          </div>

          {/* Medical Profile */}
          <div className={`${styles.sectionBlock} fade-up`}>
            <h3 className={styles.blockTitle}>Medical Profile</h3>
            
            <div className={styles.dataRow}>
              <span className={styles.dIcon}>🏥</span>
              <div className={styles.dContent}>
                <span className={styles.dLabel}>Primary Doctor / Hospital</span>
                <span className={styles.dVal}>{profile?.doctor || 'Not set'} · {profile?.hospital || 'Not set'}</span>
              </div>
            </div>

            <div className={styles.dataRow}>
              <span className={styles.dIcon}>🩺</span>
              <div className={styles.dContent}>
                <span className={styles.dLabel}>Pre-existing Conditions</span>
                <div className={styles.tagsWrap}>
                  {profile?.conditions?.map(c => <span key={c} className={styles.tag}>{c}</span>) || 'None documented'}
                </div>
              </div>
            </div>

            <div className={styles.dataRow}>
              <span className={styles.dIcon}>⚠️</span>
              <div className={styles.dContent}>
                <span className={styles.dLabel}>Allergies</span>
                <div className={styles.tagsWrap}>
                  {profile?.allergies?.map(a => <span key={a} className={`${styles.tag} ${styles.tagCrit}`}>{a}</span>) || 'None documented'}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className={`${styles.sectionBlock} fade-up`}>
            <div className={styles.blockHead}>
              <h3 className={styles.blockTitle}>Emergency Contacts</h3>
            </div>
            
            <div className={styles.contactsList}>
              {contacts.map((c, i) => (
                <div key={c._id} className={styles.contactRow}>
                  <div className={styles.cAvatar}>{c.name[0]}</div>
                  <div className={styles.cInfo}>
                    <p className={styles.cName}>{c.name} <span className={styles.cRel}>({c.relation})</span></p>
                    <p className={styles.cPhone}>{c.phone}</p>
                  </div>
                  <a href={`tel:${c.phone}`} className={styles.callBtn}>📞</a>
                </div>
              ))}
            </div>
            <button className={styles.addContactBtn}>+ Manage Contacts</button>
          </div>

          {/* Action Buttons */}
          <div className={`${styles.bottomActions} fade-up`}>
            <input
              type="file"
              accept="image/*,application/pdf"
              ref={scanInputRef}
              style={{ display: 'none' }}
              onChange={handleScanReport}
            />
            <button className={styles.docScanBtn} onClick={() => scanInputRef.current.click()} disabled={scanLoading}>
              <span className={styles.aIcon}>📄</span>
              {scanLoading ? 'Analyzing...' : 'Scan Medical Report'}
            </button>
            <button className={styles.logoutBtn} onClick={logout}>
              Log Out
            </button>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div className={`${styles.sectionBlock} fade-up`} style={{ background: '#f0f9ff', border: '1px solid #bae6fd', marginTop: 16 }}>
              <h3 className={styles.blockTitle}>🧾 AI Medical Report Analysis</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#1e293b', fontSize: '0.95rem' }}>{scanResult}</p>
            </div>
          )}

          {/* Real-time Features Tabs */}
          <div className={`${styles.sectionBlock} fade-up`} style={{ marginTop: '30px', padding: '10px', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <h3 className={styles.blockTitle} style={{ textAlign: 'center', marginBottom: '20px' }}>Explore Swastya-AI Features</h3>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              <button 
                className={styles.addContactBtn} 
                style={{ background: activeTab === 'profile' ? '#5B6EF5' : '#e0e7ff', color: activeTab === 'profile' ? '#fff' : '#5B6EF5', width: 'auto', padding: '10px 20px', margin: 0 }}
                onClick={() => setActiveTab('profile')}
              >
                Profile Info
              </button>
              <button 
                className={styles.addContactBtn} 
                style={{ background: activeTab === 'community' ? '#5B6EF5' : '#e0e7ff', color: activeTab === 'community' ? '#fff' : '#5B6EF5', width: 'auto', padding: '10px 20px', margin: 0 }}
                onClick={() => setActiveTab('community')}
              >
                Community Support
              </button>
              <button 
                className={styles.addContactBtn} 
                style={{ background: activeTab === 'ayurveda' ? '#5B6EF5' : '#e0e7ff', color: activeTab === 'ayurveda' ? '#fff' : '#5B6EF5', width: 'auto', padding: '10px 20px', margin: 0 }}
                onClick={() => setActiveTab('ayurveda')}
              >
                Ayurveda Tips
              </button>
            </div>

            {/* Render the selected feature */}
            {activeTab === 'community' && !selectedDisease && (
              <DiseaseSelection onSelectDisease={setSelectedDisease} />
            )}
            {activeTab === 'community' && selectedDisease && (
              <CommunityChat disease={selectedDisease} onBack={() => setSelectedDisease(null)} />
            )}
            {activeTab === 'ayurveda' && (
              <AyurvedaTips />
            )}
          </div>

        </div>
      )}
    </div>
  )
}
