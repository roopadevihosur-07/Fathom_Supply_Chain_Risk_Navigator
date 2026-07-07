# Fathom - Supply Chain Risk Navigator

![Fathom](https://img.shields.io/badge/Fathom-Supply%20Chain%20Risk-blue)
![Version](https://img.shields.io/badge/version-2.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)
![Neo4j](https://img.shields.io/badge/Neo4j-Aura-0076B6?logo=neo4j)
![Butterbase](https://img.shields.io/badge/Butterbase-SDK-FF6B6B)

## 🎯 Overview

**Fathom** is a cutting-edge supply chain risk management platform that provides real-time disruption detection, impact analysis, and automated mitigation recommendations. Built with a graph-powered dependency model (Neo4j), Fathom enables organizations to see supply chain failures before they cascade across their network.

### Problem Statement

Supply chain disruptions cost billions while teams scramble to understand impact, yet manual analysis takes days—**your business can't wait.**

### The Solution

Fathom gives you:
- ✨ Real-time disruption detection with Neo4j graph queries
- 📊 Graph-powered cascade analysis (9 nodes, real supply chain topology)
- 💰 Revenue impact quantification ($4.2M at-risk across retail network)
- 🎯 AI-ranked mitigation strategies
- 🔐 Multi-role collaboration platform with real authentication
- 🌍 Geographic visualization with real-world node locations
- 💾 Persistent data with Butterbase backend

---

## ✨ Key Features

### 1. **Real-Time Network Visualization**
- **Geographic Map** showing 9 global supply chain nodes with real coordinates
  - Taiwan (Hsinchu, Kaohsiung)
  - China (Shenzhen)
  - USA (Austin, Memphis, NA Retail)
  - Mexico (Guadalajara)
  - Netherlands (Rotterdam)
  - Europe (EU Retail)
- **Dependency Graph** showing 9 SUPPLIES relationships
- Animated disruption propagation visualization
- Pulsing nodes and flowing connections show real-time status
- Color-coded markers: Healthy (teal), Affected (red), Resolved (green)

### 2. **Live Neo4j Cascade Analysis**
- Simulate real-world disruption events at any node
- **Neo4j Aura** queries trace cascades through the dependency graph
- Automatic impact calculation on revenue
- Real-time cascade visualization showing affected downstream nodes
- Cypher query visibility for transparency
- Example: Hsinchu disruption affects 8 downstream nodes, $4.2M revenue at risk

### 3. **Interactive Graph Analytics** (Admin Only)
- **Cytoscape.js visualization** of supply chain network
- **Real-time risk scoring** for all nodes:
  - Scores based on downstream impact, revenue exposure, and node type
  - Risk levels: Critical (🔴), High (🟠), Medium (🟡), Low (🟢)
  - Node size proportional to risk score
- **Cascade history tracking** — Records all disruption simulations with timestamps and impacts
- **Custom Cypher query editor** — Execute queries directly on Neo4j
  - Built-in examples for common patterns
  - Advanced querying for deep analysis
- Click any node to simulate disruption and record cascade event

### 4. **Multi-Role Platform with Real Authentication**
Three distinct user types with specialized capabilities:

#### 👤 **User Role**
- Raise supply chain concerns with risk levels
- Report potential vulnerabilities
- Track concern status through resolution
- Dashboard showing total concerns and critical issues

#### 👔 **Manager Role**
- Analyze reported concerns
- Propose mitigation strategies
- Provide strategic recommendations
- Track suggestion status and effectiveness

#### 🔐 **Admin Role**
- Full platform access
- Create and manage mitigation solutions
- Edit mitigation strategies
- Approve and implement responses
- View complete incident history
- Access disruption response simulator
- **Access Graph Analytics** with risk scoring and custom queries

### 5. **Persistent Data Backend**
- **Butterbase** database with 4 core tables:
  - `profiles` — User roles and permissions
  - `concerns` — Supply chain issues (title, description, risk_level, status)
  - `suggestions` — Manager proposals (concern_id, proposed_by, status)
  - `solutions` — Admin solutions (cost, time_to_resolve, coverage, status)
- Data survives page refreshes
- Real-time multi-user synchronization
- Role-based access control

### 6. **Intelligent Mitigation Ranking**
- Cost-to-delay analysis
- Network coverage assessment
- Time-to-resolution estimation
- Recommended solution highlighting

### 7. **Incident Tracking & Reporting**
- Automatic incident logging
- Cost breakdown analysis
- Timeline tracking
- Historical incident records
- Revenue protection metrics

---

## 🏗️ Architecture

### Frontend
- **React 18.2.0** with Vite 5.0.0 for fast development
- **Glassmorphism UI** design with backdrop blur effects
- **Leaflet + React-Leaflet** for geographic mapping
- **SVG animations** for network visualization
- Context API for state management (AuthContext, DataContext)

### Backend & Data
- **Butterbase** for authentication, database, and serverless functions
  - Real-time auth with JWT tokens
  - PostgreSQL-compatible API
  - Serverless function deployment
- **Neo4j Aura** for supply chain graph
  - 9 nodes representing supply chain entities
  - 9 SUPPLIES relationships
  - Live cascade queries via Cypher
- **Direct REST API calls** with OAuth2 bearer tokens

### Real-World Data
- **9 supply chain nodes** with geographic coordinates
- **9 supply relationships** representing material flow
- **Revenue calculations** ($2.8M NA retail, $1.4M EU retail)
- **Live cascade simulation** from any node

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 7+ or **yarn**
- **Butterbase account** (free tier available)
- **Neo4j Aura account** (free instance)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator.git
   cd Fathom_Supply_Chain_Risk_Navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install neo4j-driver
   ```

3. **Set up Butterbase**
   - Create account at [dashboard.butterbase.ai](https://dashboard.butterbase.ai)
   - Create app named `fathom`
   - Get your `app_id` and create API key

4. **Set up Neo4j Aura**
   - Create free instance at [console.neo4j.io](https://console.neo4j.io)
   - Get connection URI, username, password

5. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   # Butterbase
   VITE_BUTTERBASE_APP_ID=app_your_id_here
   VITE_BUTTERBASE_API_URL=https://api.butterbase.ai
   VITE_BUTTERBASE_API_KEY=bb_sk_your_key_here
   
   # Neo4j
   NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=your_password_here
   NEO4J_DATABASE=neo4j
   ```

6. **Seed the Neo4j database**
   ```bash
   node scripts/seed-neo4j.js
   ```

7. **Deploy Neo4j cascade function**
   ```bash
   node scripts/deploy-neo4j-function.js
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173/

---

## 🔐 Demo Credentials

Login with these test accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@fathom.com` | `Fathom@2026!` | Admin (Full Access) |
| `manager@fathom.com` | `Fathom@2026!` | Manager (Suggestions) |
| `user@fathom.com` | `Fathom@2026!` | User (Concerns) |

---

## 📊 Supply Chain Nodes

### Tier 1: Suppliers (Asia-Pacific)
- **Hsinchu Semiconductor Co.** (Taiwan) — Primary semiconductor supplier
- **Kaohsiung Chip Packaging** (Taiwan) — Component packaging
- **Shenzhen Circuit Assembly** (China) — Circuit assembly

### Tier 2: Assembly Plants (North America)
- **Austin Device Plant** (USA) — Primary assembly
- **Guadalajara Assembly** (Mexico) — Secondary assembly

### Tier 3: Distribution
- **Memphis Distribution Center** (USA) — NA logistics hub
- **Rotterdam Distribution Hub** (Netherlands) — EU logistics hub

### Tier 4: Markets (Retail)
- **North America Retail Network** — $2.8M weekly revenue
- **EU Retail Network** — $1.4M weekly revenue

---

## 🌐 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 5.0.0 | Build tool |
| React-Leaflet | 4.2.0 | Geographic mapping |
| Leaflet | 1.9.4 | Map library |
| Lucide React | - | Icon library |

### Backend & Data
| Technology | Purpose |
|-----------|---------|
| Butterbase SDK | Authentication, database, serverless |
| Neo4j Aura | Graph database for supply chain |
| Neo4j Driver | Cypher query execution |

### Development
| Tool | Purpose |
|------|---------|
| npm | Package management |
| git | Version control |
| dotenv | Environment configuration |

---

## 📁 Project Structure

```
Fathom/
├── src/
│   ├── App.jsx                 # Main app with all pages
│   ├── AuthContext.jsx         # Real Butterbase authentication
│   ├── DataContext.jsx         # Real Butterbase database
│   ├── LoginPage.jsx           # Login interface
│   ├── ConcernsPage.jsx        # User: report concerns
│   ├── SuggestionsPage.jsx     # Manager: propose solutions
│   ├── SolutionsPage.jsx       # Admin: manage solutions
│   ├── GeographicMap.jsx       # Leaflet map visualization
│   ├── lib/
│   │   └── butterbaseClient.js # Butterbase SDK client
│   └── index.css               # Global styles
├── functions/
│   ├── neo4j-cascade.ts        # Neo4j cascade serverless function
│   └── neo4j-cascade-deploy.json # Function deployment config
├── scripts/
│   ├── seed-neo4j.js           # Populate Neo4j with supply chain graph
│   ├── apply-schema.js         # Create Butterbase database schema
│   ├── lock-app.js             # Secure app to authenticated users
│   ├── create-users.js         # Create demo user accounts
│   ├── check-profiles.js       # Verify user roles in database
│   └── deploy-neo4j-function.js # Deploy cascade function to Butterbase
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🔄 Workflow

### 1. **User Logs In**
   - Real Butterbase authentication
   - Role fetched from `profiles` table
   - Session token stored for API calls

### 2. **User Reports Concern**
   - Data saved to `concerns` table
   - Persists across sessions
   - Visible to managers and admins

### 3. **Manager Reviews & Proposes**
   - Views concern details
   - Creates suggestion
   - Saved to `suggestions` table

### 4. **Admin Simulates Disruption**
   - Clicks "Simulate Disruption Event"
   - **Neo4j Aura** traces cascade from Hsinchu
   - Returns affected nodes: [hsinchu, kaohsiung, shenzhen, austin, guadalajara, memphis, na_retail, rotterdam, eu_retail]
   - Maps affected nodes (red), healthy (teal)
   - Calculates revenue at risk: $4.2M

### 5. **Admin Creates Solutions**
   - Define mitigation strategy
   - Set cost and timeline
   - Mark as recommended
   - Saved to `solutions` table
   - Ready for payment (Step 12: Stripe integration)

---

## 🧪 Testing

### Test Disruption Cascade
1. Login as admin
2. Go to "Disruption Response"
3. Click "Simulate Disruption Event"
4. Watch the network graph highlight affected nodes
5. See cascade from Hsinchu: 8 affected nodes, $4.2M revenue at risk

### Test Database Persistence
1. Create a concern as a user
2. Logout and login
3. Concern is still there (saved in Butterbase)

### Test Role-Based Access
1. Login as `user@fathom.com` → only Concerns page
2. Login as `manager@fathom.com` → Concerns + Suggestions
3. Login as `admin@fathom.com` → All pages including Disruption Response

### Test Neo4j Queries
1. Open [Neo4j Browser](https://console.neo4j.io)
2. Run: `MATCH (n) RETURN n LIMIT 20`
3. See all 9 supply chain nodes
4. Run: `MATCH (a)-[r:SUPPLIES]->(b) RETURN a.id, b.id`
5. See all 9 relationships

---

## 📚 API Integration Steps (Steps 1-10)

✅ **Step 1:** Create Butterbase app  
✅ **Step 2:** Apply database schema (profiles, concerns, suggestions, solutions)  
✅ **Step 3:** Lock app to authenticated users  
✅ **Step 4:** Create demo users with roles  
✅ **Step 5:** Wire up frontend client  
✅ **Step 6:** Replace AuthContext with real login  
✅ **Step 7:** Replace DataContext with real database calls  
✅ **Step 8:** Seed Neo4j with supply chain graph  
✅ **Step 9:** Deploy Neo4j cascade function  
✅ **Step 10:** Wire frontend to call Neo4j function  

### Remaining Steps

⏳ **Step 11:** RocketRide pipeline (local reasoning engine)  
⏳ **Step 12:** Payment flow (Stripe Connect for approvals)  

---

## 🔐 Security

- ✅ All API calls authenticated with bearer tokens
- ✅ Credentials stored in `.env` (not in code)
- ✅ Butterbase provides request-level auth and row-level security
- ✅ Neo4j connection encrypted (neo4j+s protocol)
- ✅ Session tokens expire after 15 minutes

---

## 📖 Documentation

- [INTEGRATION_STEPS.md](./INTEGRATION_STEPS.md) — Complete setup guide
- [BUTTERBASE_SETUP.md](./BUTTERBASE_SETUP.md) — Butterbase configuration
- [GRAPH_ANALYTICS.md](./GRAPH_ANALYTICS.md) — Neo4j Graph Analytics guide
- [CREDENTIALS.md](./CREDENTIALS.md) — Demo account credentials
- [Neo4j Schema](./neo4j-schema.cypher) — Graph structure

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Future Roadmap

- [ ] Step 11: RocketRide integration for AI reasoning
- [ ] Step 12: Stripe payment processing
- [ ] Advanced analytics dashboard
- [ ] Real-time Slack/email alerts
- [ ] Third-party supplier integration APIs
- [ ] Mobile app for on-the-go monitoring
- [ ] ML-powered disruption prediction
- [ ] Supply chain benchmark comparisons

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [GitHub Issue](https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator/issues)
- Check [INTEGRATION_STEPS.md](./INTEGRATION_STEPS.md) for setup help
- Review [BUTTERBASE_SETUP.md](./BUTTERBASE_SETUP.md) for API issues

---

## 🎉 Acknowledgments

Built with ❤️ using:
- React & Vite for fast development
- Butterbase for backend infrastructure
- Neo4j for graph-powered insights
- Leaflet for beautiful maps
- The amazing supply chain community

---

**Last Updated:** 2026-07-07  
**Version:** 2.0.0 (Full integration with Butterbase + Neo4j)  
**Status:** ✅ Steps 1-10 Complete | ⏳ Steps 11-12 Pending
