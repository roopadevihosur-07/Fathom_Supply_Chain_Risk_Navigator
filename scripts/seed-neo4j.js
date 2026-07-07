import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

dotenv.config();

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const NEO4J_DATABASE = process.env.NEO4J_DATABASE;

if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.error('❌ Error: Missing Neo4j credentials in .env');
  process.exit(1);
}

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

async function seedNeo4j() {
  const session = driver.session({ database: NEO4J_DATABASE });

  try {
    console.log('🌱 Seeding Neo4j with supply chain graph...\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');

    // Create nodes
    console.log('📦 Creating supply chain nodes...\n');

    const nodes = [
      { id: 'hsinchu', label: 'Hsinchu Semiconductor Co.', type: 'supplier', region: 'ASIA-PACIFIC' },
      { id: 'kaohsiung', label: 'Kaohsiung Chip Packaging', type: 'component', region: 'ASIA-PACIFIC' },
      { id: 'shenzhen', label: 'Shenzhen Circuit Assembly', type: 'component', region: 'ASIA-PACIFIC' },
      { id: 'austin', label: 'Austin Device Plant', type: 'plant', region: 'NORTH AMERICA' },
      { id: 'guadalajara', label: 'Guadalajara Assembly', type: 'plant', region: 'NORTH AMERICA' },
      { id: 'memphis', label: 'Memphis Distribution Center', type: 'warehouse', region: 'NORTH AMERICA' },
      { id: 'rotterdam', label: 'Rotterdam Distribution Hub', type: 'warehouse', region: 'EUROPE' },
      { id: 'na_retail', label: 'North America Retail Network', type: 'market', region: 'NORTH AMERICA' },
      { id: 'eu_retail', label: 'EU Retail Network', type: 'market', region: 'EUROPE' },
    ];

    for (const node of nodes) {
      await session.run(
        `CREATE (n:${node.type} {id: $id, label: $label, region: $region})`,
        node
      );
      console.log(`  ✓ Created ${node.label}`);
    }

    // Create relationships (edges)
    console.log('\n🔗 Creating supply chain relationships...\n');

    const edges = [
      ['hsinchu', 'kaohsiung'],
      ['hsinchu', 'shenzhen'],
      ['kaohsiung', 'austin'],
      ['shenzhen', 'austin'],
      ['shenzhen', 'guadalajara'],
      ['austin', 'memphis'],
      ['guadalajara', 'rotterdam'],
      ['memphis', 'na_retail'],
      ['rotterdam', 'eu_retail'],
    ];

    for (const [fromId, toId] of edges) {
      await session.run(
        `MATCH (from {id: $fromId}), (to {id: $toId})
         CREATE (from)-[:SUPPLIES]->(to)`,
        { fromId, toId }
      );
      console.log(`  ✓ ${fromId} → ${toId}`);
    }

    console.log('\n✅ Neo4j seeding complete!');
    console.log('\n📊 Graph Summary:');
    console.log('  • 9 supply chain nodes');
    console.log('  • 9 supply relationships');
    console.log('  • Ready for cascade queries');

  } catch (error) {
    console.error('❌ Error seeding Neo4j:', error);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedNeo4j();
