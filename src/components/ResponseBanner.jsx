import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function ResponseBanner({ response, onDismiss }) {
  const [expanded, setExpanded] = useState(false);

  if (!response) return null;

  const isSuccess = response.type === 'success';
  const isError = response.type === 'error';

  return (
    <div
      className={`response-banner ${isSuccess ? 'banner-success' : ''} ${
        isError ? 'banner-error' : ''
      }`}
      role="alert"
    >
      <div className="banner-header">
        <div className="banner-icon">
          {isSuccess && <CheckCircle2 size={20} />}
          {isError && <AlertCircle size={20} />}
          {!isSuccess && !isError && <Info size={20} />}
        </div>

        <div className="banner-content">
          <div className="banner-title-row">
            <span className="banner-title">{response.title || (isSuccess ? 'Success' : 'Error')}</span>
            {response.status !== undefined && (
              <span className={`status-pill ${response.status >= 200 && response.status < 300 ? 'status-pill-success' : 'status-pill-error'}`}>
                HTTP {response.status === 0 ? 'Network Error' : response.status}
              </span>
            )}
          </div>
          <p className="banner-message">{response.message}</p>
        </div>

        {onDismiss && (
          <button
            type="button"
            className="banner-close-btn"
            onClick={onDismiss}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {response.payload && (
        <div className="banner-details-section">
          <button
            type="button"
            className="toggle-payload-btn"
            onClick={() => setExpanded(!expanded)}
          >
            <span>{expanded ? 'Hide server response details' : 'View actual server response payload'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <pre className="banner-payload-pre">
              <code>{JSON.stringify(response.payload, null, 2)}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
