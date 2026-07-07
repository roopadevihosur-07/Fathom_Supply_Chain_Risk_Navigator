import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Globe, AlertTriangle, CheckCircle2, TrendingUp, Package, Factory, Cpu,
  Warehouse, ShoppingCart, Activity, Zap, DollarSign, ChevronRight, Network,
  Shield, Clock, ArrowRight, CreditCard, FileText, Radio, MapPin, X, Play,
  BarChart3, ChevronDown, LogOut, Bell, AlertCircle, Wrench, Lightbulb
} from "lucide-react";
import { useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import ConcernsPage from "./ConcernsPage";
import SuggestionsPage from "./SuggestionsPage";
import SolutionsPage from "./SolutionsPage";

/* ---------------------------------------------------------------------- */
/* DATA MODEL                                                              */
/* ---------------------------------------------------------------------- */

const NODES = [
  { id: "hsinchu",     label: "Hsinchu Semiconductor Co.",   type: "supplier",  region: "ASIA-PACIFIC", x: 130, y: 150, tier: "Tier 2 Supplier" },
  { id: "kaohsiung",   label: "Kaohsiung Chip Packaging",     type: "component", region: "ASIA-PACIFIC", x: 150, y: 270, tier: "Tier 1 Supplier" },
  { id: "shenzhen",    label: "Shenzhen Circuit Assembly",    type: "component", region: "ASIA-PACIFIC", x: 320, y: 190, tier: "Tier 1 Supplier" },
  { id: "austin",      label: "Austin Device Plant",          type: "plant",     region: "NORTH AMERICA", x: 610, y: 140, tier: "Assembly" },
  { id: "guadalajara", label: "Guadalajara Assembly",         type: "plant",     region: "NORTH AMERICA", x: 500, y: 320, tier: "Assembly" },
  { id: "memphis",     label: "Memphis Distribution Center",  type: "warehouse", region: "NORTH AMERICA", x: 680, y: 260, tier: "Warehouse" },
  { id: "rotterdam",   label: "Rotterdam Distribution Hub",   type: "warehouse", region: "EUROPE",        x: 860, y: 150, tier: "Warehouse" },
  { id: "na_retail",   label: "North America Retail Network", type: "market",    region: "NORTH AMERICA", x: 680, y: 380, tier: "Market", weeklyRevenue: 2800000 },
  { id: "eu_retail",   label: "EU Retail Network",            type: "market",    region: "EUROPE",        x: 860, y: 270, tier: "Market", weeklyRevenue: 1400000 },
];

const EDGES = [
  ["hsinchu", "kaohsiung"],
  ["hsinchu", "shenzhen"],
  ["kaohsiung", "austin"],
  ["shenzhen", "austin"],
  ["shenzhen", "guadalajara"],
  ["austin", "memphis"],
  ["guadalajara", "rotterdam"],
  ["memphis", "na_retail"],
  ["rotterdam", "eu_retail"],
];

const ROOT = "hsinchu";

function computeCascade(rootId) {
  const adj = {};
  EDGES.forEach(([a, b]) => { (adj[a] = adj[a] || []).push(b); });
  const visited = new Map();
  let frontier = [rootId];
  let hop = 0;
  visited.set(rootId, 0);
  while (frontier.length) {
    const next = [];
    hop += 1;
    frontier.forEach((id) => {
      (adj[id] || []).forEach((n) => {
        if (!visited.has(n)) { visited.set(n, hop); next.push(n); }
      });
    });
    frontier = next;
  }
  return visited; // Map id -> hop distance (0 = root)
}

const CASCADE = computeCascade(ROOT);
const AFFECTED_IDS = [...CASCADE.keys()].filter((id) => id !== ROOT);
const AFFECTED_MARKETS = NODES.filter((n) => n.type === "market" && CASCADE.has(n.id));
const REVENUE_AT_RISK = AFFECTED_MARKETS.reduce((s, n) => s + (n.weeklyRevenue || 0) * 1.5, 0);

const MITIGATIONS = [
  {
    id: "reroute",
    title: "Emergency reroute via secondary logistics partner",
    detail: "Redirect component sourcing through pre-qualified backup supplier and expedite freight on all affected lanes.",
    cost: 46000,
    days: 5,
    coverage: "Full network",
    recommended: true,
  },
  {
    id: "airfreight",
    title: "Air-freight substitute components (Kaohsiung line only)",
    detail: "Partial mitigation — restores the Austin plant's Kaohsiung-sourced line, Shenzhen-dependent lines remain exposed.",
    cost: 18400,
    days: 3,
    coverage: "Partial (~55%)",
    recommended: false,
  },
  {
    id: "absorb",
    title: "Absorb the delay — no action",
    detail: "Wait for Hsinchu Semiconductor Co. to resume production. No mitigation spend, full revenue exposure.",
    cost: 0,
    days: 21,
    coverage: "None",
    recommended: false,
  },
];

const REASONING_STEPS = [
  { label: "Ingesting disruption signal", detail: "Magnitude 6.1 seismic event reported 12km from Hsinchu Semiconductor Co. fabrication facility." },
  { label: "Querying Neo4j dependency graph", detail: "MATCH (s:Node {id:'hsinchu'})-[:SUPPLIES*1..5]->(d) RETURN d, length(path)" },
  { label: "Cascade mapped", detail: `${AFFECTED_IDS.length} downstream nodes affected across 3 regions.` },
  { label: "Cross-referencing active orders & revenue exposure", detail: "Joining shipment ledger against affected market nodes." },
  { label: "Revenue at risk calculated", detail: `$${(REVENUE_AT_RISK / 1e6).toFixed(1)}M over an estimated 21-day recovery window.` },
  { label: "Ranking mitigation options", detail: "Scoring candidate responses by cost-to-delay ratio and network coverage." },
];

const HISTORY = [
  { id: "INC-2288", title: "Port congestion — Long Beach, CA", date: "Jun 22, 2026", saved: 210000, status: "Resolved" },
  { id: "INC-2276", title: "Labor strike — Rotterdam Hub", date: "Jun 09, 2026", saved: 88000, status: "Resolved" },
  { id: "INC-2261", title: "Customs delay — Shenzhen exports", date: "May 27, 2026", saved: 41500, status: "Resolved" },
];

/* ---------------------------------------------------------------------- */
/* DESIGN TOKENS (via CSS variables)                                       */
/* ---------------------------------------------------------------------- */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

    .fathom {
      --bg: #F5F7FF;
      --surface: rgba(255, 255, 255, 0.8);
      --surface-2: rgba(255, 255, 255, 0.6);
      --border: rgba(99, 102, 241, 0.15);
      --text: #1F2937;
      --muted: #6B7280;
      --teal: #0D9488;
      --coral: #DC2626;
      --amber: #D97706;
      --indigo: #6366F1;
      --green: #10B981;
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, var(--bg) 0%, #EFEAFF 100%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
    }
    .fathom * { box-sizing: border-box; }
    .fathom h1, .fathom h2, .fathom h3, .fathom .display {
      font-family: 'Manrope', sans-serif;
    }
    .fathom .mono { font-family: 'IBM Plex Mono', monospace; }

    .f-sidebar {
      width: 240px;
      flex-shrink: 0;
      border-right: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .f-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 8px 24px 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
    .f-brand-mark {
      width: 30px; height: 30px; border-radius: 8px;
      background: linear-gradient(135deg, var(--teal), var(--indigo));
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .f-brand-name { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; }
    .f-brand-sub { font-size: 10.5px; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; }

    .f-navitem {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 8px;
      color: var(--muted); font-size: 13.5px; font-weight: 500;
      cursor: pointer; border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .f-navitem:hover { background: var(--surface-2); color: var(--text); }
    .f-navitem.active {
      background: rgba(124,142,255,0.08);
      border-color: rgba(124,142,255,0.25);
      color: var(--text);
    }
    .f-navitem.active svg { color: var(--indigo); }

    .f-status-block {
      margin-top: auto;
      padding: 12px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.15);
      font-size: 12px;
    }

    .f-main { flex: 1; min-width: 0; padding: 32px 40px; max-width: 1180px; }
    .f-page-header { margin-bottom: 28px; }
    .f-eyebrow {
      font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--indigo); font-weight: 600; margin-bottom: 8px;
    }
    .f-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px 0; }
    .f-subtitle { color: var(--muted); font-size: 14.5px; max-width: 640px; line-height: 1.6; }

    .f-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
    }

    .f-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 999px;
      font-size: 12px; font-weight: 600;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .f-pill.calm { background: rgba(13,148,136,0.15); color: var(--teal); }
    .f-pill.active { background: rgba(220,38,38,0.15); color: var(--coral); }
    .f-pill.mitigating { background: rgba(217,119,6,0.15); color: var(--amber); }
    .f-pill.resolved { background: rgba(16,185,129,0.15); color: var(--green); }

    .f-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 12px;
      font-size: 13.5px; font-weight: 600; cursor: pointer;
      border: none; transition: all 0.15s ease;
      font-family: 'Inter', sans-serif;
    }
    .f-btn.primary { background: var(--indigo); color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
    .f-btn.primary:hover { filter: brightness(1.1); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4); }
    .f-btn.danger { background: var(--coral); color: white; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
    .f-btn.danger:hover { filter: brightness(1.1); box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4); }
    .f-btn.ghost { background: rgba(255, 255, 255, 0.6); color: var(--text); border: 1px solid rgba(99, 102, 241, 0.2); backdrop-filter: blur(8px); }
    .f-btn.ghost:hover { background: rgba(255, 255, 255, 0.8); border-color: rgba(99, 102, 241, 0.4); }
    .f-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .f-grid-2 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
    .f-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

    .f-stat-label { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .f-stat-value { font-size: 24px; font-weight: 800; font-family: 'Manrope', sans-serif; }

    .f-step {
      display: flex; gap: 12px; padding: 12px 0;
      border-bottom: 1px solid var(--border);
      opacity: 0; transform: translateY(4px);
      animation: fstepin 0.4s ease forwards;
    }
    .f-step:last-child { border-bottom: none; }
    @keyframes fstepin { to { opacity: 1; transform: translateY(0); } }

    .f-code-block {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 12px;
      color: var(--teal);
      line-height: 1.7;
      overflow-x: auto;
      white-space: pre;
    }

    table.f-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    table.f-table th {
      text-align: left; color: var(--muted); font-weight: 600;
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
      padding: 10px 10px; border-bottom: 2px solid rgba(99, 102, 241, 0.1);
    }
    table.f-table td { padding: 12px 10px; border-bottom: 1px solid rgba(99, 102, 241, 0.08); }
    table.f-table tr:last-child td { border-bottom: none; }

    .f-mit-card {
      border: 2px solid rgba(99, 102, 241, 0.2);
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(12px);
    }
    .f-mit-card:hover { border-color: var(--indigo); background: rgba(255, 255, 255, 0.8); }
    .f-mit-card.selected { border-color: var(--indigo); background: rgba(99, 102, 241, 0.12); }
    .f-mit-card.recommended::after {
      content: 'RECOMMENDED'; font-size: 9.5px; font-weight: 700;
      color: var(--indigo); letter-spacing: 0.06em;
    }

    .f-region-label {
      font-size: 9.5px; letter-spacing: 0.08em; fill: #4A5478; font-weight: 600;
    }
  `}</style>
);

/* ---------------------------------------------------------------------- */
/* SHARED PIECES                                                           */
/* ---------------------------------------------------------------------- */

const NODE_ICON = { supplier: Factory, component: Cpu, plant: Package, warehouse: Warehouse, market: ShoppingCart };

function StatusPill({ phase }) {
  const map = {
    calm: { icon: CheckCircle2, text: "Network Stable" },
    active: { icon: AlertTriangle, text: "Disruption Active" },
    mitigating: { icon: Clock, text: "Mitigation In Progress" },
    resolved: { icon: CheckCircle2, text: "Resolved" },
  };
  const { icon: Icon, text } = map[phase];
  return <span className={`f-pill ${phase}`}><Icon size={13} /> {text}</span>;
}

function NetworkMap({ phase, compact }) {
  const nodeState = (id) => {
    if (phase === "calm") return "calm";
    if (phase === "resolved") return "resolved";
    return CASCADE.has(id) ? "affected" : "calm";
  };
  const colorFor = (state) =>
    state === "affected" ? "var(--coral)" : state === "resolved" ? "var(--green)" : "var(--teal)";

  const height = compact ? 260 : 480;

  return (
    <svg viewBox="0 0 1000 480" width="100%" height={height} style={{ display: "block" }}>
      <defs>
        <pattern id="gridDots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="rgba(99, 102, 241, 0.08)" />
        </pattern>
        <filter id="textShadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="1000" height="480" fill="#F5F7FF" />
      <rect x="0" y="0" width="1000" height="480" fill="url(#gridDots)" />

      {/* Region Labels */}
      {!compact && (
        <>
          <rect x="20" y="15" width="140" height="28" fill="rgba(99, 102, 241, 0.08)" rx="8" />
          <text x="90" y="35" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6366F1" fontFamily="Manrope">
            ASIA-PACIFIC
          </text>

          <rect x="505" y="15" width="140" height="28" fill="rgba(99, 102, 241, 0.08)" rx="8" />
          <text x="575" y="35" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6366F1" fontFamily="Manrope">
            NORTH AMERICA
          </text>

          <rect x="835" y="15" width="140" height="28" fill="rgba(99, 102, 241, 0.08)" rx="8" />
          <text x="905" y="35" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6366F1" fontFamily="Manrope">
            EUROPE
          </text>
        </>
      )}

      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const na = NODES.find((n) => n.id === a);
        const nb = NODES.find((n) => n.id === b);
        const affected = phase !== "calm" && phase !== "resolved" && CASCADE.has(a) && CASCADE.has(b);
        const stroke = phase === "resolved" ? "#10B981" : affected ? "#DC2626" : "rgba(99, 102, 241, 0.15)";
        return (
          <g key={i}>
            {affected && (
              <line
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={stroke}
                strokeWidth={3}
                opacity="0.2"
              />
            )}
            <line
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={stroke}
              strokeWidth={affected ? 2.5 : 1.5}
              strokeDasharray={affected ? "6 5" : "none"}
              opacity={affected ? 1 : 0.6}
            >
              {affected && (
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="0.7s" repeatCount="indefinite" />
              )}
            </line>
          </g>
        );
      })}

      {/* Nodes */}
      {NODES.map((n) => {
        const state = nodeState(n.id);
        const Icon = NODE_ICON[n.type];
        const isRoot = n.id === ROOT && phase !== "calm";
        const nodeColor = state === "affected" ? "#DC2626" : state === "resolved" ? "#10B981" : "#0D9488";

        return (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            {/* Pulse effect for affected nodes */}
            {state === "affected" && (
              <circle r="20" fill={nodeColor} opacity="0.1">
                <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Node circle */}
            <circle
              r="14"
              fill="white"
              stroke={nodeColor}
              strokeWidth={isRoot ? 3.5 : 2.5}
              filter="url(#glow)"
              opacity="0.95"
            />

            {/* Icon */}
            <g filter="url(#glow)">
              <Icon size={14} x={-7} y={-7} color={nodeColor} strokeWidth={1.5} />
            </g>

            {/* Label */}
            {!compact && (
              <g filter="url(#textShadow)">
                <text
                  x="0"
                  y="32"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1F2937"
                  fontFamily="'Manrope', sans-serif"
                  letterSpacing="-0.01em"
                >
                  {n.label.length > 20 ? n.label.slice(0, 18) + "…" : n.label}
                </text>

                {/* Node type label */}
                <text
                  x="0"
                  y="45"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6B7280"
                  fontFamily="'Inter', sans-serif"
                  opacity="0.8"
                >
                  {n.tier}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Legend */}
      {!compact && (
        <>
          <g transform="translate(20, 430)">
            <circle cx="0" cy="0" r="4" fill="#0D9488" />
            <text x="12" y="4" fontSize="11" fill="#1F2937" fontFamily="Inter">Healthy</text>
          </g>
          <g transform="translate(130, 430)">
            <circle cx="0" cy="0" r="4" fill="#DC2626" />
            <text x="12" y="4" fontSize="11" fill="#1F2937" fontFamily="Inter">Affected</text>
          </g>
          <g transform="translate(240, 430)">
            <circle cx="0" cy="0" r="4" fill="#10B981" />
            <text x="12" y="4" fontSize="11" fill="#1F2937" fontFamily="Inter">Resolved</text>
          </g>
        </>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* PAGES                                                                   */
/* ---------------------------------------------------------------------- */

function OverviewPage({ phase, go }) {
  const centrality = [
    { name: "Hsinchu Semiconductor Co.", pct: 100 },
    { name: "Shenzhen Circuit Assembly", pct: 67 },
    { name: "Austin Device Plant", pct: 44 },
  ];
  return (
    <div>
      <div className="f-page-header">
        <div className="f-eyebrow">Command Center</div>
        <h1 className="f-title">See the failure before it reaches you.</h1>
        <p className="f-subtitle">
          Fathom models your entire supply network as a live graph — every supplier, plant, warehouse,
          and market — so when one node fails, you see exactly what it touches, what it costs, and
          what to do next, in seconds instead of days.
        </p>
      </div>

      <div className="f-grid-2">
        <div className="f-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Live Network Preview</div>
            <StatusPill phase={phase} />
          </div>
          <NetworkMap phase={phase} compact />
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
            <button className="f-btn primary" onClick={() => go("map")}>
              Enter full command center <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="f-card">
            <div className="f-stat-label">Nodes monitored</div>
            <div className="f-stat-value">{NODES.length}</div>
          </div>
          <div className="f-card">
            <div className="f-stat-label">Revenue behind highest-risk node</div>
            <div className="f-stat-value" style={{ color: "var(--coral)" }}>
              ${(REVENUE_AT_RISK / 1e6).toFixed(1)}M
            </div>
          </div>
          <div className="f-card">
            <div className="f-stat-label" style={{ marginBottom: 10 }}>Top single points of failure</div>
            {centrality.map((c, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                  <span>{c.name}</span><span className="mono" style={{ color: "var(--muted)" }}>{c.pct}%</span>
                </div>
                <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: i === 0 ? "var(--coral)" : "var(--indigo)" }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>
              Betweenness centrality computed over the supplier graph — Hsinchu Semiconductor Co. sits
              on the path to 100% of downstream production.
            </div>
          </div>
        </div>
      </div>

      <div className="f-grid-3" style={{ marginTop: 20 }}>
        {[
          { icon: Network, title: "Neo4j", text: "Every supplier relationship modeled as a graph — cascades are traversed, not guessed." },
          { icon: Zap, title: "RocketRide Cloud", text: "A managed pipeline diagnoses disruptions and ranks mitigations in production, live." },
          { icon: Shield, title: "Butterbase", text: "Auth, incident records, and real mitigation payments — one backend, zero DevOps." },
        ].map((f, i) => (
          <div key={i} className="f-card">
            <f.icon size={18} color="var(--indigo)" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>{f.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapPage({ phase }) {
  const rows = NODES.map((n) => ({
    ...n,
    status: phase === "calm" ? "Healthy" : phase === "resolved" ? "Resolved" : CASCADE.has(n.id) ? (n.id === ROOT ? "Root cause" : "Affected") : "Healthy",
  }));
  return (
    <div>
      <div className="f-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="f-eyebrow">Live Topology</div>
          <h1 className="f-title">Global Network Map</h1>
          <p className="f-subtitle">Every node below is a real relationship in the Neo4j graph — suppliers, components, assembly plants, warehouses, and markets, connected by SUPPLIES edges.</p>
        </div>
        <StatusPill phase={phase} />
      </div>

      <div className="f-card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <NetworkMap phase={phase} />
      </div>

      <div className="f-card">
        <table className="f-table">
          <thead>
            <tr><th>Node</th><th>Type</th><th>Region</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.label}</td>
                <td className="mono" style={{ color: "var(--muted)" }}>{r.tier}</td>
                <td style={{ color: "var(--muted)" }}>{r.region}</td>
                <td>
                  <span className={`f-pill ${r.status === "Healthy" ? "calm" : r.status === "Resolved" ? "resolved" : r.status === "Root cause" ? "active" : "mitigating"}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DisruptionPage({ phase, trigger, go }) {
  const [revealedSteps, setRevealedSteps] = useState(phase === "calm" ? 0 : REASONING_STEPS.length);
  const [showCypher, setShowCypher] = useState(false);
  const timerRef = useRef(null);

  const handleTrigger = () => {
    trigger();
    setRevealedSteps(0);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setRevealedSteps(i);
      if (i >= REASONING_STEPS.length) clearInterval(timerRef.current);
    }, 550);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      <div className="f-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="f-eyebrow">Disruption Response</div>
          <h1 className="f-title">Trace the cascade in real time</h1>
          <p className="f-subtitle">Simulate a real-world disruption signal and watch the agent trace it through the graph, quantify the exposure, and prepare a response.</p>
        </div>
        {phase === "calm" ? (
          <button className="f-btn danger" onClick={handleTrigger}>
            <Play size={14} /> Simulate Disruption Event
          </button>
        ) : (
          <StatusPill phase={phase} />
        )}
      </div>

      <div className="f-grid-2">
        <div className="f-card" style={{ padding: 0, overflow: "hidden" }}>
          <NetworkMap phase={phase} />
        </div>

        <div className="f-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Activity size={15} color="var(--indigo)" />
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>RocketRide Pipeline — Reasoning Trace</div>
          </div>
          {phase === "calm" && (
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14 }}>
              Waiting for a disruption signal. Trigger the simulation to see the pipeline diagnose it live.
            </div>
          )}
          {REASONING_STEPS.slice(0, revealedSteps).map((s, i) => (
            <div className="f-step" key={i} style={{ animationDelay: `${i * 0.02}s` }}>
              <div style={{ marginTop: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: "var(--indigo)" }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{s.detail}</div>
              </div>
            </div>
          ))}

          {revealedSteps >= REASONING_STEPS.length && phase !== "calm" && (
            <div style={{ marginTop: 14 }}>
              <button className="f-btn ghost" onClick={() => setShowCypher((v) => !v)} style={{ marginBottom: 10 }}>
                {showCypher ? <ChevronDown size={13} /> : <ChevronRight size={13} />} View raw Cypher
              </button>
              {showCypher && (
                <div className="f-code-block">{`MATCH (root:Node {id: 'hsinchu'})
      -[:SUPPLIES*1..5]->(downstream:Node)
RETURN downstream.id, downstream.label,
       length(path) AS hops
ORDER BY hops ASC`}</div>
              )}
              <button className="f-btn primary" style={{ marginTop: 14 }} onClick={() => go("mitigation")}>
                Review mitigation options <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MitigationPage({ phase, resolve, go }) {
  const [selected, setSelected] = useState("reroute");
  const [paying, setPaying] = useState(false);

  const handleApprove = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      resolve(selected);
      go("report");
    }, 1400);
  };

  if (phase === "calm") {
    return (
      <div>
        <div className="f-page-header">
          <div className="f-eyebrow">Mitigation & Decision</div>
          <h1 className="f-title">No active disruption</h1>
          <p className="f-subtitle">Trigger a disruption event from the Disruption Response page to see ranked mitigation options here.</p>
        </div>
        <button className="f-btn primary" onClick={() => go("disruption")}>Go to Disruption Response <ArrowRight size={14} /></button>
      </div>
    );
  }

  const opt = MITIGATIONS.find((m) => m.id === selected);

  return (
    <div>
      <div className="f-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="f-eyebrow">Mitigation & Decision</div>
          <h1 className="f-title">Choose a response</h1>
          <p className="f-subtitle">Ranked by the RocketRide pipeline on cost-to-delay ratio and network coverage. Approving a paid option processes a real transaction through Butterbase.</p>
        </div>
        <StatusPill phase={phase === "resolved" ? "resolved" : "active"} />
      </div>

      <div className="f-grid-3" style={{ marginBottom: 20 }}>
        <div className="f-card"><div className="f-stat-label">Revenue at risk</div><div className="f-stat-value" style={{ color: "var(--coral)" }}>${(REVENUE_AT_RISK / 1e6).toFixed(1)}M</div></div>
        <div className="f-card"><div className="f-stat-label">Nodes affected</div><div className="f-stat-value">{AFFECTED_IDS.length}</div></div>
        <div className="f-card"><div className="f-stat-label">Estimated recovery</div><div className="f-stat-value">21 days</div></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {MITIGATIONS.map((m) => (
          <div
            key={m.id}
            className={`f-mit-card ${selected === m.id ? "selected" : ""} ${m.recommended ? "recommended" : ""}`}
            onClick={() => phase !== "resolved" && setSelected(m.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ maxWidth: 480 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{m.detail}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: m.cost === 0 ? "var(--muted)" : "var(--text)" }}>
                  {m.cost === 0 ? "$0" : `$${m.cost.toLocaleString()}`}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{m.days} days · {m.coverage}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {phase !== "resolved" ? (
        <button className="f-btn primary" onClick={handleApprove} disabled={paying}>
          {paying ? <>Processing payment via Butterbase…</> : <><CreditCard size={14} /> Approve & Process Payment (${opt.cost.toLocaleString()})</>}
        </button>
      ) : (
        <div className="f-card" style={{ borderColor: "var(--green)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--green)", fontWeight: 700, fontSize: 13.5 }}>
            <CheckCircle2 size={16} /> Mitigation approved and network resolved.
          </div>
          <button className="f-btn ghost" style={{ marginTop: 12 }} onClick={() => go("report")}>View incident report <ArrowRight size={14} /></button>
        </div>
      )}
    </div>
  );
}

function ReportPage({ phase, mitigationId, go }) {
  if (phase !== "resolved") {
    return (
      <div>
        <div className="f-page-header">
          <div className="f-eyebrow">Incident Report</div>
          <h1 className="f-title">No resolved incident yet</h1>
          <p className="f-subtitle">Run the disruption simulation and approve a mitigation to generate a report here.</p>
        </div>
        <button className="f-btn primary" onClick={() => go("disruption")}>Go to Disruption Response <ArrowRight size={14} /></button>
      </div>
    );
  }

  const mitigation = MITIGATIONS.find((m) => m.id === mitigationId) || MITIGATIONS[0];
  const saved = REVENUE_AT_RISK - mitigation.cost;

  return (
    <div>
      <div className="f-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="f-eyebrow">Incident Report</div>
          <h1 className="f-title">INC-2291 — Hsinchu Semiconductor Disruption</h1>
          <p className="f-subtitle">Logged automatically by the RocketRide pipeline and stored via Butterbase, tied to the on-call user's account.</p>
        </div>
        <span className="f-pill resolved"><CheckCircle2 size={13} /> Resolved</span>
      </div>

      <div className="f-grid-3" style={{ marginBottom: 20 }}>
        <div className="f-card"><div className="f-stat-label">Net revenue protected</div><div className="f-stat-value" style={{ color: "var(--green)" }}>${(saved / 1e6).toFixed(2)}M</div></div>
        <div className="f-card"><div className="f-stat-label">Mitigation cost</div><div className="f-stat-value">${mitigation.cost.toLocaleString()}</div></div>
        <div className="f-card"><div className="f-stat-label">Time to resolution</div><div className="f-stat-value">{mitigation.days} days (est.)</div></div>
      </div>

      <div className="f-grid-2">
        <div className="f-card">
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>Cost breakdown</div>
          <table className="f-table">
            <tbody>
              <tr><td>Mitigation: {mitigation.title}</td><td style={{ textAlign: "right" }} className="mono">${mitigation.cost.toLocaleString()}</td></tr>
              <tr><td>Processing fee (Butterbase)</td><td style={{ textAlign: "right" }} className="mono">$0.00</td></tr>
              <tr><td style={{ fontWeight: 700 }}>Total billed</td><td style={{ textAlign: "right", fontWeight: 700 }} className="mono">${mitigation.cost.toLocaleString()}</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--muted)" }}>Payment method: Corporate card •••• 4471 — processed via Butterbase payments API.</div>
        </div>

        <div className="f-card">
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>Timeline</div>
          {[
            ["Disruption detected", "0m"],
            ["Cascade traced across " + AFFECTED_IDS.length + " nodes", "0m 40s"],
            ["Mitigation options ranked", "1m 10s"],
            [mitigation.title + " approved", "3m 05s"],
            ["Payment processed, network marked resolved", "3m 20s"],
          ].map(([label, t], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span>{label}</span><span className="mono" style={{ color: "var(--muted)" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="f-card" style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>Incident history</div>
        <table className="f-table">
          <thead><tr><th>ID</th><th>Incident</th><th>Date</th><th>Revenue saved</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td className="mono">INC-2291</td><td>Hsinchu Semiconductor Disruption</td><td>Jul 07, 2026</td>
              <td className="mono" style={{ color: "var(--green)" }}>${(saved / 1e6).toFixed(2)}M</td>
              <td><span className="f-pill resolved">Resolved</span></td>
            </tr>
            {HISTORY.map((h) => (
              <tr key={h.id}>
                <td className="mono">{h.id}</td><td>{h.title}</td><td>{h.date}</td>
                <td className="mono" style={{ color: "var(--green)" }}>${h.saved.toLocaleString()}</td>
                <td><span className="f-pill resolved">{h.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* APP SHELL                                                               */
/* ---------------------------------------------------------------------- */

const NAV = [
  { id: "overview", label: "Overview", icon: Globe },
  { id: "map", label: "Network Map", icon: Network },
  { id: "disruption", label: "Disruption Response", icon: AlertTriangle },
  { id: "mitigation", label: "Mitigation & Decision", icon: Shield },
  { id: "report", label: "Incident Report", icon: FileText },
];

function DashboardApp() {
  const [page, setPage] = useState("overview");
  const [phase, setPhase] = useState("calm");
  const [mitigationId, setMitigationId] = useState(null);
  const { user, logout } = useAuth();

  const trigger = () => setPhase("active");
  const resolve = (id) => { setMitigationId(id); setPhase("resolved"); };
  const reset = () => { setPhase("calm"); setMitigationId(null); setPage("overview"); };

  const getRoleNav = () => {
    const commonNav = [
      { id: "overview", label: "Overview", icon: Globe },
      { id: "map", label: "Network Map", icon: Network },
    ];

    if (user.role === "admin") {
      return [
        ...commonNav,
        { id: "disruption", label: "Disruption Response", icon: AlertTriangle },
        { id: "mitigation", label: "Mitigation & Decision", icon: Shield },
        { id: "report", label: "Incident Report", icon: FileText },
        { id: "solutions", label: "Manage Solutions", icon: Wrench },
      ];
    } else if (user.role === "manager") {
      return [
        ...commonNav,
        { id: "disruption", label: "Disruption Response", icon: AlertTriangle },
        { id: "suggestions", label: "Suggestions", icon: Lightbulb },
      ];
    } else {
      return [
        ...commonNav,
        { id: "concerns", label: "Raise Concerns", icon: AlertCircle },
      ];
    }
  };

  const navItems = getRoleNav();

  return (
    <div className="fathom">
      <GlobalStyle />
      <div className="f-sidebar">
        <div className="f-brand">
          <div className="f-brand-mark"><Radio size={16} color="#0A0E17" /></div>
          <div>
            <div className="f-brand-name">Fathom</div>
            <div className="f-brand-sub">{user.role.toUpperCase()}</div>
          </div>
        </div>
        {navItems.map((n) => (
          <div key={n.id} className={`f-navitem ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            <n.icon size={15} /> {n.label}
          </div>
        ))}
        <div className="f-status-block">
          <div style={{ color: "var(--muted)", marginBottom: 8, fontSize: "11px" }}>LOGGED IN AS</div>
          <div style={{ color: "#1F2937", fontSize: "13px", fontWeight: 600, marginBottom: 10 }}>
            {user.name}
          </div>
          <button
            className="f-btn ghost"
            onClick={logout}
            style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "6px 8px" }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div className="f-main">
        {page === "overview" && <OverviewPage phase={phase} go={setPage} />}
        {page === "map" && <MapPage phase={phase} />}
        {page === "disruption" && <DisruptionPage phase={phase} trigger={trigger} go={setPage} />}
        {page === "mitigation" && <MitigationPage phase={phase} resolve={resolve} go={setPage} />}
        {page === "report" && <ReportPage phase={phase} mitigationId={mitigationId} go={setPage} />}
        {page === "concerns" && <ConcernsPage />}
        {page === "suggestions" && <SuggestionsPage />}
        {page === "solutions" && <SolutionsPage />}
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5F7FF 0%, #EFEAFF 100%)',
        fontFamily: '"Inter", sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return user ? <DashboardApp /> : <LoginPage />;
}
