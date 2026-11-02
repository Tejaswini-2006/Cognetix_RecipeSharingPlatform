import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Utensils, RotateCcw } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import * as recipeService from '../services/recipeService';
import './RecipesPage.css';

const CATEGORIES = [
  'All',
  'Indian',
  'Italian',
  'Chinese',
  'Desserts',
  'Breakfast',
  'Fast Food',
  'Healthy Food',
  'Beverages'
];

const RecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [ingredientFilter, setIngredientFilter] = useState(searchParams.get('ingredient') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state when URL search params change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Fetch recipes whenever filters change
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: 9,
          sort: sortOption
        };

        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
        if (ingredientFilter.trim()) params.ingredient = ingredientFilter.trim();

        const res = await recipeService.getRecipes(params);
        if (res.success) {
          setRecipes(res.data);
          setTotalPages(res.pages);
          setTotalCount(res.total);
        }
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory, searchTerm, ingredientFilter, sortOption, page]);

  // Handle category selection
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setIngredientFilter('');
    setSortOption('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div className="page-header">
        <h1>Discover Recipes</h1>
        <p>
          Browse through our curated collection of delicious dishes crafted with
          fresh ingredients and passion.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="recipes-controls">
        <div className="search-filter-row">
          {/* Keyword Search */}
          <div className="input-with-icon">
            <Search size={18} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search recipe title or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Ingredient Filter */}
          <div className="input-with-icon">
            <Utensils size={18} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by ingredient (e.g. cheese)..."
              value={ingredientFilter}
              onChange={(e) => {
                setIngredientFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Sort Selection */}
          <div className="input-with-icon">
            <SlidersHorizontal size={18} className="input-icon" />
            <select
              className="form-select"
              style={{ paddingLeft: '42px' }}
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="prepTime">Sort: Quickest Prep</option>
              <option value="title">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="category-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      {/* Results Header Info */}
      <div className="results-header">
        <div className="results-count">
          Showing <strong>{recipes.length}</strong> of <strong>{totalCount}</strong> recipes
          {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
          {searchTerm && <span> matching "<em>{searchTerm}</em>"</span>}
        </div>

        {(searchTerm || selectedCategory !== 'All' || ingredientFilter) && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleResetFilters}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingSpinner message="Searching our culinary cookbook..." />
      ) : recipes.length > 0 ? (
        <>
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 200, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-state-icon">
            <Filter size={32} />
          </div>
          <h3>No Recipes Found</h3>
          <p>
            We couldn't find any recipes matching your current search criteria.
            Try adjusting your keywords or clearing the category filter.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResetFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
