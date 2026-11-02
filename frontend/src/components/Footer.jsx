import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Heart, Github, Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand">
              <ChefHat size={28} color="#E06B43" />
              <span>RecipeHub.</span>
            </div>
            <p className="footer-desc">
              A vibrant culinary community where passionate home chefs, foodies,
              and culinary explorers discover, preserve, and share delicious recipes
              from every corner of the world.
            </p>
            <div className="footer-badge">
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Cognetix Technology Full Stack Internship
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/recipes" className="footer-link">All Recipes</Link>
              </li>
              <li>
                <Link to="/recipes?category=Indian" className="footer-link">Indian Specialties</Link>
              </li>
              <li>
                <Link to="/recipes?category=Italian" className="footer-link">Italian Classics</Link>
              </li>
              <li>
                <Link to="/recipes?category=Desserts" className="footer-link">Decadent Desserts</Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li>
                <Link to="/recipes?category=Breakfast" className="footer-link">Breakfast</Link>
              </li>
              <li>
                <Link to="/recipes?category=Healthy Food" className="footer-link">Healthy Food</Link>
              </li>
              <li>
                <Link to="/recipes?category=Fast Food" className="footer-link">Fast Food</Link>
              </li>
              <li>
                <Link to="/recipes?category=Chinese" className="footer-link">Chinese</Link>
              </li>
              <li>
                <Link to="/recipes?category=Beverages" className="footer-link">Beverages</Link>
              </li>
            </ul>
          </div>

          {/* Internship Project Meta */}
          <div>
            <h4 className="footer-heading">Project Specs</h4>
            <ul className="footer-links" style={{ fontSize: '0.88rem' }}>
              <li>Task: <strong>Task 5 — Recipe Sharing Platform</strong></li>
              <li>Stack: <strong>React, Vite, Express, MongoDB, Node</strong></li>
              <li>Developer: <strong>Tejaswini-2006</strong></li>
              <li style={{ marginTop: '8px' }}>
                <a
                  href="https://github.com/Tejaswini-2006/Cognetix_RecipeSharingPlatform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Github size={16} />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} RecipeHub. Handcrafted with{' '}
            <Heart size={14} color="#E06B43" fill="#E06B43" style={{ display: 'inline' }} /> for Cognetix Technology Internship.
          </p>
          <p>
            Developed by{' '}
            <a
              href="https://github.com/Tejaswini-2006"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tejaswini-2006
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
