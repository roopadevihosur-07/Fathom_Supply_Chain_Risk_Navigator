# Butterbase Integration — Fathom

Sign up at `dashboard.butterbase.ai`, provision a project, and redeem promo code
`ENJOY0707` in billing before you start (per the hackathon setup checklist).

## 1. Auth

```js
import { createClient } from "@butterbase/sdk";

const butterbase = createClient({
  projectId: process.env.BUTTERBASE_PROJECT_ID,
  apiKey: process.env.BUTTERBASE_PUBLIC_KEY,
});

// Sign in the on-call / ops user
const { user, session } = await butterbase.auth.signInWithPassword({
  email,
  password,
});
```

## 2. Database — incident + supplier metadata

Butterbase holds the relational/document data that doesn't need to be
graph-shaped. Neo4j owns the *relationships*; Butterbase owns the *records*.

```sql
-- Suggested Butterbase table: incidents
create table incidents (
  id text primary key,
  root_node_id text not null,
  event_description text,
  cascade jsonb,
  revenue_at_risk numeric,
  mitigation_id text,
  mitigation_cost numeric,
  status text default 'active', -- active | mitigating | resolved
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  resolved_at timestamptz
);
```

```js
await butterbase.db.from("incidents").insert({
  id: "INC-2291",
  root_node_id: "hsinchu",
  event_description: "Magnitude 6.1 seismic event near Hsinchu facility",
  status: "active",
});
```

## 3. AI Gateway — used inside the RocketRide pipeline's `generate_reasoning` step

Butterbase's model gateway gives one endpoint across providers, so RocketRide's
LLM step doesn't need separate provider keys:

```js
const response = await fetch(`${process.env.BUTTERBASE_API_URL}/ai/generate`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.BUTTERBASE_SERVICE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6", // or gpt-4.1 / gemini-2.5 via the same gateway
    messages: [
      { role: "system", content: "You are a supply chain risk analyst..." },
      { role: "user", content: JSON.stringify({ cascade, revenueAtRisk }) },
    ],
  }),
});
```

## 4. Payment — the mitigation approval flow

This is the mandatory "payment actively in use" piece. Frame it honestly as
the real cost of the mitigation, not a fake checkout:

```js
const { transaction } = await butterbase.payments.charge({
  amount: mitigation.cost * 100, // cents
  currency: "usd",
  description: `Mitigation: ${mitigation.title} — Incident ${incidentId}`,
  customerId: session.user.id,
  metadata: { incidentId, mitigationId: mitigation.id },
});

// On success, update the incident record and unblock the Report page
await butterbase.db.from("incidents").update({
  status: "resolved",
  mitigation_id: mitigation.id,
  mitigation_cost: mitigation.cost,
  resolved_at: new Date().toISOString(),
}).eq("id", incidentId);
```

## Wiring it into the frontend

In `fathom-app.jsx`, replace the simulated `setTimeout` calls with real calls:

- `DisruptionPage.handleTrigger` → `POST {RocketRide endpoint}/run` with `{ rootNodeId: 'hsinchu', eventDescription }`, then render `REASONING_STEPS` from the pipeline's actual `generate_reasoning` output instead of the hardcoded array.
- `MitigationPage.handleApprove` → call `butterbase.payments.charge(...)` above, and only call `resolve()` on a successful transaction.
- `MapPage` / `OverviewPage` → replace the static `NODES`/`EDGES`/`CASCADE` constants with a fetch from `butterbase.db.from('incidents')` and a live Neo4j query for current graph state.
