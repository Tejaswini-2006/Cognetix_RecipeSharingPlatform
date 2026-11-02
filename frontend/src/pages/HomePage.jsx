import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import * as recipeService from '../services/recipeService';
import './HomePage.css';

const CATEGORIES_DATA = [
  { name: 'Indian', icon: '🍛', color: '#FFF2EB' },
  { name: 'Italian', icon: '🍕', color: '#EBF4F0' },
  { name: 'Chinese', icon: '🥢', color: '#FFF8E6' },
  { name: 'Desserts', icon: '🍰', color: '#FDF0F3' },
  { name: 'Breakfast', icon: '🥞', color: '#FFF6E9' },
  { name: 'Fast Food', icon: '🍔', color: '#F0F7FF' },
  { name: 'Healthy Food', icon: '🥗', color: '#EAF7EE' },
  { name: 'Beverages', icon: '🍹', color: '#FDF2F8' }
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentRecipes = async () => {
      try {
        const res = await recipeService.getRecipes({ limit: 6, sort: 'newest' });
        if (res.success && res.data) {
          setRecipes(res.data);
        }
      } catch (err) {
        console.error('Failed to load recent recipes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRecipes();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/recipes');
    }
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <div className="hero-tag">
                <Sparkles size={16} />
                <span>Culinary Community & Recipe Sharing</span>
              </div>

              <h1 className="hero-title">
                Cook, Share & Discover <br />
                <span className="highlight">Authentic Flavors</span> From Heart
                to Table.
              </h1>

              <p className="hero-subtitle">
                Join our vibrant community of home chefs, food lovers, and culinary
                creators. Discover thousands of tested recipes with step-by-step
                instructions, or share your family favorites today.
              </p>

              {/* Quick Search */}
              <form onSubmit={handleSearchSubmit} className="hero-search-form">
                <Search size={22} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients (e.g. Butter Chicken, Pizza)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="hero-search-input"
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Find Recipe
                </button>
              </form>

              {/* Stats */}
              <div className="hero-stats">
                <div className="stat-item">
                  <h4>500+</h4>
                  <p>Handcrafted Recipes</p>
                </div>
                <div className="stat-item">
                  <h4>8</h4>
                  <p>Global Cuisines</p>
                </div>
                <div className="stat-item">
                  <h4>100%</h4>
                  <p>Free Community</p>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="hero-visual">
              <div className="hero-main-card">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                  alt="Delicious food creation"
                  className="hero-main-img"
                />
              </div>

              {/* Floating Chef Badge */}
              <div className="hero-float-badge">
                <div className="float-badge-icon">
                  <ChefHat size={24} />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
                    Chef Curated
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Tested by authentic foodies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Explore Popular Categories</h2>
              <p className="section-subtitle">
                Whatever you are craving today, we have got you covered.
              </p>
            </div>
            <Link to="/recipes" className="btn btn-outline btn-sm">
              View All Categories <ArrowRight size={15} />
            </Link>
          </div>

          <div className="categories-grid">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.name}
                to={`/recipes?category=${encodeURIComponent(cat.name)}`}
                className="category-chip"
                style={{ backgroundColor: cat.color }}
              >
                <span className="category-chip-icon">{cat.icon}</span>
                <span className="category-chip-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured / Recently Added Recipes */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Flame size={20} color="var(--accent-orange)" />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-orange)', textTransform: 'uppercase' }}>
                  Fresh From The Kitchen
                </span>
              </div>
              <h2 className="section-title">Featured & Trending Recipes</h2>
              <p className="section-subtitle">
                Top rated recipes shared by our passionate cooking community.
              </p>
            </div>
            <Link to="/recipes" className="btn btn-secondary btn-sm">
              Browse All Recipes <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Gathering fresh recipes..." />
          ) : recipes.length > 0 ? (
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No recipes found yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Community Perks & Features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <h2 className="section-title">Why Cook With RecipeHub?</h2>
            <p className="section-subtitle">
              Designed by food enthusiasts to elevate your daily home cooking experience.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px'
                }}
              >
                <UtensilsCrossed size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                Step-by-Step Cooking
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
                Clear, structured instructions with ingredient checklists so you never
                miss a beat or burn a sauce.
              </p>
            </div>

            <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--accent-peach)',
                  color: 'var(--accent-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px'
                }}
              >
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                Authentic Community
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
                Real family secrets and culinary traditions from certified chefs
                and passionate home cooks across the globe.
              </p>
            </div>

            <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#FFF6E9',
                  color: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px'
                }}
              >
                <ChefHat size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                Publish Your Masterpiece
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
                Upload high-res food photos, specify prep & cook times, and manage
                your personal digital recipe book with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="container">
        <div className="cta-banner">
          <div>
            <h2>Have a Delicious Recipe of Your Own?</h2>
            <p>
              Don't keep the flavor secret! Share your cherished family recipes, quick
              weeknight dinners, or exotic desserts with our thriving community.
            </p>
            <Link to="/recipes/add" className="btn btn-primary btn-lg">
              Share Your Recipe Now <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
              alt="Cooking pan"
              style={{
                borderRadius: '20px',
                maxHeight: '260px',
                width: '100%',
                objectFit: 'cover',
                border: '3px solid rgba(255, 255, 255, 0.2)'
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
