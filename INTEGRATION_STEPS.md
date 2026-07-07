# Fathom — Real Integration: Step by Step

Do these in order. Each step says exactly what to click/run and which file to edit.
Total files referenced: `functions/neo4j-cascade.ts`, `src/lib/butterbaseClient.js`,
`src/AuthContext.jsx`, `src/DataContext.jsx` (all provided alongside this guide).

---

## STEP 1 — Create your Butterbase app

1. Go to **dashboard.butterbase.ai**, sign up, redeem promo code `ENJOY0707` under Billing.
2. Create an app called `fathom` (dashboard, or MCP tool `init_app` with `name: "fathom"`).
3. **Write down two values** — you'll need them everywhere below:
   - `app_id` (e.g. `app_abc123`)
   - `apiUrl` — always `https://api.butterbase.ai` regardless of region.

4. In your project root:
   ```bash
   npm install @butterbase/sdk
   ```

---

## STEP 2 — Define your schema

Use the MCP tool `apply_schema` (if your AI assistant is connected via Butterbase's MCP
server) or the dashboard's schema editor. Preview with `dry_run: true` first, then apply
this schema:

```json
{
  "schema": {
    "tables": {
      "profiles": {
        "columns": {
          "user_id": { "type": "uuid", "primary": true },
          "role": { "type": "text", "nullable": false },
          "name": { "type": "text" }
        }
      },
      "concerns": {
        "columns": {
          "id": { "type": "uuid", "primary": true, "default": "gen_random_uuid()" },
          "title": { "type": "text", "nullable": false },
          "description": { "type": "text" },
          "risk_level": { "type": "text" },
          "reporter": { "type": "text" },
          "reporter_id": { "type": "uuid" },
          "status": { "type": "text", "default": "'open'" },
          "created_at": { "type": "timestamptz", "default": "now()" }
        }
      },
      "suggestions": {
        "columns": {
          "id": { "type": "uuid", "primary": true, "default": "gen_random_uuid()" },
          "concern_id": { "type": "uuid", "nullable": false },
          "title": { "type": "text", "nullable": false },
          "description": { "type": "text" },
          "proposed_by": { "type": "text" },
          "status": { "type": "text", "default": "'pending'" },
          "created_at": { "type": "timestamptz", "default": "now()" }
        }
      },
      "solutions": {
        "columns": {
          "id": { "type": "uuid", "primary": true, "default": "gen_random_uuid()" },
          "concern_id": { "type": "uuid", "nullable": false },
          "title": { "type": "text", "nullable": false },
          "description": { "type": "text" },
          "cost": { "type": "integer", "default": "0" },
          "time_to_resolve": { "type": "integer" },
          "coverage": { "type": "text" },
          "recommended": { "type": "boolean", "default": "false" },
          "created_by": { "type": "text" },
          "status": { "type": "text", "default": "'active'" },
          "created_at": { "type": "timestamptz", "default": "now()" }
        }
      }
    }
  },
  "name": "fathom initial schema"
}
```

## STEP 3 — Lock the app to signed-in users only

This is a collaboration tool (User/Manager/Admin all need to see the same concerns), so
you don't want per-row RLS isolation — you want "must be logged in, everyone reads
everything." One call does this:

```
POST /v1/{app_id}/secure
Authorization: Bearer {your platform token}

{ "tables": [] }
```

This sets `access_mode: "authenticated"` without adding row-level restrictions. Anonymous
requests now get rejected; any logged-in user (User/Manager/Admin) can read/write the
four tables above.

## STEP 4 — Create your three demo users

Run these three times with different values (curl, or write a 10-line seed script):

```bash
curl -X POST https://api.butterbase.ai/auth/{app_id}/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fathom.com","password":"Fathom@2026!","display_name":"Admin"}'
```

Repeat for `manager@fathom.com` / `user@fathom.com`. Each signup returns a `user.id` —
save those three UUIDs, then insert their roles:

```bash
curl -X POST https://api.butterbase.ai/v1/{app_id}/profiles \
  -H "Authorization: Bearer {admin_access_token}" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"<admin-uuid>","role":"admin","name":"Admin"}'
```
(repeat for manager/user roles)

---

## STEP 5 — Wire up the frontend client

Use `src/lib/butterbaseClient.js` (provided) — it's the single `createClient(...)` call
every other file imports from. Set your two values as Vite env vars:

`.env` (project root, gitignored):
```
VITE_BUTTERBASE_APP_ID=app_abc123
VITE_BUTTERBASE_API_URL=https://api.butterbase.ai
```

## STEP 6 — Replace AuthContext.jsx

Swap in the provided `src/AuthContext.jsx` — it replaces the hardcoded `validUsers`
object with real `butterbase.auth.signIn()` calls, and pulls `role` from the `profiles`
table after login instead of a dictionary lookup.

## STEP 7 — Replace DataContext.jsx

Swap in the provided `src/DataContext.jsx` — it replaces every `useState` array with
`butterbase.from('concerns'|'suggestions'|'solutions')` calls, so data survives a page
refresh and is genuinely shared across roles/devices during your demo.

---

## STEP 8 — Neo4j: seed the graph

1. Create a free **Neo4j Aura** instance at console.neo4j.io. Save the connection URI,
   username, and password.
2. Open the Aura **Query** tab and paste in your existing `neo4j-schema.cypher` file —
   run the constraint + seed-node + seed-relationship blocks (skip the query blocks at
   the bottom, those are called at runtime, not seed time).

## STEP 9 — Neo4j: deploy the proxy as a Butterbase Function

Browsers can't hold a Bolt connection to Aura directly, and this hackathon's rules want
Butterbase load-bearing anyway — so host the Neo4j proxy **as a Butterbase serverless
function**, not a separate server. Use `functions/neo4j-cascade.ts` (provided).

Deploy it:
```bash
curl -X POST https://api.butterbase.ai/v1/{app_id}/functions \
  -H "Authorization: Bearer {platform_token}" \
  -H "Content-Type: application/json" \
  -d @functions/neo4j-cascade-deploy.json
```
(the deploy JSON wraps the file's code as a string — see the comment at the bottom of
`functions/neo4j-cascade.ts` for the exact `envVars` to pass: `NEO4J_URI`, `NEO4J_USER`,
`NEO4J_PASSWORD`)

Once deployed, it's callable at:
```
POST https://api.butterbase.ai/v1/{app_id}/fn/neo4j-cascade
Authorization: Bearer {user_access_token}
Body: { "rootNodeId": "hsinchu" }
```

## STEP 10 — Wire the frontend to call it

In `App.jsx`'s `DisruptionPage`, replace the client-side `computeCascade()` call with:

```js
const res = await fetch(`${import.meta.env.VITE_BUTTERBASE_API_URL}/v1/${appId}/fn/neo4j-cascade`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  },
  body: JSON.stringify({ rootNodeId: "hsinchu" }),
});
const { cascade, revenueAtRisk } = await res.json();
```

This is the change that satisfies "Neo4j must be actively traversed" — the cascade now
comes from a live Cypher query, not a hardcoded BFS.

---

## STEP 11 — RocketRide: run the pipeline LOCALLY (per organizer guidance)

> **Deviation from the written problem statement, confirmed directly by event
> organizers**: RocketRide Cloud is not to be used — run the pipeline locally instead.
> State this explicitly in your submission's project description (e.g. *"RocketRide
> pipeline runs locally per organizer guidance due to a Cloud platform issue"*) so judges
> aren't comparing your build against the written "Cloud" requirement without context.

1. Open the RocketRide VS Code extension, import your existing `rocketride-pipeline.json`.
2. **One edit needed**: point the `generate_reasoning` step's LLM call at Butterbase's
   gateway instead of a generic provider —

```json
{
  "id": "generate_reasoning",
  "type": "http_call",
  "config": {
    "method": "POST",
    "url": "https://api.butterbase.ai/v1/{{env.BUTTERBASE_APP_ID}}/chat/completions",
    "headers": { "Authorization": "Bearer {{env.BUTTERBASE_SERVICE_KEY}}" },
    "body": {
      "model": "anthropic/claude-sonnet-4.6",
      "messages": [
        { "role": "system", "content": "You are a supply chain risk analyst. Given a cascade trace, revenue exposure, and alternate supplier data, return JSON only: a one-paragraph summary and 2-3 ranked mitigation options with cost, time, and coverage." },
        { "role": "user", "content": "{{input.eventDescription}} | Cascade: {{steps.trace_cascade.output}} | Revenue at risk: {{steps.revenue_exposure.output}}" }
      ]
    }
  }
}
```

3. **Run it locally** instead of deploying to `cloud.rocketride.ai`. Two options:

   **Option A — VS Code extension's local run** (simplest, no Docker needed): use the
   extension's "Run Pipeline" action instead of "Deploy to Cloud." This runs the
   pipeline's C++ engine as a local process, exposed on `http://localhost:5565` by
   default.

   **Option B — self-hosted via Docker** (steadier if you're restarting the demo often):
   ```bash
   docker run -p 5565:5565 rocketride/engine
   rocketride use --filepath rocketride-pipeline.json --uri http://localhost:5565
   ```

4. In `DisruptionPage.handleTrigger`, point at the local endpoint instead of a cloud URL:

```js
const ROCKETRIDE_ENDPOINT = "http://localhost:5565"; // local per organizer guidance

const res = await fetch(`${ROCKETRIDE_ENDPOINT}/pipelines/fathom-disruption-response/run`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ rootNodeId: "hsinchu", eventDescription: "Magnitude 6.1 seismic event near Hsinchu facility" }),
});
const { cascade, revenueAtRisk, mitigations } = await res.json();
```

**Constraint to plan around**: this only works if the browser running your demo is on
the *same machine* as the RocketRide engine (`localhost` doesn't resolve across
machines). Fine for demoing from your own laptop — just make sure
`docker run -p 5565:5565 rocketride/engine` (or the extension's local run) is already
started before you go on stage. If judges will independently open your deployed frontend
from their own devices, this call will fail for them since there's no local engine on
their machine — worth clarifying with organizers whether judging happens live on your
laptop or via an independently-opened link.

---

## STEP 12 — Payment: the Admin-approval flow

This is the mandatory piece most teams skip — it's a genuine Stripe Connect flow, not a
fake button.

1. **Onboard Connect** (one time): `POST /v1/{app_id}/billing/connect/onboard` →
   returns `onboardingUrl`. Open it, complete Stripe's test-mode onboarding (a few
   clicks, no real bank details needed in test mode).
2. Check it's ready: `GET /v1/{app_id}/billing/connect/status`.
3. **Create one product per mitigation** (one-time, at setup — your mitigation costs are
   fixed, so this fits perfectly):
   ```bash
   curl -X POST https://api.butterbase.ai/v1/{app_id}/billing/products \
     -H "Authorization: Bearer {platform_token}" -H "Content-Type: application/json" \
     -d '{"name":"Emergency reroute mitigation","priceCents":4600000}'
   ```
   Repeat for the air-freight option (`1840000` cents). Save the returned `product_id`s.
4. In `SolutionsPage.jsx`, when Admin clicks **Approve**, call:
   ```js
   const { data } = await butterbase.functions // or direct fetch
   const res = await fetch(`${apiUrl}/v1/${appId}/billing/purchase`, {
     method: "POST",
     headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
     body: JSON.stringify({ productId: mitigation.productId }),
   });
   const { url } = await res.json();
   window.location.href = url; // Stripe Checkout
   ```
5. On return (`successUrl`), mark the solution `status: "resolved"` via
   `butterbase.from('solutions').update(...)` and update the `concerns` row too.

---

## Order to actually do this in, given limited time

1. Steps 1–7 (Butterbase auth + DB) — biggest gap, self-contained, ~45–60 min.
2. Step 12 (payment) — do the Connect onboarding early since it can involve a redirect/
   verification step that's better not left to the last 10 minutes.
3. Steps 8–10 (Neo4j) — most technically involved; if short on time, hardcode `NODES`/
   `EDGES` but make sure `neo4j-cascade` function genuinely queries Aura for the cascade.
4. Step 11 (RocketRide) — do last; it's the most self-contained change once the pipeline
   is drafted. Since it's running locally per organizer guidance, double-check *before*
   your demo slot that the local engine (Docker or the VS Code extension) is actually
   running on the machine you'll be presenting from — there's no cloud fallback if it
   crashes mid-demo the way there would be with a hosted endpoint.
