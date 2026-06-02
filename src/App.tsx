import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)',
        color: 'var(--neon-cyan)',
        fontFamily: 'var(--font-display)',
        fontSize: '1.2rem',
        letterSpacing: '3px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-dot" style={{ width: '16px', height: '16px', margin: '0 auto 20px' }} />
          INITIALIZING SYSTEM...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <div className="scanline" />
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            🛡️ NOVA ENFORCE
          </div>
        </div>
        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            📊 Dashboard
          </a>
          <a className="nav-item" href="#">
            👤 Criminal Records
          </a>
          <a className="nav-item" href="#">
            📈 Analytics
          </a>
          <a className="nav-item" href="#">
            📋 Activity Log
          </a>
        </nav>
      </aside>
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
