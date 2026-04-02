// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { HealthProvider } from './context/HealthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import HealthDashboard from './pages/HealthDashboard';
import Reminders from './pages/Reminders';
import Chatbot from './pages/Chatbot';
import FoodLog from './pages/FoodLog';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import GPSTracker from './pages/GPSTracker';
import Profile from './pages/Profile';
import Connect from './pages/Connect';

// Onboarding imports
import OnboardingLayout from './components/OnboardingLayout';
import Step1_Terms from './pages/onboarding/Step1_Terms';
import Step2_Auth from './pages/onboarding/Step2_Auth';
import Step3_Permissions from './pages/onboarding/Step3_Permissions';
import Step4_Device from './pages/onboarding/Step4_Device';
import Step5_PersonalInfo from './pages/onboarding/Step5_PersonalInfo';
import Step6_Location from './pages/onboarding/Step6_Location';
import Step7_Goal from './pages/onboarding/Step7_Goal';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#5B6EF5', fontFamily: 'Poppins,sans-serif', fontSize: '1.1rem', gap: '10px' }}>
      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>💙</span> Loading Swastya-AI…
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  // Enforce onboarding completion if user is logged in
  if (user && !user.onboardingComplete) {
    return <Navigate to="/onboarding/terms" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HealthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Onboarding Flow */}
              <Route path="/onboarding" element={<OnboardingLayout />}>
                <Route path="terms" element={<Step1_Terms />} />
                <Route path="auth" element={<Step2_Auth />} />
                <Route path="permissions" element={<Step3_Permissions />} />
                <Route path="device" element={<Step4_Device />} />
                <Route path="personal" element={<Step5_PersonalInfo />} />
                <Route path="location" element={<Step6_Location />} />
                <Route path="goal" element={<Step7_Goal />} />
              </Route>

              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Home />} />
                <Route path="health" element={<HealthDashboard />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="chat" element={<Chatbot />} />
                <Route path="food" element={<FoodLog />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="medications" element={<Medications />} />
                <Route path="gps" element={<GPSTracker />} />
                <Route path="profile" element={<Profile />} />
                <Route path="connect" element={<Connect />} />
                <Route path="tree" element={<Navigate to="/reminders" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HealthProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
