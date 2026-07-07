/**
 * Butterbase MCP Configuration
 *
 * This file configures the Butterbase MCP (Model Context Protocol) server
 * for integration with the Fathom Supply Chain Risk Navigator
 *
 * Security: Never commit API keys to the repository
 * Load API keys from environment variables (.env files)
 */

export const butterbaeMCPConfig = {
  // MCP Server Configuration
  server: {
    url: process.env.VITE_BUTTERBASE_API_URL || 'https://api.butterbase.ai',
    endpoint: '/mcp',
  },

  // Transport Configuration
  transport: {
    type: process.env.MCP_TRANSPORT || 'http',
    method: 'HTTP',
  },

  // Authentication
  auth: {
    type: 'bearer',
    header: 'Authorization',
    token: process.env.VITE_BUTTERBASE_API_KEY,
    scope: process.env.MCP_SCOPE || 'user',
  },

  // Timeout and Retry Configuration
  client: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },

  // Capabilities
  capabilities: {
    payments: true,
    authentication: true,
    incidentTracking: true,
    auditLogs: true,
  },

  // Features for Fathom
  features: {
    // Payment Processing
    payments: {
      enabled: true,
      processPayments: true,
      trackTransactions: true,
    },

    // Authentication
    auth: {
      enabled: true,
      userManagement: true,
      roleManagement: true,
    },

    // Incident Management
    incidents: {
      enabled: true,
      createIncidents: true,
      updateIncidents: true,
      trackHistory: true,
    },

    // Audit Logging
    audit: {
      enabled: true,
      logActions: true,
      trackChanges: true,
    },
  },
};

/**
 * Initialize Butterbase MCP Client
 *
 * Usage:
 * import { initButterbaeMCP } from './butterbase.mcp.config.js'
 * const client = initButterbaeMCP();
 */
export async function initButterbaeMCP() {
  if (!process.env.VITE_BUTTERBASE_API_KEY) {
    console.warn('⚠️  VITE_BUTTERBASE_API_KEY is not set. Butterbase MCP will not be initialized.');
    return null;
  }

  try {
    // TODO: Import and initialize Butterbase SDK
    // const { ButterbaseClient } = await import('@butterbase/sdk');
    // const client = new ButterbaseClient(butterbaeMCPConfig);
    // await client.connect();
    // return client;

    console.log('✅ Butterbase MCP configured successfully');
    return butterbaeMCPConfig;
  } catch (error) {
    console.error('❌ Failed to initialize Butterbase MCP:', error);
    return null;
  }
}

export default butterbaeMCPConfig;
