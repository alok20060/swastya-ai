import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from '../Auth.module.css';

export default function Step4_Device() {
  const { updateData } = useOnboarding();
  const { handleNext, handleBack } = useOutletContext();
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let timer;
    if (scanning) {
      timer = setTimeout(() => {
        setDevices([
          { id: '1', name: 'Swastya Band Pro v2' },
          { id: '2', name: 'Apple Watch Series 8' }
        ]);
        setScanning(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [scanning]);

  const connectDevice = (id) => {
    setScanning(true);
    setDevices([]); // clear UI
    setTimeout(() => {
      setScanning(false);
      setConnected(true);
      updateData({ deviceId: id });
    }, 1500);
  };

  const handleSkip = () => {
    updateData({ deviceId: null });
    handleNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
      <button onClick={handleBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Pair Wearable Device</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Connect a health tracker to automate vital tracking.</p>

      {connected ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '24px' }}>✓</div>
          <h3 style={{ fontSize: '1.2rem' }}>Device Connected!</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your vitals will now sync automatically.</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className={styles.btn} onClick={() => setScanning(true)} disabled={scanning} style={{ flex: 1 }}>
              {scanning ? 'Scanning...' : 'Scan Bluetooth'}
            </button>
            <button className={styles.btn} style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              Scan QR
            </button>
          </div>

          {scanning && devices.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              Looking for devices nearby...
            </div>
          )}

          {devices.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Found Devices</div>
              {devices.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '8px' }}>
                  <span>{d.name}</span>
                  <button onClick={() => connectDevice(d.id)} style={{ background: 'none', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer' }}>Connect</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button className={styles.btn} onClick={handleSkip} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          Skip for now
        </button>
        <button className={styles.btn} onClick={handleNext} disabled={!connected} style={{ flex: 2, background: connected ? 'var(--accent)' : 'var(--border)', color: connected ? '#FFF' : 'var(--text-muted)' }}>
          Continue
        </button>
      </div>
    </div>
  );
}
