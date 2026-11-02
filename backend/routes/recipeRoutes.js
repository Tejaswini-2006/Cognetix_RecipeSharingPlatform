const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  filterRecipes,
  getMyRecipes,
  getCategories
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Specific routes before :id
router.get('/categories', getCategories);
router.get('/search', searchRecipes);
router.get('/filter', filterRecipes);
router.get('/my-recipes', protect, getMyRecipes);

// Standard CRUD routes
router
  .route('/')
  .get(getRecipes)
  .post(protect, upload.single('image'), createRecipe);

router
  .route('/:id')
  .get(getRecipeById)
  .put(protect, upload.single('image'), updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
