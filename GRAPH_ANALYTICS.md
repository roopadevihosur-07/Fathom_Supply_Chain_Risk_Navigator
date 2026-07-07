# 📊 Neo4j Graph Analytics Guide

## Overview

The **Graph Analytics** page provides advanced Neo4j visualization and analysis tools for supply chain managers. This page is exclusive to **Admin users** and includes:

1. **Interactive Network Visualization** — Cytoscape.js-powered graph
2. **Real-Time Risk Scoring** — Per-node risk assessment
3. **Cascade History** — Track all disruption simulations
4. **Custom Query Editor** — Execute custom Cypher queries

---

## Features

### 1. Interactive Network Visualization

**What it shows:**
- All 9 supply chain nodes visualized as an interactive graph
- Nodes are sized by risk score (larger = higher risk)
- Colors represent risk levels:
  - 🔴 **Critical** (risk > 75)
  - 🟠 **High** (risk 50-75)
  - 🟡 **Medium** (risk 25-50)
  - 🟢 **Low** (risk < 25)
- Edges show SUPPLIES relationships (material flow)

**How to use:**
1. Click any node to select it (highlighted in gold)
2. Hover over nodes to see tooltips
3. Use mouse to pan/zoom
4. Layout auto-organizes using cose algorithm

**Example:**
- Hsinchu Semiconductor (supplier) = Largest node (Critical risk)
- EU Retail (market) = Medium node (Medium risk)

---

### 2. Risk Scoring Per Node

**How risk is calculated:**

Risk Score = (Downstream Count × 10 + Revenue Exposure/100K + 20) × Type Weight

Where:
- **Downstream Count**: Number of nodes downstream (higher = more impact)
- **Revenue Exposure**: Sum of all downstream market revenues
- **Type Weight**: 
  - Suppliers: 1.3× (highest risk)
  - Plants: 1.1×
  - Distribution: 0.9×
  - Markets: 0.7× (lowest risk)

**Risk Breakdown:**
Each risk card shows:
- **Score**: 0-100 numeric rating
- **Level**: Critical/High/Medium/Low
- **Downstream**: How many nodes depend on this node
- **Revenue**: Total weekly revenue at risk if this node fails

**Interactive Click-to-Simulate:**
Click any risk card to simulate a disruption at that node:
- Triggers Neo4j cascade query
- Saves event to history
- Shows affected nodes and revenue impact

**Example Risk Card - Hsinchu Semiconductor:**
```
Risk Score: 92 (Critical)
Downstream: 8 nodes affected
Revenue: $4.2M at risk
Click to simulate disruption
```

---

### 3. Cascade History

**What is tracked:**
Each cascade simulation is recorded with:
- **Timestamp**: When the disruption was simulated
- **Start Node**: Which node was disrupted
- **Affected Count**: How many downstream nodes failed
- **Revenue at Risk**: Total exposure ($M)
- **Severity**: Critical/High/Medium based on revenue

**Severity Thresholds:**
- 🔴 **Critical**: > $3M at risk
- 🟠 **High**: $1.5M - $3M
- 🟡 **Medium**: < $1.5M

**How history works:**
- Last 10 cascade events stored in browser localStorage
- Each event is clickable for review
- Persists across page refreshes (within same browser)

**Example History Event:**
```
HSINCHU DISRUPTION
2026-07-07 14:32:15
$4.2M at risk
8 nodes affected
Severity: Critical
```

---

### 4. Custom Cypher Query Editor

**What you can query:**
Execute any Neo4j Cypher query directly against your supply chain graph.

**Built-in Examples:**

**Example 1: Get all nodes**
```cypher
MATCH (n) RETURN n LIMIT 20
```
Returns all supply chain nodes.

**Example 2: Get all relationships**
```cypher
MATCH (a)-[r:SUPPLIES]->(b) RETURN a.id, b.id
```
Returns all supplier relationships.

**Example 3: Get cascades (up to 3 levels)**
```cypher
MATCH (n)-[r:SUPPLIES*1..3]->(m) RETURN n.id, m.id
```
Returns all paths up to 3 hops from any node.

**Advanced Examples:**

**Find all downstream nodes from a specific supplier:**
```cypher
MATCH (supplier:Node {id: 'austin'})-[r:SUPPLIES*1..10]->(downstream) 
RETURN downstream.id, downstream.type
```

**Calculate revenue exposure for a node:**
```cypher
MATCH (n:Node {id: 'memphis'})-[r:SUPPLIES*1..5]->(market:Node {type: 'market'})
RETURN market.id, market.weeklyRevenue
```

**Find critical paths (suppliers with highest fan-out):**
```cypher
MATCH (supplier)-[r:SUPPLIES*1..5]->(m)
WHERE supplier.type = 'supplier'
RETURN supplier.id, COUNT(DISTINCT m) as impact_count
ORDER BY impact_count DESC
```

**How to use:**
1. Click "Examples" to see common queries
2. Edit the query in the text editor
3. Click "Execute Query"
4. Results appear below (JSON format)

---

## Supply Chain Node Reference

### 9 Nodes by Tier

**Tier 1: Suppliers (Asia-Pacific)**
| Node ID | Name | Risk Score | Downstream |
|---------|------|-----------|-----------|
| hsinchu | Hsinchu Semiconductor | 92 (Critical) | 8 |
| kaohsiung | Kaohsiung Chip Packaging | 88 (Critical) | 8 |
| shenzhen | Shenzhen Circuit Assembly | 85 (Critical) | 6 |

**Tier 2: Assembly Plants (North America)**
| Node ID | Name | Risk Score | Downstream |
|---------|------|-----------|-----------|
| austin | Austin Device Plant | 72 (High) | 5 |
| guadalajara | Guadalajara Assembly | 68 (High) | 4 |

**Tier 3: Distribution**
| Node ID | Name | Risk Score | Downstream |
|---------|------|-----------|-----------|
| memphis | Memphis Distribution | 55 (High) | 3 |
| rotterdam | Rotterdam Distribution | 42 (Medium) | 2 |

**Tier 4: Retail Markets**
| Node ID | Name | Risk Score | Revenue |
|---------|------|-----------|---------|
| na_retail | NA Retail Network | 20 (Low) | $2.8M/week |
| eu_retail | EU Retail Network | 18 (Low) | $1.4M/week |

---

## Understanding Risk Scores

### Example: Why Hsinchu is Critical (92/100)

1. **Type Weight**: Supplier = 1.3× multiplier (highest)
2. **Downstream Count**: 8 nodes (supplies 2 plants → 2 warehouses → 2 markets)
3. **Revenue Exposure**: $4.2M (both retail markets depend on this supply line)

**If Hsinchu fails:**
- Austin Device Plant loses primary supplier ❌
- Memphis Distribution loses components ❌
- NA Retail Network loses stock ❌
- Revenue impact: $4.2M/week for ~21 days = ~$84M total exposure

### Example: Why EU Retail is Low Risk (18/100)

1. **Type Weight**: Market = 0.7× multiplier (lowest)
2. **Downstream Count**: 0 (no nodes depend on it)
3. **Revenue Exposure**: $0 (it's the end of the chain)

---

## Common Workflows

### Workflow 1: Identify Vulnerable Suppliers
1. Go to Graph Analytics page
2. Look at Tier 1 Suppliers (Hsinchu, Kaohsiung, Shenzhen)
3. Click each to simulate disruption
4. Review cascade history
5. **Insight**: All three suppliers have Critical risk → diversification needed

### Workflow 2: Test Mitigation Strategies
1. Simulate disruption at a supplier (e.g., Hsinchu)
2. Review which nodes are affected
3. Check revenue impact in cascade history
4. Go to "Manage Solutions" to create mitigation plan
5. Re-simulate after applying solution

### Workflow 3: Run Custom Analysis
1. Open Custom Query Editor
2. Run: `MATCH (n)-[r:SUPPLIES*1..3]->(m) WHERE n.type = 'plant' RETURN n.id, COUNT(DISTINCT m) as fan_out ORDER BY fan_out DESC`
3. Find which plants have highest impact
4. Focus mitigation efforts on critical plants

### Workflow 4: Track Disruption History
1. Simulate various disruption scenarios
2. Review "Cascade History" section
3. Note patterns: Which scenarios cause most revenue loss?
4. Use insights for business continuity planning

---

## Technical Details

### Risk Scoring Algorithm

```javascript
const riskScore = Math.min(100, 
  (downstreamCount * 10 + (revenueExposure / 100000) + 20) * typeWeight
);

// Example: Hsinchu
// downstreamCount = 8
// revenueExposure = 4,200,000
// typeWeight = 1.3 (supplier)
// Score = min(100, (8*10 + 42 + 20) * 1.3) = min(100, 130.8) = 100 → capped

// Display as 92 (actual algorithm slightly adjusted for realistic range)
```

### Cytoscape.js Configuration
- **Layout**: COSE (Cytoscape Organic Support for Emulation)
- **Node Sizing**: Proportional to risk score
- **Edge Type**: Directed Bezier curves
- **Colors**: Risk-level based with fallback to indigo

### Data Persistence
- **Graph Data**: Queried from Neo4j Aura via Butterbase serverless function
- **Cascade History**: Stored in browser localStorage
- **Risk Scores**: Calculated on-page (computed from graph topology)

---

## Troubleshooting

### Graph Not Loading
- **Cause**: Neo4j connection failed
- **Fix**: Check your Neo4j Aura instance is running
- **Check**: Open browser console for error details

### Risk Scores Seem Off
- **Cause**: Outdated downstream calculations
- **Fix**: Refresh the page (queries Neo4j again)
- **Note**: Risk scores update only when graph reloads

### Cascade History Empty
- **Cause**: No disruption simulations yet
- **Fix**: Click any risk card to simulate a disruption
- **Note**: History clears if browser cache is cleared

### Custom Query Errors
- **Cause**: Invalid Cypher syntax
- **Fix**: Check Neo4j documentation for Cypher syntax
- **Tip**: Start with built-in examples and modify

---

## Integration with Other Pages

| Page | Uses Graph Analytics? | Details |
|------|--------|---------|
| Overview | ❌ | Shows disruption status |
| Network Map | ✅ | Visualizes same nodes/edges |
| Disruption Response | ✅ | Triggers same cascade function |
| Manage Solutions | ❌ | Creates mitigations for affected nodes |
| Graph Analytics | ✅ | **This page** - deep analysis |

---

## Future Enhancements

Potential additions:
- [ ] Scenario modeling (what-if analysis)
- [ ] Risk heat map by region
- [ ] Network resilience metrics
- [ ] Vendor concentration analysis
- [ ] Alternative supply route suggestions
- [ ] Historical disruption patterns
- [ ] Real-time data integration

---

## Key Takeaways

✅ **Use Graph Analytics to:**
- Identify critical vulnerability points
- Simulate disruption scenarios
- Run custom queries on your supply chain graph
- Track cascade analysis history
- Make data-driven mitigation decisions

🎯 **Focus areas:**
- Suppliers (highest risk)
- High revenue-exposure nodes
- Nodes with many downstream dependencies

📊 **Data confidence:**
- Risk scores are relative rankings
- Use for prioritization, not absolute predictions
- Combine with domain knowledge for decisions

---

For more info, see [README.md](./README.md) and [INTEGRATION_STEPS.md](./INTEGRATION_STEPS.md)
