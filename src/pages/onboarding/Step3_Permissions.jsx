import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from '../Auth.module.css';

export default function Step3_Permissions() {
  const { handleNext, handleBack } = useOutletContext();
  const [permissions, setPermissions] = useState({ bluetooth: false, location: false, contacts: false });

  const togglePermission = (key) => setPermissions(p => ({ ...p, [key]: !p[key] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
      <button onClick={handleBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>App Permissions</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Swastya AI needs access to some device features to provide accurate health insights.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Bluetooth & Nearby Devices</div>
          </div>
          <button onClick={() => togglePermission('bluetooth')} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: permissions.bluetooth ? 'var(--accent)' : 'var(--border)', color: permissions.bluetooth ? '#FFF' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
            {permissions.bluetooth ? 'Allowed' : 'Allow'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Location Services</div>
          </div>
          <button onClick={() => togglePermission('location')} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: permissions.location ? 'var(--accent)' : 'var(--border)', color: permissions.location ? '#FFF' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
            {permissions.location ? 'Allowed' : 'Allow'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Emergency Contacts</div>
          </div>
          <button onClick={() => togglePermission('contacts')} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: permissions.contacts ? 'var(--accent)' : 'var(--border)', color: permissions.contacts ? '#FFF' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
            {permissions.contacts ? 'Allowed' : 'Allow'}
          </button>
        </div>

      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button className={styles.btn} onClick={handleNext} style={{ flex: 1 }}>
          Continue
        </button>
      </div>
    </div>
  );
}
