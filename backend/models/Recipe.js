const mongoose = require('mongoose');

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

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a recipe title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a recipe description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    ingredients: {
      type: [String],
      required: [true, 'Please provide at least one ingredient'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0 && arr.some(item => item && item.trim().length > 0);
        },
        message: 'A recipe must have at least one non-empty ingredient'
      }
    },
    steps: {
      type: [String],
      required: [true, 'Please provide cooking instructions/steps'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0 && arr.some(item => item && item.trim().length > 0);
        },
        message: 'A recipe must have at least one cooking instruction step'
      }
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: CATEGORIES,
        message: 'Invalid category selected'
      }
    },
    image: {
      type: String,
      default: '/uploads/default-recipe.svg'
    },
    prepTime: {
      type: Number, // in minutes
      default: 15,
      min: [0, 'Prep time cannot be negative']
    },
    cookTime: {
      type: Number, // in minutes
      default: 30,
      min: [0, 'Cook time cannot be negative']
    },
    servings: {
      type: Number,
      default: 4,
      min: [1, 'Servings must be at least 1']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for text search on title, description, ingredients, and category
recipeSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = {
  Recipe: mongoose.model('Recipe', recipeSchema),
  CATEGORIES
};
