import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  UploadCloud,
  Plus,
  Trash2,
  Clock,
  Flame,
  Users,
  Image as ImageIcon,
  CheckCircle
} from 'lucide-react';
import AlertMessage from '../components/AlertMessage';
import * as recipeService from '../services/recipeService';
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

const AddRecipePage = () => {
  const navigate = useNavigate();

  // Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Indian');
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);

  // Dynamic Lists
  const [ingredients, setIngredients] = useState([
    '2 cups basmati rice',
    '1 tbsp olive oil or butter',
    'Salt to taste'
  ]);
  const [steps, setSteps] = useState([
    'Wash and rinse the ingredients thoroughly.',
    'Heat oil in a heavy saucepan over medium flame.',
    'Combine all ingredients and simmer gently until cooked.'
  ]);

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic Ingredients handlers
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

  // Dynamic Steps handlers
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

  // Handle Image File selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setError('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Maximum allowed size is 5MB.');
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim() || !description.trim()) {
      setError('Please provide a recipe title and description.');
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

    setLoading(true);

    try {
      // Build FormData for Multer
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

      const res = await recipeService.createRecipe(formData);
      if (res.success && res.data) {
        navigate(`/recipes/${res.data._id}`);
      }
    } catch (err) {
      console.error('Failed to create recipe:', err);
      setError(
        err.response?.data?.message || 'Failed to publish recipe. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Share a New Recipe</h1>
        <p>
          Inspire home chefs around the world with your unique culinary creation.
        </p>
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
            <p className="form-section-subtitle">
              Give your dish an appetizing title, background story, and category.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Recipe Title *
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="e.g. Grandma's Classic Lasagna Bolognese"
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
                placeholder="Describe what makes this recipe special, texture, aromas, and serving ideas..."
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
              Food Photography
            </h3>
            <p className="form-section-subtitle">
              Upload a clear, high-resolution photo of your finished dish (JPG, PNG, WEBP).
            </p>

            {previewUrl ? (
              <div className="image-upload-preview">
                <img src={previewUrl} alt="Recipe upload preview" />
                <button
                  type="button"
                  className="btn-clear-image"
                  onClick={handleClearImage}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="image-upload-box">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}
                >
                  <UploadCloud size={28} />
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>
                  Click to select food image
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  PNG, JPG or WEBP up to 5MB
                </p>
              </label>
            )}
          </div>

          {/* Section 3: Ingredients */}
          <div className="form-section">
            <h3 className="form-section-title">
              <span>Ingredients List</span>
            </h3>
            <p className="form-section-subtitle">
              List every ingredient with its quantity and measurement.
            </p>

            <div className="dynamic-list">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="dynamic-item-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`e.g. 250g fresh mozzarella or 1 tbsp garlic`}
                    value={ing}
                    onChange={(e) => handleIngredientChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeIngredientRow(idx)}
                    disabled={ingredients.length === 1}
                    title="Remove ingredient"
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
            <p className="form-section-subtitle">
              Step-by-step instructions from prep to serving.
            </p>

            <div className="dynamic-list">
              {steps.map((step, idx) => (
                <div key={idx} className="dynamic-item-row">
                  <div className="step-prefix">{idx + 1}</div>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '68px' }}
                    placeholder={`Step ${idx + 1} instructions...`}
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeStepRow(idx)}
                    disabled={steps.length === 1}
                    title="Remove step"
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
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              <CheckCircle size={20} />
              <span>{loading ? 'Publishing Recipe...' : 'Publish Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipePage;
