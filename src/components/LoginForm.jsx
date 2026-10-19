import React, { useState } from 'react';
import { User, LogIn, Loader2 } from 'lucide-react';
import PasswordField from './PasswordField';
import { loginUser } from '../services/authService';

export default function LoginForm({
  onSuccess,
  onError,
  onForgotPasswordClick,
  onSwitchToSignup,
}) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.identifier.trim()) {
      errors.identifier = 'User ID or email address is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
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
    // Clear specific field error on typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await loginUser({
        identifier: formData.identifier,
        password: formData.password,
      });

      // Pass actual successful response from POST /api/auth/login
      onSuccess(response, formData.identifier);
    } catch (err) {
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Identifier field (User ID or Email) */}
      <div className="form-group">
        <label htmlFor="login-identifier" className="form-label">
          User ID or Email <span className="required-star">*</span>
        </label>
        <div className={`input-wrapper ${fieldErrors.identifier ? 'has-error' : ''}`}>
          <span className="input-icon" aria-hidden="true">
            <User size={18} />
          </span>
          <input
            id="login-identifier"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="e.g. user_1029 or name@example.com"
            disabled={isLoading}
            autoComplete="username"
            className="form-input"
          />
        </div>
        {fieldErrors.identifier && (
          <span className="field-error-msg">{fieldErrors.identifier}</span>
        )}
      </div>

      {/* Password field with show/hide toggle */}
      <PasswordField
        id="login-password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        label="Password"
        required
        disabled={isLoading}
        error={fieldErrors.password}
        autoComplete="current-password"
      />

      {/* Options Row: Remember Me & Forgot Password */}
      <div className="form-row-utility">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={isLoading}
          />
          <span>Remember me</span>
        </label>

        <button
          type="button"
          className="link-btn"
          onClick={onForgotPasswordClick}
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="primary-submit-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="spinner" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <LogIn size={18} />
            <span>Sign In</span>
          </>
        )}
      </button>

      {/* Footer switcher */}
      <div className="auth-footer-switch">
        <span>Don't have an account?</span>
        <button
          type="button"
          className="switch-action-btn"
          onClick={onSwitchToSignup}
          disabled={isLoading}
        >
          Create an account
        </button>
      </div>
    </form>
  );
}
