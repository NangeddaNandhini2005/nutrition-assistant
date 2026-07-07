import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🥗</span>
          <span className="brand-text">NutriTrack</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Dashboard</Link>
          <Link to="/log-meal" className={isActive('/log-meal')}>Log Meal</Link>
          <Link to="/track" className={isActive('/track')}>Track</Link>
          <Link to="/recommendations" className={isActive('/recommendations')}>Recommendations</Link>
        </div>
        <div className="nav-user">
          <span className="user-name">{user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
