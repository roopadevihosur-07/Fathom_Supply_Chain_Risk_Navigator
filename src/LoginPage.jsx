import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, TrendingUp, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import SupplyChainAnimation from './SupplyChainAnimation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (login(email, password)) {
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid email or password');
    }
  };

  const demoAccounts = [
    { email: 'admin@fathom.com', password: 'Fathom@2026!', role: 'Admin', desc: 'Full platform access' },
    { email: 'manager@fathom.com', password: 'Fathom@2026!', role: 'Manager', desc: 'Analysis & insights' },
    { email: 'user@fathom.com', password: 'Fathom@2026!', role: 'User', desc: 'Report concerns' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Detection',
      desc: 'Instantly identify supply chain disruptions before they cascade'
    },
    {
      icon: TrendingUp,
      title: 'Impact Quantification',
      desc: 'Calculate revenue exposure across your global network'
    },
    {
      icon: Shield,
      title: 'Smart Mitigation',
      desc: 'Get AI-ranked solutions ranked by cost and effectiveness'
    },
  ];

  const benefits = [
    { icon: CheckCircle2, text: 'Graph-powered dependency analysis' },
    { icon: CheckCircle2, text: 'Multi-role collaboration platform' },
    { icon: CheckCircle2, text: 'Real-time risk quantification' },
    { icon: CheckCircle2, text: 'Automated decision support' },
  ];

  const quickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setTimeout(() => {
      if (login(demoEmail, demoPassword)) {
        setEmail('');
        setPassword('');
      }
    }, 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F5F7FF 0%, #EFEAFF 100%)',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.12,
        pointerEvents: 'none',
      }}>
        <SupplyChainAnimation />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          padding: '24px 40px',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #0D9488, #6366F1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
            }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: 'white' }}>F</span>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#1F2937', margin: 0 }}>
                Fathom
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', margin: 0, letterSpacing: '0.06em', fontWeight: 600 }}>
                SUPPLY CHAIN RISK NAVIGATOR
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 40px',
        }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '60px', textAlign: 'center' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#6366F1',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              display: 'inline-block',
              background: 'rgba(99, 102, 241, 0.08)',
              padding: '8px 16px',
              borderRadius: '999px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
              ✨ Fathom
            </div>
            <h1 style={{
              fontSize: '52px',
              fontWeight: 900,
              color: '#1F2937',
              margin: '0 0 16px 0',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
            }}>
              See Supply Chain Failures
              <br />
              Before They Happen
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#6B7280',
              margin: '0 0 8px 0',
              lineHeight: '1.6',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Real-time disruption detection with graph-powered cascade analysis. Quantify risk instantly and execute smarter mitigation strategies across your entire global network.
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '60px',
            alignItems: 'stretch',
          }}>
            {/* Left Column - Info Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Problem Statement Block */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.1)',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#DC2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  ⚠️ THE PROBLEM
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#1F2937',
                  margin: '0 0 12px 0',
                }}>
                  Disruptions cascade unpredictably
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#374151',
                  margin: 0,
                  lineHeight: '1.6',
                  fontWeight: 500,
                }}>
                  Supply chain failures cost billions while teams scramble to understand impact, yet manual analysis takes days—your business can't wait.
                </p>
              </div>

              {/* Solution Block */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(13, 148, 136, 0.08))',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.08)',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#6366F1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  ✨ THE SOLUTION
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#1F2937',
                  margin: '0 0 12px 0',
                }}>
                  Fathom gives you answers in seconds
                </h3>
                <ul style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                }}>
                  {benefits.map((benefit, i) => (
                    <li key={i} style={{
                      fontSize: '14px',
                      color: '#374151',
                      margin: '0 0 10px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 500,
                    }}>
                      <benefit.icon size={18} color="#10B981" strokeWidth={3} />
                      {benefit.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features Block */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.1)',
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#1F2937',
                  margin: '0 0 20px 0',
                }}>
                  Core Capabilities
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {features.map((feature, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px 0',
                      borderBottom: i < features.length - 1 ? '1px solid rgba(99, 102, 241, 0.1)' : 'none',
                    }}>
                      <feature.icon size={20} color="#6366F1" strokeWidth={1.5} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937', marginBottom: '4px' }}>
                          {feature.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>
                          {feature.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)',
                position: 'sticky',
                top: '100px',
              }}>
                {/* Form Header */}
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    fontSize: '26px',
                    fontWeight: 900,
                    color: '#1F2937',
                    margin: '0 0 8px 0',
                    letterSpacing: '-0.01em',
                  }}>
                    Welcome Back
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    margin: 0,
                  }}>
                    Sign in to your supply chain dashboard
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#DC2626',
                    fontSize: '13px',
                  }}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#1F2937',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      Email Address
                    </label>
                    <div style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Mail size={18} style={{
                        position: 'absolute',
                        left: '12px',
                        color: '#9CA3AF',
                        pointerEvents: 'none',
                      }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 40px',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          color: '#1F2937',
                          transition: 'all 0.2s ease',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                          e.target.style.background = 'rgba(255, 255, 255, 1)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#1F2937',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      Password
                    </label>
                    <div style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Lock size={18} style={{
                        position: 'absolute',
                        left: '12px',
                        color: '#9CA3AF',
                        pointerEvents: 'none',
                      }} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 40px',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          color: '#1F2937',
                          transition: 'all 0.2s ease',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                          e.target.style.background = 'rgba(255, 255, 255, 1)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      background: 'linear-gradient(135deg, #6366F1, #0D9488)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      letterSpacing: '0.02em',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>SIGN IN</span>
                    <ArrowRight size={16} />
                  </button>
                </form>

                {/* Demo Accounts Section */}
                <div style={{
                  borderTop: '1px solid rgba(99, 102, 241, 0.1)',
                  paddingTop: '20px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#6366F1',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '12px',
                  }}>
                    📋 Demo Accounts (Judges)
                  </div>
                  <button
                    onClick={() => setShowDemo(!showDemo)}
                    style={{
                      width: '100%',
                      background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      color: '#6366F1',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      transition: 'all 0.2s ease',
                      borderRadius: '10px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(99, 102, 241, 0.15)';
                      e.target.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(99, 102, 241, 0.08)';
                      e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                    }}
                  >
                    {showDemo ? '← Hide Demo Accounts' : '→ Click to View Demo Accounts'}
                  </button>

                  {showDemo && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      animation: 'slideIn 0.3s ease',
                    }}>
                      {demoAccounts.map((account) => (
                        <button
                          key={account.email}
                          onClick={() => quickLogin(account.email, account.password)}
                          style={{
                            background: 'rgba(99, 102, 241, 0.06)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'left',
                            fontSize: '13px',
                            color: '#1F2937',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
                            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
                            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: '3px', color: '#6366F1' }}>
                            {account.role}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            {account.email}
                          </div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                            {account.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginTop: '40px',
          }}>
            {[
              { number: '9', label: 'Global Nodes' },
              { number: '$3.5M', label: 'Revenue Protection' },
              { number: '5s', label: 'Analysis Speed' },
              { number: '3', label: 'User Roles' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.08)',
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#6366F1',
                  marginBottom: '6px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: 600,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
