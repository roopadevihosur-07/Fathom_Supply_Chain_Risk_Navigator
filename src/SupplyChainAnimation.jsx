import React from 'react';
import { Factory, Package, Warehouse, ShoppingCart, Truck } from 'lucide-react';

const SupplyChainAnimation = () => {
  return (
    <svg
      viewBox="0 0 800 400"
      width="100%"
      height="100%"
      style={{
        display: 'block',
        filter: 'drop-shadow(0 10px 30px rgba(99, 102, 241, 0.1))',
      }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0D9488" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>

        {/* Animations */}
        <style>{`
          @keyframes flow {
            0% { strokeDashoffset: 0; }
            100% { strokeDashoffset: -50; }
          }
          @keyframes pulse {
            0%, 100% { r: 16; opacity: 0.8; }
            50% { r: 20; opacity: 0.4; }
          }
          @keyframes moveBox1 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(100px, -20px); }
            100% { transform: translate(200px, 0); }
          }
          @keyframes moveBox2 {
            0% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 1; }
            70% { transform: translate(150px, 20px); }
            100% { transform: translate(200px, 0); opacity: 0; }
          }
          @keyframes moveBox3 {
            0% { transform: translate(0, 0); opacity: 0; }
            40% { opacity: 1; }
            90% { transform: translate(200px, -20px); }
            100% { transform: translate(200px, 0); opacity: 0; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .flow-line {
            animation: flow 3s linear infinite;
          }
          .node-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          .box-move-1 {
            animation: moveBox1 4s ease-in-out infinite;
          }
          .box-move-2 {
            animation: moveBox2 4s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          .box-move-3 {
            animation: moveBox3 4s ease-in-out infinite;
            animation-delay: 1s;
          }
          .spinner {
            animation: spin 3s linear infinite;
            transform-origin: center;
          }
        `}</style>
      </defs>

      {/* Background */}
      <rect width="800" height="400" fill="rgba(255, 255, 255, 0.3)" rx="20" />

      {/* Main supply chain flow */}
      {/* Supplier to Component */}
      <path
        d="M 80 200 Q 160 150, 240 200"
        stroke="url(#flowGradient)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="50"
        className="flow-line"
        strokeLinecap="round"
      />

      {/* Component to Assembly */}
      <path
        d="M 240 200 Q 320 250, 400 200"
        stroke="url(#flowGradient)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="50"
        className="flow-line"
        strokeLinecap="round"
        style={{ animationDelay: '0.5s' }}
      />

      {/* Assembly to Distribution */}
      <path
        d="M 400 200 Q 480 150, 560 200"
        stroke="url(#flowGradient)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="50"
        className="flow-line"
        strokeLinecap="round"
        style={{ animationDelay: '1s' }}
      />

      {/* Distribution to Market */}
      <path
        d="M 560 200 Q 640 250, 720 200"
        stroke="url(#flowGradient)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="50"
        className="flow-line"
        strokeLinecap="round"
        style={{ animationDelay: '1.5s' }}
      />

      {/* NODE 1: Supplier */}
      <g>
        <circle cx="80" cy="200" r="18" fill="url(#nodeGradient)" />
        <circle cx="80" cy="200" r="16" className="node-pulse" fill="none" stroke="#6366F1" strokeWidth="2" />
        <text x="80" y="205" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
          ⚙️
        </text>
        <text x="80" y="235" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1F2937">
          Supplier
        </text>
      </g>

      {/* NODE 2: Component */}
      <g>
        <circle cx="240" cy="200" r="18" fill="url(#nodeGradient)" />
        <circle cx="240" cy="200" r="16" className="node-pulse" fill="none" stroke="#6366F1" strokeWidth="2" style={{ animationDelay: '0.3s' }} />
        <text x="240" y="205" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
          📦
        </text>
        <text x="240" y="235" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1F2937">
          Component
        </text>
      </g>

      {/* NODE 3: Assembly */}
      <g>
        <circle cx="400" cy="200" r="18" fill="url(#nodeGradient)" />
        <circle cx="400" cy="200" r="16" className="node-pulse" fill="none" stroke="#6366F1" strokeWidth="2" style={{ animationDelay: '0.6s' }} />
        <text x="400" y="205" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
          🏭
        </text>
        <text x="400" y="235" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1F2937">
          Assembly
        </text>
      </g>

      {/* NODE 4: Distribution */}
      <g>
        <circle cx="560" cy="200" r="18" fill="url(#nodeGradient)" />
        <circle cx="560" cy="200" r="16" className="node-pulse" fill="none" stroke="#6366F1" strokeWidth="2" style={{ animationDelay: '0.9s' }} />
        <text x="560" y="205" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
          🚚
        </text>
        <text x="560" y="235" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1F2937">
          Distribution
        </text>
      </g>

      {/* NODE 5: Market */}
      <g>
        <circle cx="720" cy="200" r="18" fill="url(#nodeGradient)" />
        <circle cx="720" cy="200" r="16" className="node-pulse" fill="none" stroke="#6366F1" strokeWidth="2" style={{ animationDelay: '1.2s' }} />
        <text x="720" y="205" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
          🛒
        </text>
        <text x="720" y="235" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1F2937">
          Market
        </text>
      </g>

      {/* Animated packages flowing */}
      <g className="box-move-1" transform="translate(80, 200)">
        <rect x="-6" y="-6" width="12" height="12" fill="#6366F1" rx="2" />
        <rect x="-4" y="-4" width="8" height="8" fill="#10B981" rx="1" />
      </g>

      <g className="box-move-2" transform="translate(80, 200)">
        <rect x="-6" y="-6" width="12" height="12" fill="#0D9488" rx="2" />
        <rect x="-4" y="-4" width="8" height="8" fill="#6366F1" rx="1" />
      </g>

      <g className="box-move-3" transform="translate(80, 200)">
        <rect x="-6" y="-6" width="12" height="12" fill="#10B981" rx="2" />
        <rect x="-4" y="-4" width="8" height="8" fill="#0D9488" rx="1" />
      </g>

      {/* Upper flow with risk visualization */}
      <path
        d="M 80 100 Q 160 60, 240 100"
        stroke="rgba(220, 38, 38, 0.2)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="40"
        className="flow-line"
        strokeLinecap="round"
        style={{ animationDelay: '2s' }}
      />

      <circle cx="80" cy="100" r="14" fill="rgba(220, 38, 38, 0.15)" stroke="#DC2626" strokeWidth="2" />
      <text x="80" y="105" textAnchor="middle" fontSize="20" fill="#DC2626" fontWeight="bold">
        ⚠️
      </text>
      <text x="80" y="130" textAnchor="middle" fontSize="11" fontWeight="600" fill="#DC2626">
        Risk Monitor
      </text>

      {/* Impact metrics */}
      <g>
        <rect x="320" y="30" width="160" height="50" fill="rgba(99, 102, 241, 0.08)" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" rx="8" />
        <text x="400" y="50" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6366F1">
          Real-time Analysis
        </text>
        <text x="400" y="68" textAnchor="middle" fontSize="11" fill="#6B7280">
          5 seconds to impact
        </text>
      </g>

      {/* Disruption effect (optional pulse) */}
      <circle cx="400" cy="200" r="18" fill="none" stroke="rgba(220, 38, 38, 0.3)" strokeWidth="2" opacity="0">
        <animate attributeName="r" values="18;40" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export default SupplyChainAnimation;
