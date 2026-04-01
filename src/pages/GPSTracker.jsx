import { useEffect, useState, useRef } from 'react'
import { locationsAPI } from '../services/api'
import styles from './GPSTracker.module.css'

// Leaflet requires window access, so we conditionally import/render it
let L;
let MapContainer, TileLayer, Marker, Popup, Circle, useMap;

export default function GPSTracker() {
  const [locations, setLocations] = useState([])
  const [userPos, setUserPos] = useState({ lat: 12.9680, lng: 77.5900 }) // Default Home
  const [alzheimerMode, setAlzheimerMode] = useState(false)
  const [statusText, setStatusText] = useState("Inside Safe Zone (Home)")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isAlert, setIsAlert] = useState(false)

  // Map instance ref for centering
  const mapRef = useRef(null)

  useEffect(() => {
    // Dynamic import for Leaflet to fix SSR/Vite issues if any
    Promise.all([
      import('leaflet'),
      import('react-leaflet')
    ]).then(([leaflet, reactLeaflet]) => {
      L = leaflet.default
      MapContainer = reactLeaflet.MapContainer
      TileLayer = reactLeaflet.TileLayer
      Marker = reactLeaflet.Marker
      Popup = reactLeaflet.Popup
      Circle = reactLeaflet.Circle
      useMap = reactLeaflet.useMap

      // Fix missing Leaflet icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setIsMapLoaded(true)
    })

    locationsAPI.getAll().then(setLocations)
    
    // Simulate GPS drift for hackathon demo
    const interval = setInterval(() => {
      setUserPos(prev => ({ lat: prev.lat + (Math.random()-0.5)*0.0001, lng: prev.lng + (Math.random()-0.5)*0.0001 }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Geofence check logic (simple distance)
  useEffect(() => {
    if(!locations.length) return;
    const home = locations.find(l => l.isHome) || locations[0]
    if (home) {
      // rough distance calc
      const dist = Math.sqrt(Math.pow(userPos.lat - home.lat, 2) + Math.pow(userPos.lng - home.lng, 2)) * 111000 // meters approx
      const allowedRadius = alzheimerMode ? 20 : 50
      
      if (dist > allowedRadius) {
        setIsAlert(true)
        setStatusText("🚨 Geofence Breached! Caretakers Notified.")
      } else {
        setIsAlert(false)
        setStatusText("🟢 Inside Safe Zone (Home)")
      }
    }
  }, [userPos, locations, alzheimerMode])

  const RecenterMap = ({ pos }) => {
    const map = useMap()
    useEffect(() => { map.setView(pos, 16) }, [pos, map])
    return null
  }

  const customIcon = (iconText) => {
    if (!L) return null;
    return L.divIcon({
      className: styles.customLeafletIcon,
      html: `<div>${iconText}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    })
  }

  const handleTestWander = () => {
    // Jump user far away to trigger geofence alert
    setUserPos({ lat: 12.9700, lng: 77.5950 })
  }
  const handleTestHome = () => {
    const home = locations.find(l => l.isHome)
    if(home) setUserPos({ lat: home.lat, lng: home.lng })
  }

  return (
    <div className={styles.page}>
      <h2 className={`${styles.title} fade-up`}>GPS Tracker</h2>

      {/* Status Banner */}
      <div className={`${styles.statusBanner} ${isAlert ? styles.alertStatus : ''} fade-up`}>
        <h3 className={styles.statusTitle}>Current Status</h3>
        <p className={styles.statusMsg}>{statusText}</p>
      </div>

      <div className={`${styles.actionsGrid} fade-up`}>
        <button className={styles.checkInBtn} onClick={() => alert("✅ Caretakers notified: 'I am okay!'")}>
          <span className={styles.btnIcon}>👋</span> I'm Okay
        </button>
        <button className={styles.sosBtn} onClick={() => alert("🚨 SOS Emergency! Sharing live GPS link to all contacts.")}>
          <span className={styles.btnIcon}>🚨</span> SOS
        </button>
      </div>

      {/* Map Container */}
      <div className={`${styles.mapCard} fade-up`}>
        {isMapLoaded ? (
          <MapContainer center={userPos} zoom={16} zoomControl={false} className={styles.leafletContainer}>
            <RecenterMap pos={userPos} />
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className={styles.darkMapFilter}
            />
            
            {/* User Marker */}
            <Marker position={userPos} icon={customIcon('👤')}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Safety Zones & Locations */}
            {locations.map(loc => (
              <div key={loc._id}>
                {loc.safe && (
                  <Circle 
                    center={[loc.lat, loc.lng]} 
                    pathOptions={{ color: 'var(--safe)', fillColor: 'var(--safe)', fillOpacity: 0.1, weight: 2 }} 
                    radius={alzheimerMode && loc.isHome ? 20 : 50} 
                  />
                )}
                <Marker position={[loc.lat, loc.lng]} icon={customIcon(loc.type)}>
                  <Popup>
                    <b>{loc.name}</b><br/>{loc.note}
                  </Popup>
                </Marker>
              </div>
            ))}
          </MapContainer>
        ) : (
          <div className={styles.mapLoading}>Loading Map...</div>
        )}
      </div>

      {/* Simulator Controls */}
      <div className={`${styles.controlsCard} fade-up`}>
        <h4 className={styles.controlsTitle}>⚙️ Simulation Controls (Demo)</h4>
        
        <div className={styles.modeToggle}>
          <div>
            <span className={styles.modeLabel}>Alzheimer's Mode</span>
            <span className={styles.modeDesc}>Tightens geofence to 20m</span>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={alzheimerMode} onChange={e => setAlzheimerMode(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.simButtons}>
          <button onClick={handleTestWander} className={styles.simBtn}>Wander Error</button>
          <button onClick={handleTestHome} className={styles.simBtn}>Return Home</button>
        </div>
      </div>

      {/* Safe Locations List */}
      <div className={`${styles.locationsList} fade-up`}>
        <h3 className={styles.listTitle}>Saved Locations</h3>
        <div className={styles.listGrid}>
          {locations.map(loc => (
            <div key={loc._id} className={styles.locCard}>
              <span className={styles.locIcon}>{loc.type}</span>
              <div>
                <p className={styles.locName}>{loc.name}</p>
                <p className={styles.locNote}>{loc.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
