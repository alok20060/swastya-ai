# 🩺 SWASTYA·AI — Frontend

A React (Vite) health app frontend with dark Noise-inspired UI.

---

## 📁 Project Structure

```
swastya-ai/
├── index.html
├── vite.config.js          ← Vite config + API proxy
├── package.json
├── .env.example            ← Copy to .env
└── src/
    ├── main.jsx            ← App entry point
    ├── App.jsx             ← Routes & auth guard
    ├── styles/
    │   └── global.css      ← CSS variables, resets, animations
    ├── context/
    │   └── AuthContext.jsx ← Global login/logout state
    ├── services/
    │   └── api.js          ← ALL backend API calls (single source of truth)
    ├── components/
    │   ├── Layout.jsx      ← Bottom nav shell
    │   └── Layout.module.css
    └── pages/
        ├── Login.jsx / Auth.module.css
        ├── Signup.jsx
        ├── Home.jsx / Home.module.css         ← Dashboard + vitals + ECG
        ├── Appointments.jsx / .module.css    ← CRUD appointments
        ├── Medications.jsx / .module.css     ← Medication tracker + toggle
        ├── GPSTracker.jsx / .module.css      ← Live GPS + Leaflet map + saved spots
        └── Profile.jsx / .module.css         ← User info + stats + logout
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_API_URL=/api   # or https://your-backend.com/api
```

### 3. Start dev server
```bash
npm run dev
```
App runs at **http://localhost:5173**

### 4. Build for production
```bash
npm run build
```

---

## 🔌 Backend Integration

All API calls live in **`src/services/api.js`**.  
To connect your backend, just update `VITE_API_URL` in `.env`.

### Expected API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns `{ token, user }` |
| POST | `/api/auth/signup` | Signup → returns `{ token, user }` |
| GET  | `/api/auth/profile` | Get current user |
| GET  | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Create appointment |
| PUT  | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |
| GET  | `/api/medications` | List medications |
| POST | `/api/medications` | Create medication |
| PATCH | `/api/medications/:id/toggle` | Toggle taken status |
| DELETE | `/api/medications/:id` | Delete medication |
| GET  | `/api/locations` | List saved GPS locations |
| POST | `/api/locations` | Save a GPS location |
| DELETE | `/api/locations/:id` | Delete a location |
| GET  | `/api/vitals/latest` | Latest vitals (HR, SpO2, steps, temp) |

### Auth
All protected routes send:
```
Authorization: Bearer <token>
```
Token is stored in `localStorage` under key `swastya_token`.

---

## 📱 Pages

| Page | Route | Features |
|------|-------|----------|
| Login | `/login` | Email + password auth |
| Signup | `/signup` | Register with name, email, age |
| Home | `/` | Vitals grid, live ECG, AI insight |
| Appointments | `/appointments` | List, add, delete appointments |
| Medications | `/medications` | List, add, toggle taken, progress bar |
| GPS Tracker | `/gps` | Live GPS, Leaflet dark map, save locations |
| Profile | `/profile` | User info, health stats, edit, logout |

---

## 🗺️ GPS Tracker Notes

- Uses **Leaflet** + **OpenStreetMap (CartoDB dark tiles)** — no API key needed
- Click **"Locate Me"** → browser prompts for GPS permission
- Saves locations to backend; falls back to local state if API unavailable
- Click a saved location card to fly the map to that spot

---

## 🎨 Design System

All design tokens are CSS variables in `src/styles/global.css`:

```css
--bg:      #0a0c10   /* main background */
--surface: #12151c   /* elevated surface */
--card:    #181c26   /* card background */
--accent:  #00e5a0   /* primary green */
--accent2: #00aaff   /* secondary blue */
--warn:    #ff6b6b   /* red / warning */
--text:    #e8eaf2   /* primary text */
--muted:   #5a607a   /* secondary text */
```

---

## 🔧 Vite Proxy (Dev Only)

`vite.config.js` proxies `/api` → `http://localhost:5000`  
Change the target to match your backend port.

---

## 📦 Dependencies

- `react` + `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `leaflet` + `react-leaflet` — Interactive maps
