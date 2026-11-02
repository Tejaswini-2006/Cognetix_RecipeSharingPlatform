import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, ChefHat, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import DeleteModal from '../components/DeleteModal';
import * as recipeService from '../services/recipeService';
import './MyRecipesPage.css';

const MyRecipesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Deletion modal state
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await recipeService.getMyRecipes();
      if (res.success && res.data) {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch personal recipes:', err);
      setError('Could not load your recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const handleEdit = (recipe) => {
    navigate(`/recipes/edit/${recipe._id}`);
  };

  const handleDeleteRequest = (recipe) => {
    setRecipeToDelete(recipe);
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;
    setIsDeleting(true);
    try {
      const res = await recipeService.deleteRecipe(recipeToDelete._id);
      if (res.success) {
        setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
        setRecipeToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert(err.response?.data?.message || 'Failed to delete recipe.');
    } finally {
      setIsDeleting(false);
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Chef Profile Banner */}
      <div className="chef-profile-banner">
        <div className="chef-profile-left">
          <div className="chef-avatar-xl">{initial}</div>
          <div className="chef-profile-info">
            <h2>Chef {user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="chef-profile-stats">
          <div className="chef-stat-box">
            <div className="chef-stat-val">{recipes.length}</div>
            <div className="chef-stat-label">Published Recipes</div>
          </div>
          <Link to="/recipes/add" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Add Recipe</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Recipes Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
          My Recipe Collection
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage, edit, or remove your personal creations from the community catalog.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving your recipe collection..." />
      ) : recipes.length > 0 ? (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ChefHat size={32} />
          </div>
          <h3>You Haven't Shared Any Recipes Yet</h3>
          <p>
            Your digital recipe cookbook is currently empty. Start sharing your
            beloved dishes with the RecipeHub community today!
          </p>
          <Link to="/recipes/add" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Share Your First Recipe</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!recipeToDelete}
        title={recipeToDelete?.title || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRecipeToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MyRecipesPage;
