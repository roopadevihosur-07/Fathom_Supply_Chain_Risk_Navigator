import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Supply chain network nodes with geographic coordinates
const GEOGRAPHIC_NODES = [
  {
    id: 'hsinchu',
    label: 'Hsinchu Semiconductor Co.',
    type: 'supplier',
    region: 'ASIA-PACIFIC',
    lat: 24.8145,
    lng: 120.9675,
    tier: 'Tier 2 Supplier',
    country: 'Taiwan',
  },
  {
    id: 'kaohsiung',
    label: 'Kaohsiung Chip Packaging',
    type: 'component',
    region: 'ASIA-PACIFIC',
    lat: 22.6163,
    lng: 120.2725,
    tier: 'Tier 1 Supplier',
    country: 'Taiwan',
  },
  {
    id: 'shenzhen',
    label: 'Shenzhen Circuit Assembly',
    type: 'component',
    region: 'ASIA-PACIFIC',
    lat: 22.5431,
    lng: 114.0579,
    tier: 'Tier 1 Supplier',
    country: 'China',
  },
  {
    id: 'austin',
    label: 'Austin Device Plant',
    type: 'plant',
    region: 'NORTH AMERICA',
    lat: 30.2672,
    lng: -97.7431,
    tier: 'Assembly',
    country: 'USA',
  },
  {
    id: 'guadalajara',
    label: 'Guadalajara Assembly',
    type: 'plant',
    region: 'NORTH AMERICA',
    lat: 20.6596,
    lng: -103.2987,
    tier: 'Assembly',
    country: 'Mexico',
  },
  {
    id: 'memphis',
    label: 'Memphis Distribution Center',
    type: 'warehouse',
    region: 'NORTH AMERICA',
    lat: 35.1495,
    lng: -90.0490,
    tier: 'Warehouse',
    country: 'USA',
  },
  {
    id: 'rotterdam',
    label: 'Rotterdam Distribution Hub',
    type: 'warehouse',
    region: 'EUROPE',
    lat: 51.9289,
    lng: 4.2683,
    tier: 'Warehouse',
    country: 'Netherlands',
  },
  {
    id: 'na_retail',
    label: 'North America Retail Network',
    type: 'market',
    region: 'NORTH AMERICA',
    lat: 39.8283,
    lng: -98.5795,
    tier: 'Market',
    country: 'USA',
  },
  {
    id: 'eu_retail',
    label: 'EU Retail Network',
    type: 'market',
    region: 'EUROPE',
    lat: 54.5260,
    lng: 15.2551,
    tier: 'Market',
    country: 'Europe',
  },
];

const GEOGRAPHIC_EDGES = [
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

const NODE_ICONS = {
  supplier: '🏭',
  component: '📦',
  plant: '🏢',
  warehouse: '📍',
  market: '🛍️',
};

const getNodeColor = (state) => {
  if (state === 'affected') return '#DC2626';
  if (state === 'resolved') return '#10B981';
  return '#0D9488';
};

const GeographicMap = ({ phase = 'calm', affectedNodes = [] }) => {
  const nodeState = (nodeId) => {
    if (phase === 'calm') return 'calm';
    if (phase === 'resolved') return 'resolved';
    return affectedNodes.includes(nodeId) ? 'affected' : 'calm';
  };

  const getMarkerIcon = (nodeType, state) => {
    const color = getNodeColor(state);
    return L.divIcon({
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: white;
          border: 3px solid ${color};
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          cursor: pointer;
          font-size: 18px;
        ">
          ${NODE_ICONS[nodeType] || '📍'}
        </div>
      `,
      iconSize: [40, 40],
      popupAnchor: [0, -20],
    });
  };

  const connectionLines = GEOGRAPHIC_EDGES.map(([from, to], idx) => {
    const fromNode = GEOGRAPHIC_NODES.find((n) => n.id === from);
    const toNode = GEOGRAPHIC_NODES.find((n) => n.id === to);
    const isAffected = phase !== 'calm' && affectedNodes.includes(from) && affectedNodes.includes(to);

    return (
      <Polyline
        key={idx}
        positions={[[fromNode.lat, fromNode.lng], [toNode.lat, toNode.lng]]}
        color={phase === 'resolved' ? '#10B981' : isAffected ? '#DC2626' : 'rgba(99, 102, 241, 0.4)'}
        weight={isAffected ? 3 : 2}
        opacity={isAffected ? 0.8 : 0.5}
        dashArray={isAffected ? '5, 5' : 'none'}
      />
    );
  });

  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={[30, 0]}
        zoom={3}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Connection Lines */}
        {connectionLines}

        {/* Markers */}
        {GEOGRAPHIC_NODES.map((node) => {
          const state = nodeState(node.id);
          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={getMarkerIcon(node.type, state)}
            >
              <Popup>
                <div style={{ minWidth: '200px', fontFamily: 'Inter, sans-serif' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#1F2937' }}>
                    {node.label}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                    <div><strong>Type:</strong> {node.tier}</div>
                    <div><strong>Region:</strong> {node.region}</div>
                    <div><strong>Country:</strong> {node.country}</div>
                    <div><strong>Status:</strong> {state === 'affected' ? '⚠️ Affected' : state === 'resolved' ? '✅ Resolved' : '✓ Healthy'}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    Coordinates: {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default GeographicMap;
