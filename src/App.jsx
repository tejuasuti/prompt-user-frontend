import React, { useState } from 'react';
import { Shield, Sparkles, LogIn, UserPlus } from 'lucide-react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResponseBanner from './components/ResponseBanner';
import ApiConfigBadge from './components/ApiConfigBadge';
import UserDashboard from './components/UserDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [authSession, setAuthSession] = useState(null);
  const [apiFeedback, setApiFeedback] = useState(null);

  // Clears active notification banner
  const clearFeedback = () => setApiFeedback(null);

  // Handle successful login
  const handleLoginSuccess = (response, identifier) => {
    setApiFeedback({
      type: 'success',
      title: 'Authentication Successful',
      message: `Welcome back, ${identifier}! Successfully authenticated via POST /api/auth/login.`,
      status: response.status,
      payload: response.data,
    });
    setAuthSession({
      identifier,
      ...response,
    });
  };

  // Handle successful sign up
  const handleSignupSuccess = (response, userId) => {
    setApiFeedback({
      type: 'success',
      title: 'Account Created Successfully',
      message: `User "${userId}" registered successfully via POST /api/auth/signup. You may now log in.`,
      status: response.status,
      payload: response.data,
    });
    // Switch to login tab so the user can sign in
    setActiveTab('login');
  };

  // Handle successful forgot password
  const handleForgotPasswordSuccess = (response, message) => {
    setApiFeedback({
      type: 'success',
      title: 'Reset Request Processed',
      message: message || 'Recovery instructions have been sent.',
      status: response.status,
      payload: response.data,
    });
  };

  // Handle API error
  const handleApiError = (error) => {
    let title = 'Authentication Error';
    let message = error.message;

    if (error.isNetworkError) {
      title = 'Network Connection Failed';
    } else if (error.status === 401) {
      title = 'Invalid Credentials';
    } else if (error.status === 409) {
      title = 'Account Conflict';
    } else if (error.status >= 500) {
      title = 'Backend Server Error';
    }

    setApiFeedback({
      type: 'error',
      title,
      message,
      status: error.status,
      payload: error.responseBody || null,
    });
  };

  // Handle logout
  const handleLogout = () => {
    setAuthSession(null);
    setApiFeedback({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been successfully signed out.',
    });
    setActiveTab('login');
  };

  return (
    <div className="portal-wrapper">
      {/* Dynamic ambient gradient background shapes */}
      <div className="ambient-orb orb-1" aria-hidden="true" />
      <div className="ambient-orb orb-2" aria-hidden="true" />
      <div className="ambient-orb orb-3" aria-hidden="true" />

      {/* Main glassmorphism card container */}
      <main className="glass-container">
        {/* Header branding */}
        <header className="card-header">
          <div className="brand-badge">
            <div className="brand-icon">
              <Shield size={22} className="shield-icon" />
            </div>
            <div className="brand-text-group">
              <span className="brand-subtitle">Prompt User ID</span>
              <span className="brand-dot">•</span>
              <span className="brand-chip">Portal</span>
            </div>
          </div>

          <h1 className="portal-title">
            {authSession
              ? 'User Dashboard'
              : activeTab === 'login'
              ? 'Welcome Back'
              : activeTab === 'signup'
              ? 'Create Account'
              : 'Recover Password'}
          </h1>
          <p className="portal-subtitle">
            {authSession
              ? 'Real-time authenticated session details'
              : activeTab === 'login'
              ? 'Enter your User ID and password to access your account'
              : activeTab === 'signup'
              ? 'Sign up for a secure Prompt User ID profile'
              : 'We will help you regain access to your account'}
          </p>
        </header>

        {/* Global API response and error banner */}
        <ResponseBanner response={apiFeedback} onDismiss={clearFeedback} />

        {/* Content View: Either Authenticated Dashboard or Auth Forms */}
        {authSession ? (
          <UserDashboard authData={authSession} onLogout={handleLogout} />
        ) : (
          <div className="auth-card-body">
            {/* Tab navigation for Login / Sign Up */}
            {activeTab !== 'forgot' && (
              <div className="tab-navigation" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'login'}
                  className={`tab-btn ${activeTab === 'login' ? 'active-tab' : ''}`}
                  onClick={() => {
                    setActiveTab('login');
                    clearFeedback();
                  }}
                >
                  <LogIn size={16} />
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'signup'}
                  className={`tab-btn ${activeTab === 'signup' ? 'active-tab' : ''}`}
                  onClick={() => {
                    setActiveTab('signup');
                    clearFeedback();
                  }}
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Form Views */}
            {activeTab === 'login' && (
              <LoginForm
                onSuccess={handleLoginSuccess}
                onError={handleApiError}
                onForgotPasswordClick={() => {
                  setActiveTab('forgot');
                  clearFeedback();
                }}
                onSwitchToSignup={() => {
                  setActiveTab('signup');
                  clearFeedback();
                }}
              />
            )}

            {activeTab === 'signup' && (
              <SignupForm
                onSuccess={handleSignupSuccess}
                onError={handleApiError}
                onSwitchToLogin={() => {
                  setActiveTab('login');
                  clearFeedback();
                }}
              />
            )}

            {activeTab === 'forgot' && (
              <ForgotPasswordForm
                onSuccess={handleForgotPasswordSuccess}
                onError={handleApiError}
                onBackToLogin={() => {
                  setActiveTab('login');
                  clearFeedback();
                }}
              />
            )}
          </div>
        )}

        {/* API Backend Status bar */}
        <footer className="card-footer">
          <ApiConfigBadge onUrlChange={() => clearFeedback()} />
        </footer>
      </main>
    </div>
  );
}
