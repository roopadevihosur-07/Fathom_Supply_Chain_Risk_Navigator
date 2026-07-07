# Butterbase MCP Integration Guide

This guide explains how to properly set up and integrate Butterbase MCP (Model Context Protocol) with the Fathom Supply Chain Risk Navigator.

## 🔐 Security First

⚠️ **IMPORTANT**: Never commit API keys or secrets to the repository!

Always use environment variables to manage sensitive credentials.

## 📋 Prerequisites

1. **Butterbase Account**: Created at [Butterbase](https://butterbase.ai)
2. **API Key**: Generated from your Butterbase dashboard
3. **Node.js**: 16+ installed
4. **Environment Setup**: `.env` file configured locally

## 🚀 Setup Instructions

### Step 1: Generate Butterbase API Key

1. Go to [Butterbase Dashboard](https://api.butterbase.ai)
2. Navigate to **Settings → API Keys**
3. Click **Generate New Key**
4. Copy the generated API key (starts with `bb_sk_`)
5. Store it securely (never share or commit!)

### Step 2: Create Local Environment File

Create a `.env` file in the project root (DO NOT commit this file):

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Butterbase Configuration
VITE_BUTTERBASE_API_URL=https://api.butterbase.ai
VITE_BUTTERBASE_API_KEY=bb_sk_your_actual_key_here

# MCP Server Configuration
MCP_SERVER_URL=https://api.butterbase.ai/mcp
MCP_TRANSPORT=http
MCP_SCOPE=user
MCP_AUTH_HEADER=Authorization: Bearer bb_sk_your_actual_key_here

# Environment
VITE_ENV=development
```

### Step 3: Configure Claude MCP (Optional)

If using Claude Code with MCP support:

```bash
claude config set mcp.butterbase.url https://api.butterbase.ai/mcp
claude config set mcp.butterbase.transport http
claude config set mcp.butterbase.scope user
```

Or add to `~/.claude/settings.json`:

```json
{
  "mcp": {
    "butterbase": {
      "url": "https://api.butterbase.ai/mcp",
      "transport": "http",
      "scope": "user",
      "auth": {
        "type": "bearer",
        "header": "Authorization",
        "tokenEnv": "BUTTERBASE_API_KEY"
      }
    }
  }
}
```

### Step 4: Initialize Butterbase in Your App

```javascript
import { initButterbaeMCP } from './butterbase.mcp.config.js';

// In your app initialization
async function setupBatterbase() {
  const butterbseClient = await initButterbaeMCP();
  if (butterbseClient) {
    console.log('✅ Butterbase MCP connected');
    // Now you can use Butterbase services
  }
}
```

## 🔌 API Integration Points

### Payment Processing

```javascript
// Example: Process mitigation payment
async function processMitigationPayment(mitigationId, amount) {
  try {
    const transaction = await butterbseClient.payments.create({
      amount: amount,
      currency: 'USD',
      description: `Mitigation approval: ${mitigationId}`,
      metadata: {
        mitigationId,
        incident: 'supply-chain-disruption',
      },
    });
    return transaction;
  } catch (error) {
    console.error('Payment processing failed:', error);
  }
}
```

### Authentication

```javascript
// Example: User authentication via Butterbase
async function authenticateUser(email, password) {
  try {
    const user = await butterbseClient.auth.login({
      email,
      password,
    });
    return user;
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

### Incident Tracking

```javascript
// Example: Log incident to Butterbase
async function logIncident(incident) {
  try {
    const record = await butterbseClient.incidents.create({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      nodes_affected: incident.affectedNodes,
      revenue_at_risk: incident.revenueAtRisk,
      metadata: {
        timestamp: new Date(),
        resolved_by: incident.resolvedBy,
      },
    });
    return record;
  } catch (error) {
    console.error('Incident logging failed:', error);
  }
}
```

### Audit Logging

```javascript
// Example: Log actions for compliance
async function logAction(action) {
  try {
    await butterbseClient.audit.log({
      action: action.type,
      actor: action.userId,
      resource: action.resourceId,
      changes: action.changes,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}
```

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Store API keys in `.env` files (local only)
- ✅ Use environment variables in production
- ✅ Rotate API keys regularly
- ✅ Use role-based access tokens
- ✅ Log security events
- ✅ Enable HTTPS for all connections
- ✅ Validate all API responses

### ❌ DON'T:
- ❌ Commit `.env` files to git
- ❌ Share API keys in chat or email
- ❌ Use the same key across environments
- ❌ Log sensitive data
- ❌ Hardcode credentials in code
- ❌ Use HTTP for sensitive operations
- ❌ Ignore API errors silently

## 📊 Environment-Specific Configuration

### Development
```env
VITE_ENV=development
VITE_BUTTERBASE_API_URL=https://api.butterbase.ai
MCP_SCOPE=user
```

### Staging
```env
VITE_ENV=staging
VITE_BUTTERBASE_API_URL=https://staging-api.butterbase.ai
MCP_SCOPE=organization
```

### Production
```env
VITE_ENV=production
VITE_BUTTERBASE_API_URL=https://api.butterbase.ai
MCP_SCOPE=organization
VITE_BUTTERBASE_ENCRYPTION=enabled
```

## 🧪 Testing Butterbase Integration

### Test Payment Processing

```bash
npm test -- --testNamePattern="Butterbase Payment"
```

### Test Authentication

```bash
npm test -- --testNamePattern="Butterbase Auth"
```

### Test Incident Logging

```bash
npm test -- --testNamePattern="Butterbase Incident"
```

## 🔧 Troubleshooting

### Issue: "VITE_BUTTERBASE_API_KEY is not set"

**Solution**: Ensure your `.env` file exists and contains the key:
```bash
cat .env | grep VITE_BUTTERBASE_API_KEY
```

### Issue: "Connection refused to Butterbase API"

**Solution**: 
- Check internet connection
- Verify API URL is correct
- Confirm API key has valid scope
- Check firewall/proxy settings

### Issue: "Invalid API key format"

**Solution**:
- Regenerate key in Butterbase dashboard
- Ensure key starts with `bb_sk_`
- Check for leading/trailing spaces

### Issue: "MCP transport not supported"

**Solution**:
- Ensure transport is set to `http`
- Check Claude version supports MCP
- Verify headers are properly formatted

## 📚 Resources

- [Butterbase Documentation](https://docs.butterbase.ai)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Fathom Project README](./README.md)
- [Environment Configuration](./butterbase.mcp.config.js)

## 🆘 Support

- **Documentation**: https://docs.butterbase.ai
- **Issues**: [GitHub Issues](https://github.com/roopadevihosur-07/Fathom_Supply_Chain_Risk_Navigator/issues)
- **Butterbase Support**: https://butterbase.ai/support

---

**Last Updated**: 2026-07-07
**Status**: ✅ Ready for Integration
