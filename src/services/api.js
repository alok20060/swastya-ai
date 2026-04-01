// src/services/api.js
// Swastya-AI — Complete Mock Backend (localStorage-powered)

const delay = (ms) => new Promise(res => setTimeout(res, ms));
const getStorage = (key, defaultVal) => {
  try { return JSON.parse(localStorage.getItem(key)) || defaultVal; }
  catch { return defaultVal; }
};
const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ── Seed Data ──────────────────────────────────────────

const SEED_USERS = [
  { name: 'Rahul Sharma', email: 'user@example.com', password: 'password', token: 'v2-jwt-demo-123' }
];
const SEED_APPOINTMENTS = [];
const SEED_MEDICATIONS = [];
const SEED_REMINDERS = [];

const INDIAN_FOODS = {
  'South Indian': [
    { name: 'Idli (3 pcs)', cal: { small: 120, medium: 180, large: 260 }, icon: '🍚' },
    { name: 'Dosa', cal: { small: 130, medium: 200, large: 300 }, icon: '🥞' },
    { name: 'Rice + Sambar', cal: { small: 250, medium: 380, large: 520 }, icon: '🍛' },
    { name: 'Upma', cal: { small: 150, medium: 230, large: 320 }, icon: '🥣' },
    { name: 'Chapati + Curry', cal: { small: 200, medium: 320, large: 450 }, icon: '🫓' },
    { name: 'Pongal', cal: { small: 180, medium: 270, large: 380 }, icon: '🍲' },
    { name: 'Curd Rice', cal: { small: 180, medium: 260, large: 360 }, icon: '🍚' },
    { name: 'Vada (2 pcs)', cal: { small: 150, medium: 220, large: 310 }, icon: '🍩' },
  ],
  'North Indian': [
    { name: 'Paratha + Curd', cal: { small: 220, medium: 350, large: 480 }, icon: '🫓' },
    { name: 'Dal + Roti (2)', cal: { small: 250, medium: 380, large: 500 }, icon: '🍛' },
    { name: 'Rajma Chawal', cal: { small: 280, medium: 420, large: 560 }, icon: '🍚' },
    { name: 'Poha', cal: { small: 140, medium: 220, large: 310 }, icon: '🥣' },
    { name: 'Chole Bhature', cal: { small: 300, medium: 450, large: 620 }, icon: '🍛' },
    { name: 'Paneer Curry + Roti', cal: { small: 280, medium: 400, large: 540 }, icon: '🧀' },
  ],
  'Bengali': [
    { name: 'Rice + Fish Curry', cal: { small: 300, medium: 440, large: 580 }, icon: '🐟' },
    { name: 'Luchi + Aloo Dum', cal: { small: 260, medium: 380, large: 500 }, icon: '🫓' },
    { name: 'Mishti Doi', cal: { small: 120, medium: 180, large: 250 }, icon: '🍮' },
    { name: 'Khichdi', cal: { small: 180, medium: 270, large: 370 }, icon: '🍚' },
  ],
  'Gujarati': [
    { name: 'Dhokla (4 pcs)', cal: { small: 140, medium: 210, large: 290 }, icon: '🍰' },
    { name: 'Thepla + Chutney', cal: { small: 180, medium: 270, large: 370 }, icon: '🫓' },
    { name: 'Dal-Rice-Roti Thali', cal: { small: 320, medium: 480, large: 640 }, icon: '🍽️' },
    { name: 'Undhiyu', cal: { small: 220, medium: 330, large: 450 }, icon: '🥘' },
  ],
  'Snacks': [
    { name: 'Tea / Chai', cal: { small: 40, medium: 70, large: 100 }, icon: '🍵' },
    { name: 'Biscuits (4 pcs)', cal: { small: 80, medium: 140, large: 200 }, icon: '🍪' },
    { name: 'Banana', cal: { small: 60, medium: 90, large: 120 }, icon: '🍌' },
    { name: 'Dry Fruits Mix', cal: { small: 100, medium: 160, large: 230 }, icon: '🥜' },
    { name: 'Fruit Salad', cal: { small: 60, medium: 100, large: 150 }, icon: '🍎' },
  ],
};

const SEED_FOOD_LOG = [];

const SEED_LOCATIONS = [
  { _id: '1', name: 'Apollo Hospital', lat: 12.9716, lng: 77.5946, type: '🏥', note: 'Primary care hospital', safe: false },
  { _id: '2', name: 'Lakshmi Medical Store', lat: 12.9750, lng: 77.5990, type: '💊', note: 'Nearby pharmacy', safe: false },
  { _id: '3', name: 'Home', lat: 12.9680, lng: 77.5900, type: '🏠', note: 'Safe zone · Geofence active', safe: true, isHome: true },
  { _id: '4', name: 'Lalbagh Park', lat: 12.9507, lng: 77.5848, type: '🌳', note: 'Morning walk area', safe: true },
];

const EMERGENCY_CONTACTS = [
  { _id: 'e1', name: 'Rahul Sharma', phone: '+91 98765 43210', relation: 'Son', priority: 1 },
  { _id: 'e2', name: 'Priya Sharma', phone: '+91 98765 43211', relation: 'Daughter', priority: 2 },
  { _id: 'e3', name: 'Anita Kumari', phone: '+91 98765 43212', relation: 'Caretaker', priority: 3 },
];

// ── Vitals Generator ──────────────────────────────────

function generateVitalsHistory(days = 7) {
  return []; // Return empty history for fresh account
}

function generateWeeklySteps() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({ day, steps: 3000 + Math.floor(Math.random() * 7000) }));
}

function generateSleepData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    deep: 1 + Math.random() * 2.5,
    light: 2 + Math.random() * 2,
    rem: 0.5 + Math.random() * 1.5,
  }));
}

// ── Storage Init ──────────────────────────────────────

let users = getStorage('v2_users', SEED_USERS);
let appointments = getStorage('v2_appointments', SEED_APPOINTMENTS);
let medications = getStorage('v2_medications', SEED_MEDICATIONS);
let reminders = getStorage('v2_reminders', SEED_REMINDERS);
let foodLog = getStorage('v2_food_log', SEED_FOOD_LOG);
let locations = getStorage('v2_locations', SEED_LOCATIONS);
let emergencyContacts = getStorage('v2_emergency', EMERGENCY_CONTACTS);
let userProfile = getStorage('v2_profile', {
  name: 'New User',
  age: null,
  gender: '-',
  blood: '-',
  height: null,
  weight: null,
  language: 'English',
  conditions: [],
  familyHistory: [],
  allergies: [],
  doctor: '-',
  hospital: '-',
  insurance: '-',
  region: 'South Indian',
});
let vitalsHistory = getStorage('v2_vitals_history', generateVitalsHistory());

// ── Helpers ──────────────────────────────────────────

const getToken = () => localStorage.getItem('v2_token');
const currentUser = () => users.find(u => u.token === getToken());

// ── Auth API ─────────────────────────────────────────

import { supabase } from './supabase';

export const authAPI = {
  login: async (data) => {
    let session = null;
    let user = null;

    if (data.phone) {
      // OTP Verification flow
      const { data: authData, error } = await supabase.auth.verifyOtp({
        phone: data.phone,
        token: data.otp,
        type: 'sms'
      });
      if (error) throw new Error(error.message);
      session = authData.session;
      user = authData.user;
    } else {
      // Standard Email/Password Login
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      if (error) throw new Error(error.message);
      session = authData.session;
      user = authData.user;
    }
    
    localStorage.setItem('v2_token', session.access_token);
    return { token: session.access_token, user: { ...userProfile, email: user.email, phone: user.phone, id: user.id } };
  },
  sendOTP: async (phone) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw new Error(error.message);
    return true;
  },
  signup: async (data) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } }
    });
    if (error) throw new Error(error.message);
    
    // Save locally for fallback mock data
    userProfile = { ...userProfile, name: data.name, email: data.email };
    setStorage('v2_profile', userProfile);
    
    return { token: authData.session?.access_token || 'pending', user: { ...userProfile, email: data.email } };
  },
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('v2_token');
    return { success: true };
  },
  profile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !localStorage.getItem('v2_token')) throw new Error('Not authenticated');
    return { ...userProfile, email: user?.email };
  },
  updateProfile: async (data) => {
    await delay(400);
    userProfile = { ...userProfile, ...data };
    setStorage('v2_profile', userProfile);
    return userProfile;
  },
};

// ── Appointments API ─────────────────────────────────

export const appointmentsAPI = {
  getAll: async () => { await delay(300); return appointments; },
  create: async (data) => {
    await delay(400);
    const item = { ...data, _id: Date.now().toString(), status: 'Upcoming' };
    appointments.push(item);
    setStorage('v2_appointments', appointments);
    return item;
  },
  update: async (id, data) => {
    await delay(300);
    appointments = appointments.map(a => a._id === id ? { ...a, ...data } : a);
    setStorage('v2_appointments', appointments);
    return appointments.find(a => a._id === id);
  },
  delete: async (id) => {
    await delay(300);
    appointments = appointments.filter(a => a._id !== id);
    setStorage('v2_appointments', appointments);
    return { success: true };
  },
};

// ── Medications API ──────────────────────────────────

export const medicationsAPI = {
  getAll: async () => { await delay(300); return medications; },
  create: async (data) => {
    await delay(400);
    const item = { ...data, _id: Date.now().toString(), taken: false };
    medications.push(item);
    setStorage('v2_medications', medications);
    return item;
  },
  toggle: async (id) => {
    await delay(150);
    medications = medications.map(m => m._id === id ? { ...m, taken: !m.taken } : m);
    setStorage('v2_medications', medications);
    return medications.find(m => m._id === id);
  },
  delete: async (id) => {
    await delay(300);
    medications = medications.filter(m => m._id !== id);
    setStorage('v2_medications', medications);
    return { success: true };
  },
};

// ── Reminders API ────────────────────────────────────

export const remindersAPI = {
  getAll: async () => { await delay(300); return reminders; },
  create: async (data) => {
    await delay(400);
    const item = { ...data, _id: 'r' + Date.now(), status: 'pending' };
    reminders.push(item);
    setStorage('v2_reminders', reminders);
    return item;
  },
  updateStatus: async (id, status) => {
    await delay(150);
    reminders = reminders.map(r => r._id === id ? { ...r, status } : r);
    setStorage('v2_reminders', reminders);
    return reminders.find(r => r._id === id);
  },
  delete: async (id) => {
    await delay(300);
    reminders = reminders.filter(r => r._id !== id);
    setStorage('v2_reminders', reminders);
    return { success: true };
  },
};

// ── Food Log API ─────────────────────────────────────

export const foodAPI = {
  getFoods: async (region) => {
    await delay(200);
    return INDIAN_FOODS[region] || INDIAN_FOODS['South Indian'];
  },
  getAllRegions: async () => {
    await delay(100);
    return Object.keys(INDIAN_FOODS);
  },
  getLog: async () => { await delay(300); return foodLog; },
  addEntry: async (data) => {
    await delay(300);
    const item = { ...data, _id: 'f' + Date.now() };
    foodLog.push(item);
    setStorage('v2_food_log', foodLog);
    return item;
  },
  deleteEntry: async (id) => {
    await delay(200);
    foodLog = foodLog.filter(f => f._id !== id);
    setStorage('v2_food_log', foodLog);
    return { success: true };
  },
  getDailySummary: async () => {
    await delay(200);
    const totalIn = foodLog.reduce((sum, f) => sum + (f.calories || 0), 0);
    const stepsToday = 6420;
    const caloriesOut = Math.round(stepsToday * 0.04 + 1400); // BMR + activity
    return { caloriesIn: totalIn, caloriesOut, stepsToday, balance: totalIn - caloriesOut };
  },
};

// ── Vitals API ───────────────────────────────────────

export const vitalsAPI = {
  getLatest: async () => {
    await delay(400);
    return {
      heartRate: null,
      spo2: null,
      steps: 0,
      skinTemp: null,
      stressScore: null,
      sleepHours: 0,
      recoveryScore: 0,
    };
  },
  getHistory: async (days = 7) => {
    await delay(500);
    return vitalsHistory.slice(-days * 12);
  },
  getWeeklySteps: async () => { await delay(300); return generateWeeklySteps(); },
  getSleepData: async () => { await delay(300); return generateSleepData(); },
  checkHealth: async (vitals) => {
    await delay(300);
    let level = 'STABLE';
    const reasons = [];

    if (vitals.heartRate > 130 || vitals.heartRate < 50) {
      level = 'CRITICAL';
      reasons.push(`Heart rate ${vitals.heartRate} BPM is dangerous`);
    } else if (vitals.heartRate > 100 || vitals.heartRate < 60) {
      if (level !== 'CRITICAL') level = 'CAUTION';
      reasons.push(`Heart rate ${vitals.heartRate} BPM needs attention`);
    }

    if (vitals.spo2 < 90) {
      level = 'CRITICAL';
      reasons.push(`SpO2 ${vitals.spo2}% is critically low`);
    } else if (vitals.spo2 < 95) {
      if (level !== 'CRITICAL') level = 'CAUTION';
      reasons.push(`SpO2 ${vitals.spo2}% is below normal`);
    }

    if (vitals.stressScore > 70) {
      if (level !== 'CRITICAL') level = 'CAUTION';
      reasons.push(`Stress level is high (${vitals.stressScore}/100)`);
    }

    const actions = {
      STABLE: 'All vitals normal. No action needed.',
      CAUTION: 'Notifying user and caretakers. Please check on the elder.',
      CRITICAL: 'AUTO-CALLING 112 → Notifying ALL contacts → Sharing GPS location',
    };

    return { status: level, reasons, action: actions[level], timestamp: new Date().toISOString() };
  },
  getRiskAssessment: async () => {
    await delay(400);
    return [
      { disease: 'Diabetes', risk: 62, level: 'Medium' },
      { disease: 'Cardiac', risk: 35, level: 'Low' },
      { disease: 'Respiratory', risk: 18, level: 'Low' },
      { disease: 'Alzheimer\'s', risk: 25, level: 'Low' },
      { disease: 'Liver', risk: 12, level: 'Low' },
      { disease: 'Kidney', risk: 28, level: 'Low' },
    ];
  },
};

// ── Locations API ────────────────────────────────────

export const locationsAPI = {
  getAll: async () => { await delay(300); return locations; },
  save: async (data) => {
    await delay(400);
    const item = { ...data, _id: Date.now().toString() };
    locations.push(item);
    setStorage('v2_locations', locations);
    return item;
  },
  delete: async (id) => {
    await delay(300);
    locations = locations.filter(l => l._id !== id);
    setStorage('v2_locations', locations);
    return { success: true };
  },
};

// ── Emergency Contacts API ───────────────────────────

export const emergencyAPI = {
  getAll: async () => { await delay(200); return emergencyContacts; },
  add: async (data) => {
    await delay(300);
    const item = { ...data, _id: 'e' + Date.now() };
    emergencyContacts.push(item);
    setStorage('v2_emergency', emergencyContacts);
    return item;
  },
  delete: async (id) => {
    await delay(200);
    emergencyContacts = emergencyContacts.filter(e => e._id !== id);
    setStorage('v2_emergency', emergencyContacts);
    return { success: true };
  },
};

// ── Chatbot API ──────────────────────────────────────

const CHATBOT_RESPONSES = {
  vitals: [
    `Your current heart rate is {hr} BPM which is {hrStatus}. SpO2 is at {spo2}% — {spo2Status}. You've taken {steps} steps today. Overall looking {overall}! 💙`,
  ],
  food: [
    `I see you've logged {calories} calories today. {foodAdvice} Remember to stay hydrated — have you had your water? 💧`,
  ],
  unwell: [
    `I'm sorry to hear you're not feeling well, {name} ji. Your current vitals show HR: {hr} BPM, SpO2: {spo2}%. {unwellAdvice} Should I alert your son Rahul? 🙏`,
  ],
  medicine: [
    `Your upcoming medicines: Vitamin D3 at 1:00 PM, Atorvastatin at 9:00 PM. You've taken {taken}/{total} medicines today. {medAdvice} 💊`,
  ],
  general: [
    `That's a great question! {response} Always remember to consult Dr. Priya Sharma for specific medical advice. I'm here to help you stay healthy! 🙏`,
    `{name} ji, {response} Keep up your daily walks and remember to take all your medicines on time. You're doing wonderfully! 💙`,
  ],
};

export const chatbotAPI = {
  sendMessage: async (message, context = {}) => {
    await delay(800 + Math.random() * 600);

    const name = context.name || userProfile.name || 'Friend';
    const hr = context.heartRate || 74;
    const spo2 = context.spo2 || 97;
    const steps = context.steps || 6420;

    const msg = message.toLowerCase();
    let reply = '';

    if (msg.includes('vital') || msg.includes('heart') || msg.includes('health') || msg.includes('bp')) {
      const hrStatus = hr > 100 ? 'slightly elevated — please rest' : hr < 60 ? 'a bit low — are you feeling okay?' : 'perfectly normal';
      const spo2Status = spo2 < 95 ? 'slightly low, take deep breaths' : 'excellent';
      const overall = hr > 100 || spo2 < 95 ? 'like you could use some rest' : 'great';
      reply = CHATBOT_RESPONSES.vitals[0]
        .replace('{hr}', hr).replace('{hrStatus}', hrStatus)
        .replace('{spo2}', spo2).replace('{spo2Status}', spo2Status)
        .replace('{steps}', steps.toLocaleString()).replace('{overall}', overall);
    } else if (msg.includes('food') || msg.includes('eat') || msg.includes('rice') || msg.includes('dosa') || msg.includes('calorie') || msg.includes('lunch') || msg.includes('dinner')) {
      const totalCal = foodLog.reduce((s, f) => s + (f.calories || 0), 0);
      const foodAdvice = totalCal < 800 ? 'You haven\'t eaten much today — please have a proper meal soon.' : totalCal > 1800 ? 'You\'ve eaten well today. Maybe a light dinner would be good.' : 'Your intake looks balanced so far.';
      reply = CHATBOT_RESPONSES.food[0].replace('{calories}', totalCal).replace('{foodAdvice}', foodAdvice);
    } else if (msg.includes('unwell') || msg.includes('pain') || msg.includes('chest') || msg.includes('tight') || msg.includes('dizzy') || msg.includes('sick')) {
      const unwellAdvice = hr > 100 ? `Your heart rate is elevated at ${hr} BPM. Please sit down and rest immediately.` : 'Your vitals appear stable, but please take rest and monitor how you feel.';
      reply = CHATBOT_RESPONSES.unwell[0].replace('{name}', name).replace('{hr}', hr).replace('{spo2}', spo2).replace('{unwellAdvice}', unwellAdvice);
    } else if (msg.includes('medicine') || msg.includes('tablet') || msg.includes('metformin') || msg.includes('order')) {
      const taken = medications.filter(m => m.taken).length;
      const medAdvice = taken === medications.length ? 'Great job — all medicines taken!' : `Please don't forget the remaining ${medications.length - taken} medicine(s).`;
      reply = CHATBOT_RESPONSES.medicine[0].replace('{taken}', taken).replace('{total}', medications.length).replace('{medAdvice}', medAdvice);
    } else {
      const responses = [
        `Based on your health profile, I recommend maintaining a balanced diet with your South Indian meals and continuing your daily walks.`,
        `That's something I'd recommend discussing with Dr. Priya Sharma at your next appointment on April 5th.`,
        `Your recovery score today is 78/100 which is good! Keep maintaining your routine.`,
        `I notice you have a doctor's appointment coming up. Would you like me to remind you about it?`,
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const template = CHATBOT_RESPONSES.general[Math.floor(Math.random() * CHATBOT_RESPONSES.general.length)];
      reply = template.replace('{name}', name).replace('{response}', response);
    }

    return { reply, timestamp: new Date().toISOString() };
  },
};

// ── Profile API ──────────────────────────────────────

export const profileAPI = {
  get: async () => { await delay(200); return userProfile; },
  update: async (data) => {
    await delay(300);
    userProfile = { ...userProfile, ...data };
    setStorage('v2_profile', userProfile);
    return userProfile;
  },
  getEmergencyContacts: async () => emergencyAPI.getAll(),
};

// ── Onboarding API ───────────────────────────────────

export const onboardingAPI = {
  completeOnboarding: async (data) => {
    await delay(500);
    // Merge onboarding data into userProfile
    userProfile = {
      ...userProfile,
      termsAccepted: data.termsAccepted,
      authMethod: data.authMethod,
      deviceId: data.deviceId,
      personalInfo: data.personalInfo,
      habits: data.habits,
      location: data.location,
      stepGoal: data.stepGoal,
      onboardingComplete: true
    };
    if (data.personalInfo) {
      userProfile.name = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`;
      userProfile.age = data.personalInfo.age;
      userProfile.gender = data.personalInfo.gender;
      userProfile.height = data.personalInfo.height;
      userProfile.weight = data.personalInfo.weight;
    }
    setStorage('v2_profile', userProfile);

    // Also update the users array if this user exists
    let token = localStorage.getItem('v2_token');
    if (token) {
      users = users.map(u => u.token === token ? { ...u, ...userProfile } : u);
      setStorage('v2_users', users);
    }

    return userProfile;
  }
};
