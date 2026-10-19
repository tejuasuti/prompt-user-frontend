import React, { useState } from 'react';
import { UserCheck, LogOut, ShieldCheck, Key, Database, ChevronDown, ChevronUp } from 'lucide-react';

export default function UserDashboard({ authData, onLogout }) {
  const [showJson, setShowJson] = useState(false);

  // Extract fields from real response payload
  const rawData = authData?.data || {};
  const user = rawData.user || rawData.data?.user || rawData;
  const token = rawData.token || rawData.accessToken || rawData.jwt || rawData.data?.token || 'N/A';
  const userId = user.userId || user.username || user.id || authData?.identifier || 'Authenticated User';
  const email = user.email || (authData?.identifier?.includes('@') ? authData.identifier : 'Not provided');
  const role = user.role || 'Member';

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div className="dashboard-avatar">
          <ShieldCheck size={32} />
        </div>
        <div className="dashboard-title-group">
          <span className="badge-verified">Verified Session</span>
          <h2 className="dashboard-welcome">Welcome, {userId}</h2>
          <p className="dashboard-sub">{email}</p>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><UserCheck size={18} /></div>
          <div className="stat-info">
            <span className="stat-label">User ID / Handle</span>
            <span className="stat-value">{userId}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Key size={18} /></div>
          <div className="stat-info">
            <span className="stat-label">Security Role</span>
            <span className="stat-value">{role}</span>
          </div>
        </div>
      </div>

      {token !== 'N/A' && (
        <div className="token-display-box">
          <div className="token-label">
            <Key size={14} />
            <span>Active Bearer Token</span>
          </div>
          <code className="token-code">
            {typeof token === 'string' && token.length > 36
              ? `${token.slice(0, 18)}...${token.slice(-12)}`
              : token}
          </code>
        </div>
      )}

      {/* Raw Payload Inspector */}
      <div className="raw-response-accordion">
        <button
          type="button"
          className="accordion-trigger"
          onClick={() => setShowJson(!showJson)}
        >
          <Database size={15} />
          <span>Real Server Response Data (Live API)</span>
          {showJson ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showJson && (
          <pre className="accordion-content">
            <code>{JSON.stringify(authData, null, 2)}</code>
          </pre>
        )}
      </div>

      <button
        type="button"
        className="logout-btn"
        onClick={onLogout}
      >
        <LogOut size={18} />
        <span>Sign Out Session</span>
      </button>
    </div>
  );
}
