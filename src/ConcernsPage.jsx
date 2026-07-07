import React, { useState } from 'react';
import { AlertCircle, Plus, MessageSquare, TrendingUp } from 'lucide-react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';

const ConcernsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState('medium');
  const { concerns, addConcern } = useData();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      console.log('📝 Creating concern:', { title, description, riskLevel, reporter: user.name, reporter_id: user.id });
      await addConcern(title, description, riskLevel, user.name, user.id);
      setTitle('');
      setDescription('');
      setRiskLevel('medium');
      setShowForm(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      low: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', label: 'Low' },
      medium: { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706', label: 'Medium' },
      high: { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626', label: 'High' },
      critical: { bg: 'rgba(153, 27, 27, 0.1)', text: '#7F1D1D', label: 'Critical' },
    };
    return colors[level] || colors.medium; // Default to medium if level not found
  };

  const getStatusColor = (status) => {
    const colors = {
      open: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366F1' },
      in_progress: { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706' },
      resolved: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
    };
    return colors[status] || colors.open; // Default to open if status not found
  };

  return (
    <div>
      <div className="f-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="f-eyebrow">Concern Management</div>
          <h1 className="f-title">Raise Supply Chain Concerns</h1>
          <p className="f-subtitle">
            Report potential risks and vulnerabilities in the supply chain network. Your concerns help management make informed decisions.
          </p>
        </div>
        <button
          className="f-btn primary"
          onClick={() => setShowForm(!showForm)}
          style={{ marginTop: 0 }}
        >
          <Plus size={14} /> New Concern
        </button>
      </div>

      {showForm && (
        <div className="f-card" style={{ marginBottom: 20, background: 'rgba(99, 102, 241, 0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
            Report New Concern
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                Concern Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Supplier reliability concerns"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the concern in detail..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                Risk Level
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="f-btn primary">Submit Concern</button>
              <button
                type="button"
                className="f-btn ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="f-card">
          <div className="f-stat-label">Total Concerns</div>
          <div className="f-stat-value">{concerns.length}</div>
        </div>
        <div className="f-card">
          <div className="f-stat-label">Open Issues</div>
          <div className="f-stat-value" style={{ color: '#DC2626' }}>
            {concerns.filter(c => c.status === 'open').length}
          </div>
        </div>
        <div className="f-card">
          <div className="f-stat-label">Critical Concerns</div>
          <div className="f-stat-value" style={{ color: '#6366F1' }}>
            {concerns.filter(c => c.riskLevel === 'critical').length}
          </div>
        </div>
      </div>

      <div className="f-card">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            Reported Concerns
          </div>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {concerns.length === 0 ? (
            <p style={{ color: '#6B7280', margin: 0 }}>No concerns reported yet</p>
          ) : (
            concerns.map((concern) => {
              const riskColor = getRiskColor(concern.riskLevel);
              const statusColor = getStatusColor(concern.status);
              return (
                <div
                  key={concern.id}
                  style={{
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#1F2937' }}>
                        {concern.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
                        {concern.description}
                      </p>
                    </div>
                    <div style={{
                      background: riskColor.bg,
                      color: riskColor.text,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      {riskColor.label}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
                    <div>Reported by {concern.reporter} on {concern.date}</div>
                    <div style={{
                      background: statusColor.bg,
                      color: statusColor.text,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      textTransform: 'capitalize',
                    }}>
                      {concern.status}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcernsPage;
