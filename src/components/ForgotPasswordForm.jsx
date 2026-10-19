import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, Loader2, KeyRound } from 'lucide-react';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordForm({
  onSuccess,
  onError,
  onBackToLogin,
}) {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!identifier.trim()) {
      setError('Please provide your registered User ID or email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await forgotPassword({ identifier });
      setSubmitted(true);
      onSuccess(
        response,
        `Password reset instructions sent to the account associated with "${identifier}".`
      );
    } catch (err) {
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="forgot-password-success-view">
        <div className="icon-circle success-circle">
          <KeyRound size={28} />
        </div>
        <h3 className="sub-heading">Recovery Request Dispatched</h3>
        <p className="sub-text">
          If an account exists for <strong className="highlight-text">{identifier}</strong>, you will receive password reset instructions.
        </p>
        <button
          type="button"
          className="primary-submit-btn mt-4"
          onClick={onBackToLogin}
        >
          <ArrowLeft size={18} />
          <span>Return to Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <p className="form-description">
        Enter your registered User ID or email address below. We'll verify your credentials and send recovery instructions.
      </p>

      <div className="form-group">
        <label htmlFor="forgot-identifier" className="form-label">
          User ID or Email <span className="required-star">*</span>
        </label>
        <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
          <span className="input-icon" aria-hidden="true">
            <Mail size={18} />
          </span>
          <input
            id="forgot-identifier"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. user_1029 or name@example.com"
            disabled={isLoading}
            autoComplete="username"
            className="form-input"
          />
        </div>
        {error && <span className="field-error-msg">{error}</span>}
      </div>

      <button
        type="submit"
        className="primary-submit-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="spinner" />
            <span>Sending Request...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Send Reset Instructions</span>
          </>
        )}
      </button>

      <div className="auth-footer-switch">
        <button
          type="button"
          className="back-to-login-btn"
          onClick={onBackToLogin}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>
      </div>
    </form>
  );
}
