import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChefHat, PlusCircle, LogOut, Menu, X, BookOpen, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileOpen(false);

  // Get user initial
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <ChefHat size={24} />
          </div>
          <span>
            RecipeHub<span className="brand-dot">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/recipes"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Explore Recipes
              </NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/my-recipes"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    My Recipes
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/recipes/add"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    Add Recipe
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Desktop User Actions */}
        <div className="nav-actions desktop-only">
          {isAuthenticated ? (
            <>
              <Link to="/recipes/add" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                <span>Share Recipe</span>
              </Link>
              <div className="user-badge" title={user?.email}>
                <div className="user-avatar">{initial}</div>
                <span className="user-name">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-logout"
                title="Log out"
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join Community
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <ul className="mobile-links">
            <li>
              <NavLink to="/" className="mobile-link" onClick={closeMenu}>
                <BookOpen size={20} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/recipes" className="mobile-link" onClick={closeMenu}>
                <BookOpen size={20} />
                <span>Explore Recipes</span>
              </NavLink>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/my-recipes"
                    className="mobile-link"
                    onClick={closeMenu}
                  >
                    <User size={20} />
                    <span>My Recipes</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/recipes/add"
                    className="mobile-link"
                    onClick={closeMenu}
                  >
                    <PlusCircle size={20} />
                    <span>Share Recipe</span>
                  </NavLink>
                </li>
              </>
            ) : null}
          </ul>

          <div className="mobile-actions">
            {isAuthenticated ? (
              <>
                <div className="user-badge" style={{ marginBottom: '12px' }}>
                  <div className="user-avatar">{initial}</div>
                  <span className="user-name">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to="/login"
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={closeMenu}
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
