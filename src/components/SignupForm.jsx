import React, { useState } from 'react';
import { User, Mail, UserPlus, Loader2, Check } from 'lucide-react';
import PasswordField from './PasswordField';
import { signupUser } from '../services/authService';

export default function SignupForm({
  onSuccess,
  onError,
  onSwitchToLogin,
}) {
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Compute password strength score (0 to 4)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 2, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 3, label: 'Good', color: '#3b82f6' };
      case 4:
        return { score: 4, label: 'Strong', color: '#10b981' };
      default:
        return { score: 0, label: 'Very Weak', color: '#ef4444' };
    }
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errors = {};

    // Validate User ID
    if (!formData.userId.trim()) {
      errors.userId = 'User ID is required';
    } else if (formData.userId.trim().length < 3) {
      errors.userId = 'User ID must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.userId.trim())) {
      errors.userId = 'User ID can only contain letters, numbers, hyphens, and underscores';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate Password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate Terms
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms of service';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await signupUser({
        userId: formData.userId,
        email: formData.email,
        password: formData.password,
      });

      // Pass actual successful response from POST /api/auth/signup
      onSuccess(response, formData.userId);
    } catch (err) {
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* User ID field */}
      <div className="form-group">
        <label htmlFor="signup-userId" className="form-label">
          User ID <span className="required-star">*</span>
        </label>
        <div className={`input-wrapper ${fieldErrors.userId ? 'has-error' : ''}`}>
          <span className="input-icon" aria-hidden="true">
            <User size={18} />
          </span>
          <input
            id="signup-userId"
            name="userId"
            type="text"
            value={formData.userId}
            onChange={handleChange}
            placeholder="Choose unique user handle (e.g. dev_alex)"
            disabled={isLoading}
            autoComplete="username"
            className="form-input"
          />
        </div>
        {fieldErrors.userId && (
          <span className="field-error-msg">{fieldErrors.userId}</span>
        )}
      </div>

      {/* Email address field */}
      <div className="form-group">
        <label htmlFor="signup-email" className="form-label">
          Email Address <span className="required-star">*</span>
        </label>
        <div className={`input-wrapper ${fieldErrors.email ? 'has-error' : ''}`}>
          <span className="input-icon" aria-hidden="true">
            <Mail size={18} />
          </span>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@domain.com"
            disabled={isLoading}
            autoComplete="email"
            className="form-input"
          />
        </div>
        {fieldErrors.email && (
          <span className="field-error-msg">{fieldErrors.email}</span>
        )}
      </div>

      {/* Password with strength meter */}
      <div className="password-block">
        <PasswordField
          id="signup-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create strong password"
          label="Password"
          required
          disabled={isLoading}
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        {formData.password && (
          <div className="strength-meter-container">
            <div className="strength-bars">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`strength-bar-segment ${
                    level <= strength.score ? 'active' : ''
                  }`}
                  style={{
                    backgroundColor:
                      level <= strength.score ? strength.color : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              ))}
            </div>
            <span className="strength-label" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <PasswordField
        id="signup-confirm-password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Re-type password"
        label="Confirm Password"
        required
        disabled={isLoading}
        error={fieldErrors.confirmPassword}
        autoComplete="new-password"
      />

      {/* Terms Agreement */}
      <div className="form-row-utility">
        <label className="checkbox-label terms-checkbox">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            disabled={isLoading}
          />
          <span>
            I agree to the <span className="highlight-text">Terms of Service</span> &amp; <span className="highlight-text">Privacy Policy</span>
          </span>
        </label>
      </div>
      {fieldErrors.acceptTerms && (
        <span className="field-error-msg mb-2">{fieldErrors.acceptTerms}</span>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="primary-submit-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="spinner" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <UserPlus size={18} />
            <span>Create Account</span>
          </>
        )}
      </button>

      {/* Footer switcher */}
      <div className="auth-footer-switch">
        <span>Already have an account?</span>
        <button
          type="button"
          className="switch-action-btn"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Sign in instead
        </button>
      </div>
    </form>
  );
}
