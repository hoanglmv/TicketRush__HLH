import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">⚡ TicketRush</Link>
        <ul className="navbar-nav">
          <li><Link to="/events">Events</Link></li>
          {isAuthenticated && !isAdmin && <li><Link to="/tickets">My Tickets</Link></li>}
          {isAdmin && <li><Link to="/admin">Dashboard</Link></li>}
          {isAdmin && <li><Link to="/admin/events">Manage Events</Link></li>}
        </ul>
        <div className="navbar-user">
          {isAuthenticated ? (
            <>
              <div className="navbar-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {user?.fullName || user?.username}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
