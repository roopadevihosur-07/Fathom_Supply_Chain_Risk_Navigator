import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const APP_ID = process.env.VITE_BUTTERBASE_APP_ID;
const API_KEY = process.env.VITE_BUTTERBASE_API_KEY;

if (!APP_ID || !API_KEY) {
  console.error('❌ Error: Missing Butterbase credentials in .env');
  process.exit(1);
}

async function deployFunction() {
  try {
    console.log('🚀 Deploying Neo4j cascade function to Butterbase...\n');
    console.log(`App ID: ${APP_ID}`);

    // Read the deployment JSON
    const deploymentJson = JSON.parse(
      fs.readFileSync('./functions/neo4j-cascade-deploy.json', 'utf-8')
    );

    console.log('📝 Function config:');
    console.log(`  • Name: ${deploymentJson.name}`);
    console.log(`  • Runtime: ${deploymentJson.runtime}`);
    console.log(`  • Environment vars: ${Object.keys(deploymentJson.envVars).join(', ')}`);

    const response = await fetch(
      `https://api.butterbase.ai/v1/${APP_ID}/functions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(deploymentJson),
      }
    );

    console.log('\n📊 Response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Deployment failed:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('\n✅ Function deployed successfully!');
    console.log('\n🔌 Function Details:');
    console.log(`  • Name: ${data.name || deploymentJson.name}`);
    console.log(`  • Status: ${data.status || 'active'}`);
    console.log(`  • Endpoint: https://api.butterbase.ai/v1/${APP_ID}/fn/neo4j-cascade`);

    console.log('\n📝 To call this function from the frontend:');
    console.log(`
const res = await fetch(
  'https://api.butterbase.ai/v1/${APP_ID}/fn/neo4j-cascade',
  {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${session.access_token}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rootNodeId: 'hsinchu' }),
  }
);
const { cascade, revenueAtRisk } = await res.json();
    `);

    console.log('\n🎉 Neo4j integration complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deployFunction();
