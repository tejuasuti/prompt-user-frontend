import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter password',
  label = 'Password',
  required = false,
  disabled = false,
  error = '',
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="form-group">
      <div className="form-label-row">
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      </div>

      <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
        <span className="input-icon" aria-hidden="true">
          <Lock size={18} />
        </span>
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className="form-input password-input"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          className="password-toggle-btn"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
}
