import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminSignIn from './pages/AdminSignIn';
import Assessments from './pages/Assessments';
import CareerExplorer from './pages/CareerExplorer';
import Resources from './pages/Resources';
import AdminPanel from './pages/AdminPanel';
import PersonalityTest from './pages/PersonalityTest';
import SkillsEvaluation from './pages/SkillsEvaluation';
import InterestProfiler from './pages/InterestProfiler';
import Results from './pages/Results';
import Settings from './pages/Settings';
import { trackEvent } from './utils/analytics';
import './App.css';

function RouteAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location.pathname]);

  return null;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RouteAnalyticsTracker />
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/admin-signin" element={<AdminSignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/assessments" 
                element={
                  <PrivateRoute>
                    <Assessments />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/personality-test" 
                element={
                  <PrivateRoute>
                    <PersonalityTest />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/skills-evaluation" 
                element={
                  <PrivateRoute>
                    <SkillsEvaluation />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/interest-profiler" 
                element={
                  <PrivateRoute>
                    <InterestProfiler />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <PrivateRoute>
                    <Results />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/career-explorer" 
                element={
                  <PrivateRoute>
                    <CareerExplorer />
                  </PrivateRoute>
                } 
              />
              <Route path="/resources" element={<Resources />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;