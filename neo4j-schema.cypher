// ============================================================
// FATHOM — Neo4j Schema, Seed Data, and Core Queries
// Run against Neo4j Aura (free tier) or local instance.
// ============================================================

// --- Constraints -----------------------------------------------------
CREATE CONSTRAINT node_id IF NOT EXISTS FOR (n:Node) REQUIRE n.id IS UNIQUE;

// --- Seed nodes --------------------------------------------------------
// type: supplier | component | plant | warehouse | market
MERGE (a:Node {id:'hsinchu'})     SET a.label='Hsinchu Semiconductor Co.',   a.type='supplier',  a.region='ASIA-PACIFIC',  a.tier='Tier 2 Supplier'
MERGE (b:Node {id:'kaohsiung'})   SET b.label='Kaohsiung Chip Packaging',    b.type='component',  b.region='ASIA-PACIFIC',  b.tier='Tier 1 Supplier'
MERGE (c:Node {id:'shenzhen'})    SET c.label='Shenzhen Circuit Assembly',   c.type='component',  c.region='ASIA-PACIFIC',  c.tier='Tier 1 Supplier'
MERGE (d:Node {id:'austin'})      SET d.label='Austin Device Plant',         d.type='plant',       d.region='NORTH AMERICA', d.tier='Assembly'
MERGE (e:Node {id:'guadalajara'}) SET e.label='Guadalajara Assembly',        e.type='plant',       e.region='NORTH AMERICA', e.tier='Assembly'
MERGE (f:Node {id:'memphis'})     SET f.label='Memphis Distribution Center', f.type='warehouse',   f.region='NORTH AMERICA', f.tier='Warehouse'
MERGE (g:Node {id:'rotterdam'})   SET g.label='Rotterdam Distribution Hub',  g.type='warehouse',   g.region='EUROPE',        g.tier='Warehouse'
MERGE (h:Node {id:'na_retail'})   SET h.label='North America Retail Network',h.type='market',       h.region='NORTH AMERICA', h.weeklyRevenue=2800000
MERGE (i:Node {id:'eu_retail'})   SET i.label='EU Retail Network',           i.type='market',       i.region='EUROPE',        i.weeklyRevenue=1400000;

// --- Seed relationships (A SUPPLIES B means B depends on A) -----------
MATCH (a:Node {id:'hsinchu'}), (b:Node {id:'kaohsiung'})   MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'hsinchu'}), (b:Node {id:'shenzhen'})    MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'kaohsiung'}), (b:Node {id:'austin'})    MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'shenzhen'}), (b:Node {id:'austin'})     MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'shenzhen'}), (b:Node {id:'guadalajara'})MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'austin'}), (b:Node {id:'memphis'})      MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'guadalajara'}), (b:Node {id:'rotterdam'})MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'memphis'}), (b:Node {id:'na_retail'})   MERGE (a)-[:SUPPLIES]->(b);
MATCH (a:Node {id:'rotterdam'}), (b:Node {id:'eu_retail'}) MERGE (a)-[:SUPPLIES]->(b);

// ============================================================
// CORE QUERIES — called by the RocketRide pipeline
// ============================================================

// 1) Cascade / blast-radius trace from a disrupted node
//    Used on: Disruption Response page
MATCH path = (root:Node {id: $rootId})-[:SUPPLIES*1..5]->(downstream:Node)
RETURN downstream.id AS id, downstream.label AS label, downstream.type AS type,
       length(path) AS hops
ORDER BY hops ASC;

// 2) Revenue at risk — sum weekly revenue of affected market nodes
MATCH (root:Node {id: $rootId})-[:SUPPLIES*1..5]->(m:Node {type:'market'})
RETURN sum(m.weeklyRevenue) AS weeklyRevenueAtRisk;

// 3) Betweenness centrality — proactive "single point of failure" ranking
//    Requires Graph Data Science library (available on Aura free tier)
CALL gds.graph.project('supplyGraph', 'Node', 'SUPPLIES');
CALL gds.betweenness.stream('supplyGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).label AS supplier, score
ORDER BY score DESC
LIMIT 5;

// 4) Alternate supplier lookup — for mitigation ranking
//    Assumes a separate (:Node)-[:BACKUP_FOR]->(:Node) relationship
//    seeded for known secondary suppliers.
MATCH (backup:Node)-[:BACKUP_FOR]->(primary:Node {id: $rootId})
RETURN backup.label AS alternateSupplier, backup.leadTimeDays AS leadTime;
