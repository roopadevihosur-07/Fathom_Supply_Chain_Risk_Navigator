import React, { useEffect, useState, useRef } from 'react';
import { Network, TrendingUp, BarChart3, Code2, History, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import cytoscape from 'cytoscape';
import cose from 'cytoscape-cose-bilkent';
import { useAuth } from './AuthContext';

cytoscape.use(cose);

const GraphAnalyticsPage = () => {
  const { session } = useAuth();
  const cyRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [nodeRisks, setNodeRisks] = useState({});
  const [cascadeHistory, setCascadeHistory] = useState([]);
  const [customQuery, setCustomQuery] = useState('MATCH (n) RETURN n LIMIT 20');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [showQueryEditor, setShowQueryEditor] = useState(false);

  // Initialize graph and calculate risk scores
  useEffect(() => {
    initializeGraph();
  }, []);

  const initializeGraph = async () => {
    try {
      const res = await fetch('https://api.butterbase.ai/v1/' + import.meta.env.VITE_BUTTERBASE_APP_ID + '/fn/neo4j-cascade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startNode: 'hsinchu',
          action: 'get_graph'
        })
      });

      const data = await res.json();

      // Define supply chain nodes with coordinates
      const nodes = [
        { id: 'hsinchu', label: 'Hsinchu Semiconductor', type: 'supplier', location: 'Taiwan', revenue: 0 },
        { id: 'kaohsiung', label: 'Kaohsiung Chip Packaging', type: 'supplier', location: 'Taiwan', revenue: 0 },
        { id: 'shenzhen', label: 'Shenzhen Assembly', type: 'supplier', location: 'China', revenue: 0 },
        { id: 'austin', label: 'Austin Device Plant', type: 'plant', location: 'USA', revenue: 500000 },
        { id: 'guadalajara', label: 'Guadalajara Assembly', type: 'plant', location: 'Mexico', revenue: 300000 },
        { id: 'memphis', label: 'Memphis Distribution', type: 'distribution', location: 'USA', revenue: 400000 },
        { id: 'rotterdam', label: 'Rotterdam Hub', type: 'distribution', location: 'Netherlands', revenue: 250000 },
        { id: 'na_retail', label: 'NA Retail Network', type: 'market', location: 'USA', revenue: 2800000 },
        { id: 'eu_retail', label: 'EU Retail Network', type: 'market', location: 'Europe', revenue: 1400000 },
      ];

      const edges = [
        { source: 'hsinchu', target: 'austin' },
        { source: 'kaohsiung', target: 'austin' },
        { source: 'shenzhen', target: 'guadalajara' },
        { source: 'austin', target: 'memphis' },
        { source: 'guadalajara', target: 'memphis' },
        { source: 'memphis', target: 'na_retail' },
        { source: 'memphis', target: 'rotterdam' },
        { source: 'rotterdam', target: 'eu_retail' },
      ];

      setGraphData({ nodes, edges });
      calculateRiskScores(nodes, edges);
      loadCascadeHistory();
    } catch (error) {
      console.error('Error initializing graph:', error);
    }
  };

  const calculateRiskScores = (nodes, edges) => {
    const risks = {};

    nodes.forEach(node => {
      // Calculate risk based on:
      // 1. Number of downstream nodes (criticality)
      // 2. Revenue exposure
      // 3. Node type (suppliers are higher risk)

      const downstreamCount = countDownstream(node.id, edges);
      const revenueExposure = calculateRevenueExposure(node.id, edges, nodes);
      const typeWeight = { supplier: 1.3, plant: 1.1, distribution: 0.9, market: 0.7 }[node.type] || 1;

      const riskScore = Math.min(100, (downstreamCount * 10 + (revenueExposure / 100000) + 20) * typeWeight);

      risks[node.id] = {
        score: Math.round(riskScore),
        downstream: downstreamCount,
        revenue: revenueExposure,
        level: riskScore > 75 ? 'Critical' : riskScore > 50 ? 'High' : riskScore > 25 ? 'Medium' : 'Low'
      };
    });

    setNodeRisks(risks);
  };

  const countDownstream = (nodeId, edges) => {
    let count = 0;
    let visited = new Set([nodeId]);
    let queue = [nodeId];

    while (queue.length > 0) {
      const current = queue.shift();
      const next = edges.filter(e => e.source === current).map(e => e.target);

      next.forEach(n => {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
          count++;
        }
      });
    }

    return count;
  };

  const calculateRevenueExposure = (nodeId, edges, nodes) => {
    let exposure = 0;
    let visited = new Set([nodeId]);
    let queue = [nodeId];

    while (queue.length > 0) {
      const current = queue.shift();
      const next = edges.filter(e => e.source === current).map(e => e.target);

      next.forEach(nId => {
        if (!visited.has(nId)) {
          visited.add(nId);
          queue.push(nId);
          const node = nodes.find(n => n.id === nId);
          if (node) exposure += node.revenue;
        }
      });
    }

    return exposure;
  };

  const loadCascadeHistory = () => {
    const history = JSON.parse(localStorage.getItem('cascadeHistory') || '[]');
    setCascadeHistory(history.slice(-10));
  };

  const saveCascadeEvent = (startNode, affectedNodes, revenueAtRisk) => {
    const history = JSON.parse(localStorage.getItem('cascadeHistory') || '[]');
    history.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      startNode,
      affectedCount: affectedNodes.length,
      revenueAtRisk,
      severity: revenueAtRisk > 3000000 ? 'Critical' : revenueAtRisk > 1500000 ? 'High' : 'Medium'
    });
    localStorage.setItem('cascadeHistory', JSON.stringify(history));
    setCascadeHistory(history.slice(-10));
  };

  const renderGraph = () => {
    if (!graphData || !cyRef.current) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: [
        ...graphData.nodes.map(node => ({
          data: { id: node.id, label: node.label, type: node.type },
          style: getNodeStyle(node.id)
        })),
        ...graphData.edges.map(edge => ({
          data: { source: edge.source, target: edge.target }
        }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'font-weight': 'bold',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#333',
            'border-width': 2,
            'border-color': 'rgba(255,255,255,0.5)',
            'cursor': 'pointer'
          }
        },
        {
          selector: 'edge',
          style: {
            'line-color': 'rgba(99, 102, 241, 0.3)',
            'target-arrow-color': 'rgba(99, 102, 241, 0.3)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'width': 2
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#FFD700',
          }
        }
      ],
      layout: {
        name: 'cose',
        directed: true,
        nodeDimensionsIncludeLabels: true,
        animate: true,
        animationDuration: 500,
        animationEasing: 'ease-in-out-cubic'
      }
    });

    cy.on('tap', 'node', (e) => {
      setSelectedNode(e.target.id());
    });

    cy.fit();
  };

  const getNodeStyle = (nodeId) => {
    const risk = nodeRisks[nodeId];
    if (!risk) return { 'background-color': '#6366F1' };

    const colors = {
      Critical: '#DC2626',
      High: '#EA580C',
      Medium: '#EAB308',
      Low: '#10B981'
    };

    return {
      'background-color': colors[risk.level] || '#6366F1',
      'width': 50 + (risk.score / 2),
      'height': 50 + (risk.score / 2),
    };
  };

  useEffect(() => {
    renderGraph();
  }, [graphData, nodeRisks]);

  const executeQuery = async () => {
    try {
      setQueryError('');
      const res = await fetch('https://api.butterbase.ai/v1/' + import.meta.env.VITE_BUTTERBASE_APP_ID + '/fn/neo4j-query', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: customQuery })
      });

      const data = await res.json();
      setQueryResult(data);
    } catch (error) {
      setQueryError(error.message);
    }
  };

  const simulateDisruption = async (nodeId) => {
    try {
      const res = await fetch('https://api.butterbase.ai/v1/' + import.meta.env.VITE_BUTTERBASE_APP_ID + '/fn/neo4j-cascade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startNode: nodeId })
      });

      const data = await res.json();
      if (data.cascade) {
        saveCascadeEvent(nodeId, data.cascade, data.revenueAtRisk || 0);
      }
    } catch (error) {
      console.error('Cascade simulation failed:', error);
    }
  };

  return (
    <div>
      <div className="f-page-header">
        <div>
          <div className="f-eyebrow">Advanced Analytics</div>
          <h1 className="f-title">Neo4j Graph Analytics</h1>
          <p className="f-subtitle">
            Interactive supply chain network visualization with risk scoring, cascade history, and custom queries.
          </p>
        </div>
      </div>

      {/* Risk Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {Object.entries(nodeRisks).slice(0, 4).map(([nodeId, risk]) => (
          <div key={nodeId} className="f-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div className="f-stat-label">{graphData?.nodes.find(n => n.id === nodeId)?.label}</div>
                <div className="f-stat-value" style={{ color: getRiskColor(risk.level) }}>
                  {risk.score}
                </div>
              </div>
              <div style={{
                background: getRiskBgColor(risk.level),
                color: getRiskColor(risk.level),
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
              }}>
                {risk.level}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {risk.downstream} downstream nodes
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Graph Visualization */}
        <div className="f-card">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Network size={18} />
            Supply Chain Network
          </h3>
          <div
            ref={cyRef}
            style={{
              width: '100%',
              height: '500px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.02)',
            }}
          />
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: 12 }}>
            💡 Click nodes to select. Node size = risk score. Colors: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low
          </div>
        </div>

        {/* Node Risk Details */}
        <div className="f-card">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} />
            Risk Scores
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(nodeRisks).map(([nodeId, risk]) => {
              const node = graphData?.nodes.find(n => n.id === nodeId);
              return (
                <div
                  key={nodeId}
                  onClick={() => simulateDisruption(nodeId)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${getRiskColor(risk.level)}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937' }}>
                      {node?.label}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: getRiskColor(risk.level) }}>
                      {risk.score}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: 4 }}>
                    Downstream: {risk.downstream} | Revenue: ${(risk.revenue / 1000000).toFixed(1)}M
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    Click to simulate disruption
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cascade History */}
      <div className="f-card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={18} />
          Cascade History
        </h3>
        {cascadeHistory.length === 0 ? (
          <p style={{ color: '#6B7280', margin: 0 }}>No cascade events yet. Click a node above to simulate.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {cascadeHistory.map((event) => (
              <div
                key={event.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: `2px solid ${event.severity === 'Critical' ? '#DC2626' : '#EA580C'}`,
                  borderRadius: '10px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {event.severity === 'Critical' ? (
                    <AlertTriangle size={16} color="#DC2626" />
                  ) : (
                    <AlertCircle size={16} color="#EA580C" />
                  )}
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937' }}>
                    {event.startNode.toUpperCase()} Disruption
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: 6 }}>
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626', marginBottom: 4 }}>
                  ${(event.revenueAtRisk / 1000000).toFixed(1)}M at risk
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  {event.affectedCount} nodes affected
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Query Editor */}
      <div className="f-card">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Code2 size={18} />
          Custom Cypher Queries
        </h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: 8,
            color: '#1F2937',
          }}>
            Cypher Query
          </label>
          <textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'monospace',
              boxSizing: 'border-box',
              background: 'rgba(99, 102, 241, 0.02)',
              color: '#1F2937',
            }}
            placeholder="MATCH (n) RETURN n LIMIT 20"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button
            onClick={executeQuery}
            className="f-btn primary"
            style={{ flex: 1 }}
          >
            Execute Query
          </button>
          <button
            onClick={() => setShowQueryEditor(!showQueryEditor)}
            className="f-btn ghost"
          >
            {showQueryEditor ? 'Hide' : 'Examples'}
          </button>
        </div>

        {showQueryEditor && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: 16,
            fontSize: '12px',
            color: '#6B7280',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Example Queries:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => setCustomQuery('MATCH (n) RETURN n LIMIT 20')}
                style={{ textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6366F1' }}
              >
                • Get all nodes
              </button>
              <button
                onClick={() => setCustomQuery('MATCH (a)-[r:SUPPLIES]->(b) RETURN a.id, b.id')}
                style={{ textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6366F1' }}
              >
                • Get all relationships
              </button>
              <button
                onClick={() => setCustomQuery('MATCH (n)-[r:SUPPLIES*1..3]->(m) RETURN n.id, m.id')}
                style={{ textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6366F1' }}
              >
                • Get cascades up to 3 levels
              </button>
            </div>
          </div>
        )}

        {queryError && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: 16,
            color: '#DC2626',
            fontSize: '12px',
          }}>
            Error: {queryError}
          </div>
        )}

        {queryResult && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            padding: '12px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: 8, color: '#10B981' }}>
              ✓ Query successful
            </div>
            <pre style={{
              fontSize: '12px',
              color: '#1F2937',
              margin: 0,
              maxHeight: '200px',
              overflow: 'auto',
              background: 'rgba(255, 255, 255, 0.5)',
              padding: '8px',
              borderRadius: '6px',
            }}>
              {JSON.stringify(queryResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const getRiskColor = (level) => {
  const colors = { Critical: '#DC2626', High: '#EA580C', Medium: '#EAB308', Low: '#10B981' };
  return colors[level] || '#6366F1';
};

const getRiskBgColor = (level) => {
  const colors = { Critical: 'rgba(220, 38, 38, 0.1)', High: 'rgba(234, 88, 12, 0.1)', Medium: 'rgba(234, 179, 8, 0.1)', Low: 'rgba(16, 185, 129, 0.1)' };
  return colors[level] || 'rgba(99, 102, 241, 0.1)';
};

export default GraphAnalyticsPage;
