import React, { useState, useEffect } from 'react';
import { Server, CheckCircle2, XCircle, RefreshCw, Settings, Check } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl } from '../config/api';
import { checkBackendHealth } from '../services/authService';

export default function ApiConfigBadge({ onUrlChange }) {
  const [currentUrl, setCurrentUrl] = useState(getApiBaseUrl());
  const [status, setStatus] = useState('unknown'); // 'unknown' | 'online' | 'offline' | 'checking'
  const [isOpen, setIsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(getApiBaseUrl());

  const runHealthCheck = async () => {
    setStatus('checking');
    const result = await checkBackendHealth();
    setStatus(result.online ? 'online' : 'offline');
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setApiBaseUrl(tempUrl);
    setCurrentUrl(getApiBaseUrl());
    setIsOpen(false);
    runHealthCheck();
    if (onUrlChange) onUrlChange(getApiBaseUrl());
  };

  const handleReset = () => {
    resetApiBaseUrl();
    const defaultUrl = getApiBaseUrl();
    setCurrentUrl(defaultUrl);
    setTempUrl(defaultUrl);
    setIsOpen(false);
    runHealthCheck();
    if (onUrlChange) onUrlChange(defaultUrl);
  };

  return (
    <div className="api-badge-container">
      <div className="api-badge-pill">
        <span
          className={`status-dot ${
            status === 'online'
              ? 'dot-online'
              : status === 'offline'
              ? 'dot-offline'
              : 'dot-checking'
          }`}
          title={`Backend status: ${status}`}
        />
        <span className="api-badge-text">
          API: <code className="api-url-code">{currentUrl}</code>
        </span>

        <button
          type="button"
          className="api-icon-btn"
          onClick={runHealthCheck}
          title="Test backend connection"
          aria-label="Test backend connection"
        >
          <RefreshCw size={13} className={status === 'checking' ? 'spinner' : ''} />
        </button>

        <button
          type="button"
          className="api-icon-btn"
          onClick={() => {
            setTempUrl(currentUrl);
            setIsOpen(!isOpen);
          }}
          title="Configure API Base URL"
          aria-label="Configure API Base URL"
        >
          <Settings size={13} />
        </button>
      </div>

      {isOpen && (
        <div className="api-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="api-config-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Server size={18} />
              <h4>API Base URL Setting</h4>
            </div>
            <p className="modal-sub">
              Default is read from <code className="env-var-tag">VITE_API_BASE_URL</code>. You can override it here for immediate testing.
            </p>

            <form onSubmit={handleSave}>
              <div className="modal-input-group">
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  className="modal-url-input"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-secondary"
                  onClick={handleReset}
                >
                  Reset to Default
                </button>
                <button type="submit" className="modal-btn-primary">
                  <Check size={14} />
                  <span>Apply URL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
