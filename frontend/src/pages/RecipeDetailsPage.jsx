import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Flame,
  Users,
  Timer,
  Calendar,
  Check,
  Edit3,
  Trash2,
  ArrowLeft,
  Share2,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import DeleteModal from '../components/DeleteModal';
import RecipeCard from '../components/RecipeCard';
import * as recipeService from '../services/recipeService';
import { getImageUrl } from '../services/api';
import './RecipeDetailsPage.css';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interactive Checklist state for ingredients & steps
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      setCheckedIngredients({});
      try {
        const res = await recipeService.getRecipeById(id);
        if (res.success && res.data) {
          setRecipe(res.data);

          // Fetch related recipes from same category
          try {
            const relatedRes = await recipeService.getRecipes({
              category: res.data.category,
              limit: 3
            });
            if (relatedRes.success && relatedRes.data) {
              setRelatedRecipes(
                relatedRes.data.filter((r) => r._id !== res.data._id).slice(0, 3)
              );
            }
          } catch (relErr) {
            console.error('Failed to fetch related recipes', relErr);
          }
        } else {
          setError('Recipe not found.');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Recipe could not be found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Toggle ingredient checklist
  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Check if current logged-in user is the author
  const isOwner =
    isAuthenticated &&
    user &&
    recipe &&
    recipe.author &&
    (user.id === recipe.author._id ||
      user._id === recipe.author._id ||
      user.id === recipe.author ||
      user._id === recipe.author);

  // Handle recipe deletion
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const res = await recipeService.deleteRecipe(id);
      if (res.success) {
        setShowDeleteModal(false);
        navigate('/my-recipes');
      }
    } catch (err) {
      console.error('Failed to delete recipe', err);
      alert(err.response?.data?.message || 'Failed to delete recipe.');
      setIsDeleting(false);
    }
  };

  // Share recipe link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return <LoadingSpinner message="Preparing recipe details..." />;
  }

  if (error || !recipe) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <AlertMessage type="error" message={error || 'Recipe not found'} />
        <Link to="/recipes" className="btn btn-primary" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to All Recipes
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    image,
    prepTime = 15,
    cookTime = 30,
    servings = 4,
    ingredients = [],
    steps = [],
    author,
    createdAt,
    updatedAt
  } = recipe;

  const totalTime = Number(prepTime) + Number(cookTime);
  const authorName = author?.name || 'RecipeHub Chef';
  const authorInitial = authorName.charAt(0).toUpperCase();

  const formattedCreated = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedUpdated = new Date(updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Top back navigation & Owner Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 0 10px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <Link to="/recipes" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} /> Back to Recipes
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleShare}
            title="Copy recipe URL"
          >
            <Share2 size={16} />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          {isOwner && (
            <>
              <Link to={`/recipes/edit/${recipe._id}`} className="btn btn-secondary btn-sm">
                <Edit3 size={16} />
                <span>Edit Recipe</span>
              </Link>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Showcase */}
      <section className="details-hero">
        <div className="details-media-box">
          <img
            src={getImageUrl(image)}
            alt={title}
            className="details-img"
            onError={(e) => {
              e.target.src = getImageUrl('/uploads/default-recipe.svg');
            }}
          />
        </div>

        <div>
          <div className="details-meta-header">
            <span className="badge badge-category" style={{ fontSize: '0.9rem' }}>
              {category}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}
            >
              <Calendar size={15} /> Published on {formattedCreated}
            </span>
          </div>

          <h1 className="details-title">{title}</h1>
          <p className="details-desc">{description}</p>

          {/* Quick Stats Grid */}
          <div className="quick-stats-bar">
            <div className="stat-box">
              <span className="stat-box-label">
                <Clock size={14} /> Prep
              </span>
              <span className="stat-box-val">{prepTime} min</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">
                <Flame size={14} /> Cook
              </span>
              <span className="stat-box-val">{cookTime} min</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">
                <Timer size={14} /> Total
              </span>
              <span className="stat-box-val">{totalTime} min</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">
                <Users size={14} /> Serves
              </span>
              <span className="stat-box-val">{servings}</span>
            </div>
          </div>

          {/* Author Card */}
          <div className="details-author-card">
            <div className="author-info-group">
              <div className="author-avatar-lg">{authorInitial}</div>
              <div className="author-text">
                <h4>Created by {authorName}</h4>
                <p>
                  RecipeHub Contributor • Updated on {formattedUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Recipe Content: Ingredients & Cooking Instructions */}
      <section className="recipe-content-grid">
        {/* Left Column: Ingredients with interactive checklists */}
        <aside className="ingredients-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChefHat size={22} color="var(--accent-orange)" />
            <h2 style={{ fontSize: '1.5rem' }}>Ingredients</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Click an ingredient to cross it off as you cook.
          </p>

          <ul className="ingredients-list">
            {ingredients.map((item, idx) => (
              <li
                key={idx}
                className={`ingredient-item ${checkedIngredients[idx] ? 'checked' : ''}`}
                onClick={() => toggleIngredient(idx)}
              >
                <div className="custom-checkbox">
                  {checkedIngredients[idx] && <Check size={14} />}
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Column: Step-by-Step Cooking Steps */}
        <main className="instructions-card">
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            Cooking Instructions
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Follow these sequential steps for the most delicious results.
          </p>

          <ol className="steps-list">
            {steps.map((step, idx) => (
              <li key={idx} className="step-item">
                <div className="step-number">{idx + 1}</div>
                <div className="step-text">{step}</div>
              </li>
            ))}
          </ol>
        </main>
      </section>

      {/* Related Recipes in Category */}
      {relatedRecipes.length > 0 && (
        <section style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>
            More {category} Recipes You'll Love
          </h3>
          <div className="recipes-grid">
            {relatedRecipes.map((r) => (
              <RecipeCard key={r._id} recipe={r} />
            ))}
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        title={title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RecipeDetailsPage;
