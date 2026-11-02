const { Recipe, CATEGORIES } = require('../models/Recipe');
const { deleteImageFile } = require('../middleware/uploadMiddleware');

// Helper to safely parse array fields that might be JSON strings or arrays
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Split by newline or comma if not JSON
      return field
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// @desc    Get all recipes with search, filter, pagination
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res, next) => {
  try {
    const { name, search, category, ingredient, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Search by title or description
    const searchTerm = (search || name || '').trim();
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { ingredients: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by specific ingredient
    if (ingredient) {
      query.ingredients = { $regex: ingredient.trim(), $options: 'i' };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'prepTime') sortOption = { prepTime: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('author', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: recipes.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize) || 1,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search recipes by name/keyword
// @route   GET /api/recipes/search
// @access  Public
const searchRecipes = async (req, res, next) => {
  try {
    const searchTerm = (req.query.name || req.query.q || '').trim();
    if (!searchTerm) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { ingredients: { $regex: searchTerm, $options: 'i' } }
      ]
    })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Filter recipes by category
// @route   GET /api/recipes/filter
// @access  Public
const filterRecipes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recipes created by current logged-in user
// @route   GET /api/recipes/my-recipes
// @access  Private
const getMyRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      'author',
      'name email'
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res, next) => {
  try {
    const { title, description, category, prepTime, cookTime, servings } =
      req.body;

    const ingredients = parseArrayField(req.body.ingredients);
    const steps = parseArrayField(req.body.steps);

    if (!title || !description || !category) {
      // Clean up uploaded file if validation fails
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category'
      });
    }

    if (!ingredients.length) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient'
      });
    }

    if (!steps.length) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one cooking instruction step'
      });
    }

    let image = '/uploads/default-recipe.svg';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === 'string') {
      image = req.body.image;
    }

    const recipe = await Recipe.create({
      title: title.trim(),
      description: description.trim(),
      ingredients,
      steps,
      category,
      image,
      prepTime: prepTime ? Number(prepTime) : 15,
      cookTime: cookTime ? Number(cookTime) : 30,
      servings: servings ? Number(servings) : 4,
      author: req.user._id
    });

    await recipe.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Recipe published successfully!',
      data: recipe
    });
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (Owner only)
const updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Verify ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own recipes'
      });
    }

    const { title, description, category, prepTime, cookTime, servings } =
      req.body;

    if (title) recipe.title = title.trim();
    if (description) recipe.description = description.trim();
    if (category) recipe.category = category;
    if (prepTime) recipe.prepTime = Number(prepTime);
    if (cookTime) recipe.cookTime = Number(cookTime);
    if (servings) recipe.servings = Number(servings);

    if (req.body.ingredients) {
      const parsedIngredients = parseArrayField(req.body.ingredients);
      if (parsedIngredients.length > 0) {
        recipe.ingredients = parsedIngredients;
      }
    }

    if (req.body.steps) {
      const parsedSteps = parseArrayField(req.body.steps);
      if (parsedSteps.length > 0) {
        recipe.steps = parsedSteps;
      }
    }

    // If new image uploaded, remove old image (if local upload) and update path
    if (req.file) {
      const oldImage = recipe.image;
      recipe.image = `/uploads/${req.file.filename}`;
      deleteImageFile(oldImage);
    } else if (req.body.image && typeof req.body.image === 'string') {
      recipe.image = req.body.image;
    }

    await recipe.save();
    await recipe.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      data: recipe
    });
  } catch (error) {
    if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Owner only)
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Verify ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own recipes'
      });
    }

    // Clean up image file
    if (recipe.image) {
      deleteImageFile(recipe.image);
    }

    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available recipe categories
// @route   GET /api/recipes/categories
// @access  Public
const getCategories = (req, res) => {
  res.status(200).json({
    success: true,
    data: CATEGORIES
  });
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  filterRecipes,
  getMyRecipes,
  getCategories
};
