import React, { useState } from 'react';
import { Lightbulb, Plus } from 'lucide-react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';

const SuggestionsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedConcernId, setSelectedConcernId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { concerns, suggestions, addSuggestion } = useData();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedConcernId && title.trim() && description.trim()) {
      addSuggestion(parseInt(selectedConcernId), title, description, user.name);
      setTitle('');
      setDescription('');
      setSelectedConcernId('');
      setShowForm(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366F1' },
      in_progress: { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706' },
      resolved: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
      pending: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366F1' },
    };
    return colors[status] || colors.open;
  };

  return (
    <div>
      <div className="f-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="f-eyebrow">Manager Insights</div>
          <h1 className="f-title">Suggest Risk Mitigation Strategies</h1>
          <p className="f-subtitle">
            Analyze reported concerns and provide strategic suggestions to mitigate supply chain risks. Your insights help leadership make better decisions.
          </p>
        </div>
        <button
          className="f-btn primary"
          onClick={() => setShowForm(!showForm)}
          style={{ marginTop: 0 }}
        >
          <Plus size={14} /> New Suggestion
        </button>
      </div>

      {showForm && (
        <div className="f-card" style={{ marginBottom: 20, background: 'rgba(99, 102, 241, 0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
            Propose Mitigation Strategy
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                Select Concern to Address
              </label>
              <select
                value={selectedConcernId}
                onChange={(e) => setSelectedConcernId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                <option value="">-- Select a concern --</option>
                {concerns.map((concern) => (
                  <option key={concern.id} value={concern.id}>
                    {concern.title} ({concern.riskLevel})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                Suggestion Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Establish redundant supplier partnerships"
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
                Detailed Strategy
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the mitigation strategy, expected outcomes, and implementation steps..."
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
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="f-btn primary">Submit Suggestion</button>
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
          <div className="f-stat-label">Total Suggestions</div>
          <div className="f-stat-value" style={{ color: '#6366F1' }}>
            {suggestions.length}
          </div>
        </div>
        <div className="f-card">
          <div className="f-stat-label">Pending Review</div>
          <div className="f-stat-value" style={{ color: '#D97706' }}>
            {suggestions.filter(s => s.status === 'pending').length}
          </div>
        </div>
      </div>

      <div className="f-card">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={18} />
            Manager Suggestions
          </div>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestions.length === 0 ? (
            <p style={{ color: '#6B7280', margin: 0 }}>No suggestions yet</p>
          ) : (
            suggestions.map((suggestion) => {
              const concern = concerns.find(c => c.id === suggestion.concernId);
              const statusColor = getStatusColor(suggestion.status);
              return (
                <div
                  key={suggestion.id}
                  style={{
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#1F2937' }}>
                      {suggestion.title}
                    </h4>
                    {concern && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6366F1', fontWeight: 500 }}>
                        For: {concern.title}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
                      {suggestion.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
                    <div>Suggested by {suggestion.proposedBy} on {suggestion.date}</div>
                    <div style={{
                      background: statusColor.bg,
                      color: statusColor.text,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      textTransform: 'capitalize',
                    }}>
                      {suggestion.status}
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

export default SuggestionsPage;
