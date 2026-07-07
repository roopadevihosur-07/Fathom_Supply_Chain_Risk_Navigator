import React, { useState } from 'react';
import { Wrench, Plus, Edit2, Trash2 } from 'lucide-react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';

const SolutionsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedConcernId, setSelectedConcernId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [timeToResolve, setTimeToResolve] = useState('');
  const [coverage, setCoverage] = useState('');
  const [recommended, setRecommended] = useState(false);
  const { concerns, solutions, suggestions, addSolution, updateSolution } = useData();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedConcernId && title.trim() && description.trim() && cost && timeToResolve && coverage.trim()) {
      if (editingId) {
        updateSolution(editingId, {
          title,
          description,
          cost: parseInt(cost),
          timeToResolve: parseInt(timeToResolve),
          coverage,
          recommended,
        });
        setEditingId(null);
      } else {
        addSolution(
          parseInt(selectedConcernId),
          title,
          description,
          parseInt(cost),
          parseInt(timeToResolve),
          coverage,
          recommended,
          user.name
        );
      }
      resetForm();
      setShowForm(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCost('');
    setTimeToResolve('');
    setCoverage('');
    setRecommended(false);
    setSelectedConcernId('');
  };

  const editSolution = (solution) => {
    setEditingId(solution.id);
    setSelectedConcernId(solution.concernId);
    setTitle(solution.title);
    setDescription(solution.description);
    setCost(solution.cost.toString());
    setTimeToResolve(solution.timeToResolve.toString());
    setCoverage(solution.coverage);
    setRecommended(solution.recommended);
    setShowForm(true);
  };

  const getTotalCost = () => {
    return solutions.reduce((sum, s) => sum + s.cost, 0);
  };

  return (
    <div>
      <div className="f-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="f-eyebrow">Admin Solutions</div>
          <h1 className="f-title">Manage Risk Mitigation Solutions</h1>
          <p className="f-subtitle">
            Create, edit, and manage solutions to supply chain risks. Evaluate suggestions from managers and implement approved strategies.
          </p>
        </div>
        <button
          className="f-btn primary"
          onClick={() => { resetForm(); setShowForm(!showForm); setEditingId(null); }}
          style={{ marginTop: 0 }}
        >
          <Plus size={14} /> New Solution
        </button>
      </div>

      {showForm && (
        <div className="f-card" style={{ marginBottom: 20, background: 'rgba(99, 102, 241, 0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
            {editingId ? 'Edit Solution' : 'Create New Solution'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                Select Concern
              </label>
              <select
                value={selectedConcernId}
                onChange={(e) => setSelectedConcernId(e.target.value)}
                disabled={editingId !== null}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  opacity: editingId ? 0.6 : 1,
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                  Solution Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Emergency reroute plan"
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
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                  Implementation Cost ($)
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="46000"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                  Time to Resolve (days)
                </label>
                <input
                  type="number"
                  value={timeToResolve}
                  onChange={(e) => setTimeToResolve(e.target.value)}
                  placeholder="5"
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
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                  Network Coverage
                </label>
                <input
                  type="text"
                  value={coverage}
                  onChange={(e) => setCoverage(e.target.value)}
                  placeholder="e.g., Full network, 55%"
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
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#1F2937' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed explanation of the solution..."
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

            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="recommended"
                checked={recommended}
                onChange={(e) => setRecommended(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="recommended" style={{ fontSize: '14px', color: '#1F2937', cursor: 'pointer' }}>
                Mark as Recommended Solution
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="f-btn primary">
                {editingId ? 'Update Solution' : 'Create Solution'}
              </button>
              <button
                type="button"
                className="f-btn ghost"
                onClick={() => { setShowForm(false); resetForm(); setEditingId(null); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="f-card">
          <div className="f-stat-label">Total Solutions</div>
          <div className="f-stat-value">{solutions.length}</div>
        </div>
        <div className="f-card">
          <div className="f-stat-label">Total Cost</div>
          <div className="f-stat-value" style={{ color: '#DC2626' }}>
            ${getTotalCost().toLocaleString()}
          </div>
        </div>
        <div className="f-card">
          <div className="f-stat-label">Recommended</div>
          <div className="f-stat-value" style={{ color: '#10B981' }}>
            {solutions.filter(s => s.recommended).length}
          </div>
        </div>
      </div>

      <div className="f-card">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wrench size={18} />
            Active Solutions
          </div>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {solutions.length === 0 ? (
            <p style={{ color: '#6B7280', margin: 0 }}>No solutions yet</p>
          ) : (
            solutions.map((solution) => {
              const concern = concerns.find(c => c.id === solution.concernId);
              return (
                <div
                  key={solution.id}
                  style={{
                    border: '2px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    background: solution.recommended ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1F2937' }}>
                          {solution.title}
                        </h4>
                        {solution.recommended && (
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}>
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      {concern && (
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6366F1', fontWeight: 500 }}>
                          For: {concern.title}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
                        {solution.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                      <button
                        onClick={() => editSolution(solution)}
                        className="f-btn ghost"
                        style={{ padding: '8px 12px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    borderTop: '1px solid rgba(99, 102, 241, 0.1)',
                    paddingTop: 12,
                    marginTop: 12,
                    fontSize: '12px',
                  }}>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: 4 }}>Cost</div>
                      <div style={{ fontWeight: 600, color: '#1F2937' }}>
                        ${solution.cost.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: 4 }}>Time to Resolve</div>
                      <div style={{ fontWeight: 600, color: '#1F2937' }}>
                        {solution.timeToResolve} days
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: 4 }}>Coverage</div>
                      <div style={{ fontWeight: 600, color: '#1F2937' }}>
                        {solution.coverage}
                      </div>
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

export default SolutionsPage;
