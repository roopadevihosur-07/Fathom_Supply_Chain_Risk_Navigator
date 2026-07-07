import { neo4j } from 'neo4j-driver';

// Environment variables (set these in Butterbase function config):
// NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD

interface CascadeResult {
  cascade: string[];
  revenueAtRisk: number;
  affectedCount: number;
}

export async function handler(event: any): Promise<CascadeResult> {
  const { rootNodeId } = event.body || event;

  if (!rootNodeId) {
    throw new Error('rootNodeId is required');
  }

  const driver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
  );

  try {
    const session = driver.session({
      database: process.env.NEO4J_DATABASE || 'neo4j',
    });

    // Query: Find all nodes reachable from rootNodeId (cascade)
    const result = await session.run(
      `
      MATCH path = (root {id: $rootNodeId})-[*]->(affected)
      WITH DISTINCT affected.id as nodeId
      RETURN COLLECT(nodeId) as cascade
      `,
      { rootNodeId }
    );

    const cascade = result.records[0]?.get('cascade') || [rootNodeId];

    // Calculate revenue at risk
    // Assume retail nodes (na_retail, eu_retail) have $2.8M and $1.4M weekly revenue
    const revenueMap: Record<string, number> = {
      na_retail: 2800000,
      eu_retail: 1400000,
    };

    const revenueAtRisk = cascade.reduce((total, nodeId) => {
      return total + (revenueMap[nodeId] || 0);
    }, 0);

    await session.close();

    return {
      cascade: [rootNodeId, ...cascade.filter((id: string) => id !== rootNodeId)],
      revenueAtRisk,
      affectedCount: cascade.length,
    };
  } catch (error) {
    console.error('Neo4j cascade error:', error);
    throw error;
  } finally {
    await driver.close();
  }
}

/*
DEPLOYMENT INSTRUCTIONS:

1. Create the deployment JSON file (functions/neo4j-cascade-deploy.json):

{
  "name": "neo4j-cascade",
  "description": "Query Neo4j for supply chain cascade analysis",
  "runtime": "typescript",
  "code": "... (this file's code as a string) ...",
  "envVars": {
    "NEO4J_URI": "neo4j+s://your-aura.databases.neo4j.io",
    "NEO4J_USER": "neo4j",
    "NEO4J_PASSWORD": "your-password",
    "NEO4J_DATABASE": "neo4j"
  }
}

2. Deploy with:

curl -X POST https://api.butterbase.ai/v1/{app_id}/functions \
  -H "Authorization: Bearer {platform_token}" \
  -H "Content-Type: application/json" \
  -d @functions/neo4j-cascade-deploy.json

3. Call it from frontend:

const res = await fetch(
  `https://api.butterbase.ai/v1/{app_id}/fn/neo4j-cascade`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rootNodeId: "hsinchu" }),
  }
);
*/
