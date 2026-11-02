import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChefHat,
  UploadCloud,
  Plus,
  Trash2,
  Clock,
  Flame,
  Users,
  Image as ImageIcon,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import * as recipeService from '../services/recipeService';
import { getImageUrl } from '../services/api';
import './RecipeForm.css';

const CATEGORIES = [
  'Indian',
  'Italian',
  'Chinese',
  'Desserts',
  'Breakfast',
  'Fast Food',
  'Healthy Food',
  'Beverages',
  'Other'
];

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Indian');
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);

  // Dynamic Lists
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  // Current and replacement image
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Status
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipeService.getRecipeById(id);
        if (res.success && res.data) {
          const rec = res.data;

          // Check ownership
          const authorId = rec.author?._id || rec.author;
          const currentUserId = user?.id || user?._id;
          if (authorId && currentUserId && authorId.toString() !== currentUserId.toString()) {
            navigate('/recipes');
            return;
          }

          setTitle(rec.title || '');
          setDescription(rec.description || '');
          setCategory(rec.category || 'Indian');
          setPrepTime(rec.prepTime || 15);
          setCookTime(rec.cookTime || 30);
          setServings(rec.servings || 4);
          setIngredients(rec.ingredients?.length ? rec.ingredients : ['']);
          setSteps(rec.steps?.length ? rec.steps : ['']);
          setCurrentImage(rec.image || '');
        } else {
          setError('Recipe not found.');
        }
      } catch (err) {
        console.error('Error fetching recipe for edit:', err);
        setError('Failed to load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, navigate]);

  // Ingredients handlers
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientRow = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Steps handlers
  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStepRow = () => {
    setSteps([...steps, '']);
  };

  const removeStepRow = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // Image handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setError('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Maximum allowed size is 5MB.');
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleClearReplacementImage = () => {
    setImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Please provide title and description.');
      return;
    }

    const filteredIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    if (filteredIngredients.length === 0) {
      setError('Please provide at least one valid ingredient.');
      return;
    }

    const filteredSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (filteredSteps.length === 0) {
      setError('Please provide at least one cooking instruction step.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('prepTime', prepTime);
      formData.append('cookTime', cookTime);
      formData.append('servings', servings);
      formData.append('ingredients', JSON.stringify(filteredIngredients));
      formData.append('steps', JSON.stringify(filteredSteps));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await recipeService.updateRecipe(id, formData);
      if (res.success) {
        navigate(`/recipes/${id}`);
      }
    } catch (err) {
      console.error('Failed to update recipe:', err);
      setError(
        err.response?.data?.message || 'Failed to update recipe. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading recipe details for editing..." />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit Recipe</h1>
        <p>Update your recipe instructions, timing, ingredients or photo.</p>
      </div>

      <div className="recipe-form-card">
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Overview */}
          <div className="form-section">
            <h3 className="form-section-title">
              <ChefHat size={22} color="var(--accent-orange)" />
              Recipe Overview
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Recipe Title *
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description & Flavor Profile *
              </label>
              <textarea
                id="description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label" htmlFor="prepTime">
                  Prep Time (mins)
                </label>
                <div className="input-with-icon">
                  <Clock size={16} className="input-icon" />
                  <input
                    id="prepTime"
                    type="number"
                    min="0"
                    className="form-input"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cookTime">
                  Cook Time (mins)
                </label>
                <div className="input-with-icon">
                  <Flame size={16} className="input-icon" />
                  <input
                    id="cookTime"
                    type="number"
                    min="0"
                    className="form-input"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="servings">
                  Servings
                </label>
                <div className="input-with-icon">
                  <Users size={16} className="input-icon" />
                  <input
                    id="servings"
                    type="number"
                    min="1"
                    className="form-input"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Recipe Image */}
          <div className="form-section">
            <h3 className="form-section-title">
              <ImageIcon size={22} color="var(--accent-orange)" />
              Recipe Photo
            </h3>

            {previewUrl ? (
              <div className="image-upload-preview">
                <img src={previewUrl} alt="Replacement preview" />
                <button
                  type="button"
                  className="btn-clear-image"
                  onClick={handleClearReplacementImage}
                  title="Remove replacement image"
                >
                  ✕
                </button>
              </div>
            ) : currentImage ? (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Current Photo:
                </p>
                <div style={{ position: 'relative', width: '100%', maxHeight: '280px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                  <img
                    src={getImageUrl(currentImage)}
                    alt="Current recipe"
                    style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                  />
                </div>
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <UploadCloud size={16} />
                  <span>Upload Replacement Photo</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            ) : (
              <label className="image-upload-box">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <UploadCloud size={28} />
                <h4>Select new photo</h4>
              </label>
            )}
          </div>

          {/* Section 3: Ingredients */}
          <div className="form-section">
            <h3 className="form-section-title">
              <span>Ingredients List</span>
            </h3>

            <div className="dynamic-list">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="dynamic-item-row">
                  <input
                    type="text"
                    className="form-input"
                    value={ing}
                    onChange={(e) => handleIngredientChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeIngredientRow(idx)}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={addIngredientRow}
            >
              <Plus size={16} />
              <span>Add Another Ingredient</span>
            </button>
          </div>

          {/* Section 4: Cooking Steps */}
          <div className="form-section" style={{ borderBottom: 'none' }}>
            <h3 className="form-section-title">
              <span>Cooking Steps & Instructions</span>
            </h3>

            <div className="dynamic-list">
              {steps.map((step, idx) => (
                <div key={idx} className="dynamic-item-row">
                  <div className="step-prefix">{idx + 1}</div>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '68px' }}
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeStepRow(idx)}
                    disabled={steps.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={addStepRow}
            >
              <Plus size={16} />
              <span>Add Another Step</span>
            </button>
          </div>

          {/* Submit Actions */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end',
              marginTop: '32px'
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(`/recipes/${id}`)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              <CheckCircle size={20} />
              <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipePage;
