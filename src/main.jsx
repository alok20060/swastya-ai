// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

/* Global Click Animation Logic */
window.addEventListener('mousedown', (e) => {
  // 1. Ripple Effect on Buttons
  const btn = e.target.closest('button');
  if (btn) {
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // 2. Particle Burst Effect
  const particleCount = 6;
  const colors = ['#10B981', '#059669', '#34D399', '#6EE7B7'];

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'click-particle';
    const size = Math.random() * 6 + 4;
    p.style.width = p.style.height = `${size}px`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${e.clientX - size / 2}px`;
    p.style.top = `${e.clientY - size / 2}px`;

    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 40 + 20;
    p.style.setProperty('--x', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--y', `${Math.sin(angle) * dist}px`);

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
