# Fathom - Supply Chain Risk Navigator

![Fathom](https://img.shields.io/badge/Fathom-Supply%20Chain%20Risk-blue)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)

## 🎯 Overview

**Fathom** is a cutting-edge supply chain risk management platform that provides real-time disruption detection, impact analysis, and automated mitigation recommendations. Built with a graph-powered dependency model, Fathom enables organizations to see supply chain failures before they cascade across their network.

### Problem Statement

Supply chain disruptions cost billions while teams scramble to understand impact, yet manual analysis takes days—**your business can't wait.**

### The Solution

Fathom gives you:
- ✨ Real-time disruption detection
- 📊 Graph-powered cascade analysis
- 💰 Revenue impact quantification
- 🎯 AI-ranked mitigation strategies
- 🔐 Multi-role collaboration platform

---

## ✨ Key Features

### 1. **Real-Time Network Visualization**
- Interactive global supply chain topology
- Live node monitoring (Suppliers, Components, Assembly Plants, Warehouses, Markets)
- Animated disruption propagation visualization
- Pulsing nodes and flowing connections show real-time status

### 2. **Disruption Simulation & Analysis**
- Simulate real-world disruption events
- Watch AI trace cascades through the dependency graph
- Automatic impact calculation on revenue
- Real-time reasoning trace visualization

### 3. **Multi-Role Platform**
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
- Create and manage solutions
- Edit mitigation strategies
- Approve and implement responses
- View complete incident history

### 4. **Intelligent Mitigation Ranking**
- Cost-to-delay analysis
- Network coverage assessment
- Time-to-resolution estimation
- Recommended solution highlighting

### 5. **Incident Tracking**
- Automatic incident logging
- Cost breakdown analysis
- Timeline tracking
- Historical incident records
- Revenue protection metrics

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 7+ or **yarn**
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
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 Demo Accounts

### Quick Login - Try These Credentials

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| **Admin** | `admin@fathom.com` | `admin123` | Manage solutions, edit strategies, full access |
| **Manager** | `manager@fathom.com` | `manager123` | Analyze risks, provide suggestions |
| **User** | `user@fathom.com` | `user123` | Raise concerns, report vulnerabilities |

---

## 📊 Application Architecture

### Component Structure

```
Fathom/
├── src/
│   ├── main.jsx                  # Entry point with providers
│   ├── App.jsx                   # Main app shell & routing
│   ├── LoginPage.jsx             # Professional login interface
│   ├── AuthContext.jsx           # Authentication & session management
│   ├── DataContext.jsx           # Global data state management
│   ├── ConcernsPage.jsx          # User concern reporting
│   ├── SuggestionsPage.jsx       # Manager strategy suggestions
│   ├── SolutionsPage.jsx         # Admin solution management
│   ├── SupplyChainAnimation.jsx  # Animated network visualization
│   └── index.css                 # Global styles
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite build configuration
└── index.html                    # HTML entry point
```

### Data Flow

```
User Login → AuthContext
    ↓
Role Detection
    ↓
Role-Specific Dashboard
    ↓
DataContext (Concerns/Suggestions/Solutions)
    ↓
Real-time Updates & Visualization
```

---

## 🎨 Design System

### Color Palette

- **Primary**: Indigo (#6366F1)
- **Accent**: Teal (#0D9488)
- **Success**: Green (#10B981)
- **Warning**: Amber (#D97706)
- **Danger**: Red (#DC2626)
- **Background**: Light Blue (#F5F7FF)

### Typography

- **Headings**: Manrope (Bold, 700-900 weight)
- **Body**: Inter (Regular, 400-600 weight)
- **Mono**: IBM Plex Mono (Code & data)

### Visual Features

- **Glassmorphism**: Semi-transparent, blurred backgrounds
- **Gradient Accents**: Teal to Indigo transitions
- **Smooth Animations**: 0.2s - 2s transition timings
- **Shadow Depth**: Multi-layer shadows for hierarchy

---

## 📱 User Workflows

### User (Concern Reporting)
1. Log in as User
2. Navigate to "Raise Concerns"
3. Create new concern with title, description, and risk level
4. Track concern status through resolution
5. View dashboard statistics

### Manager (Strategy Analysis)
1. Log in as Manager
2. View pending concerns in Dashboard
3. Navigate to "Suggestions"
4. Select concern and propose mitigation strategy
5. Provide detailed reasoning and expected outcomes
6. Track suggestion status

### Admin (Solution Management)
1. Log in as Admin
2. Access "Manage Solutions"
3. Review manager suggestions
4. Create/edit solutions with cost, timeline, coverage
5. Mark recommended solutions
6. View incident reports and cost breakdowns

---

## 🔧 Technology Stack

### Frontend Framework
- **React 18.2.0** - UI library
- **Vite 5.0.0** - Fast build tool & dev server

### UI Components & Icons
- **Lucide React** - Beautiful icon library
- **CSS-in-JS** - Inline styling with React

### State Management
- **React Context API** - Global authentication & data state
- **localStorage** - Session persistence

### Build & Development
- **Vite** - Lightning-fast builds
- **ESBuild** - JS/TS transpilation
- **Rollup** - Code splitting & bundling

### Styling
- **Glassmorphism CSS** - Modern UI effects
- **Gradient Backgrounds** - Visual hierarchy
- **Responsive Grid** - Mobile-friendly layouts
- **SVG Animations** - Network visualization

---

## 📊 Key Metrics & Statistics

The platform tracks and displays:

| Metric | Description |
|--------|-------------|
| **Network Nodes** | 9 global supply chain nodes monitored |
| **Revenue Exposure** | $3.5M+ protected from disruptions |
| **Analysis Speed** | 5 seconds from disruption to impact analysis |
| **User Roles** | 3 specialized user types with unique capabilities |

---

## 🎯 Sample Data

### Supply Chain Network
- **3 Regions**: Asia-Pacific, North America, Europe
- **9 Network Nodes**: Suppliers, Components, Plants, Warehouses, Markets
- **Multiple Edge Connections**: Representing supplier relationships
- **Real-Time Status Tracking**: Healthy, Affected, or Resolved

### Incident Simulation
- **Mock Disruption**: 6.1 magnitude seismic event at Hsinchu
- **Affected Nodes**: 8 downstream entities across 3 regions
- **Revenue at Risk**: $4.2M over 21-day recovery window
- **Mitigation Options**: 3 ranked by cost-to-delay ratio

---

## 🔄 Workflow Example

### Scenario: Supplier Disruption

1. **Disruption Occurs**
   - Hsinchu Semiconductor experiences supply disruption

2. **System Detection** (Instant)
   - Platform detects event
   - Queries Neo4j dependency graph
   - Maps 8 affected downstream nodes

3. **Impact Analysis** (5 seconds)
   - Calculates $4.2M revenue at risk
   - Identifies 3 regions impacted
   - Estimates 21-day recovery window

4. **User Concern** (Minutes)
   - User raises concern about vulnerability
   - Marks as "High Risk"
   - Provides detailed context

5. **Manager Suggestion** (Minutes)
   - Manager reviews and analyzes
   - Proposes emergency rerouting strategy
   - Outlines expected outcomes

6. **Admin Decision** (Hours)
   - Admin reviews all suggestions
   - Creates comprehensive solution
   - Sets cost ($46,000) and timeline (5 days)

7. **Implementation** (Real-time)
   - Mitigation approved
   - Payment processed
   - Incident logged with full cost breakdown

8. **Resolution** (5 days)
   - Network status updated
   - $3.8M revenue protected
   - Incident closed with analytics

---

## 🛠️ Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Dependencies Installation Error
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Failures
Ensure correct Node version and rebuild:
```bash
node --version  # Should be 16+
npm run build
```

### Login Not Working
- Check demo credentials in the login form
- Try showing demo accounts
- Clear localStorage and refresh

---

## 📈 Performance

### Bundle Size
- **Production Build**: ~223KB (JavaScript)
- **CSS**: ~29KB (Gzipped)
- **Total Gzipped**: ~64KB

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

---

## 🚧 Roadmap

### Phase 1 (Current) ✅
- [x] Multi-role authentication system
- [x] Real-time network visualization
- [x] Disruption simulation engine
- [x] Mitigation ranking algorithm
- [x] Professional UI with glassmorphism
- [x] Data persistence

### Phase 2 (Planned)
- [ ] Neo4j graph database integration
- [ ] Real-time event ingestion pipeline
- [ ] Advanced analytics dashboard
- [ ] Export reports (PDF, CSV)
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Machine learning disruption prediction
- [ ] Automated response execution
- [ ] Supply chain optimization recommendations
- [ ] Multi-tenant enterprise features
- [ ] Advanced compliance tracking

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support & Contact

For questions, suggestions, or issues:

- **Email**: support@fathom.com
- **Issues**: [GitHub Issues](https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator/discussions)

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Icons from [Lucide React](https://lucide.dev/)
- Inspired by supply chain management best practices
- Designed for enterprise-grade risk management

---

## 📄 Additional Resources

- [Project Architecture Documentation](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [User Guide](./docs/user-guide.md)
- [Developer Guide](./docs/developer-guide.md)

---

<div align="center">

**Made with ❤️ by the Fathom Team**

[GitHub](https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator) • [Issues](https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator/issues) • [Discussions](https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator/discussions)

</div>
