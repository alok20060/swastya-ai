// src/components/Layout.jsx
import { Outlet, NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

const navItems = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/health', icon: '❤️', label: 'Health' },
  { to: '/reminders', icon: '⏰', label: 'Remind' },
  { to: '/chat', icon: '💬', label: 'Chat' },
  { to: '/connect', icon: '🤝', label: 'Connect' },
]

export default function Layout() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav}>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{icon}</span>
            <span className={styles.navLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
