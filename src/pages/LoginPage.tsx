import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Eye, EyeOff, Lock, User, AlertTriangle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      backgroundImage: `
        linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px',
      padding: '20px',
    }}>
      {/* Scanline effect */}
      <div className="scanline" />

      <div style={{
        width: '100%',
        maxWidth: '440px',
      }}>
        {/* Logo Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <ShieldAlert size={36} style={{ 
              color: 'var(--neon-cyan)', 
              filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.6))' 
            }} />
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              color: 'var(--neon-cyan)',
              textShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              letterSpacing: '3px',
              margin: 0,
            }}>
              NOVA ENFORCE
            </h1>
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Crime Record Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel" style={{
          padding: '36px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--text-main)',
            textAlign: 'center',
            marginBottom: '28px',
            letterSpacing: '2px',
          }}>
            SECURE ACCESS
          </h2>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'var(--neon-red-dim)',
              border: '1px solid var(--neon-red)',
              borderRadius: '4px',
              marginBottom: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--neon-red)',
            }}>
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(12, 16, 26, 0.7)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--neon-cyan)';
                    e.target.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 40px',
                    background: 'rgba(12, 16, 26, 0.7)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--neon-cyan)';
                    e.target.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading ? 'rgba(0, 240, 255, 0.5)' : 'var(--neon-cyan)',
                border: 'none',
                borderRadius: '4px',
                color: 'var(--bg-dark)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: isLoading ? 'none' : '0 0 20px rgba(0, 240, 255, 0.3)',
              }}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}>
            <p>Default Admin: admin / admin123</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          opacity: 0.6,
        }}>
          NOVA ENFORCE CRMS v2.0 • Secure System
        </div>
      </div>
    </div>
  );
};
