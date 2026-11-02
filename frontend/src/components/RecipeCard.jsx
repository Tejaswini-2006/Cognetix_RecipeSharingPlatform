import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Flame, Edit3, Trash2 } from 'lucide-react';
import { getImageUrl } from '../services/api';
import './RecipeCard.css';

const RecipeCard = ({
  recipe,
  showActions = false,
  onEdit,
  onDelete
}) => {
  const {
    _id,
    title,
    description,
    category,
    image,
    prepTime = 15,
    cookTime = 30,
    servings = 4,
    author
  } = recipe;

  const authorName = author?.name || 'RecipeHub Chef';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article className="recipe-card">
      {/* Media & Category Badge */}
      <div className="recipe-card-media">
        <Link to={`/recipes/${_id}`}>
          <img
            src={getImageUrl(image)}
            alt={title}
            className="recipe-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = getImageUrl('/uploads/default-recipe.svg');
            }}
          />
        </Link>
        <span className="badge badge-category recipe-card-category">
          {category}
        </span>
      </div>

      {/* Body Content */}
      <div className="recipe-card-body">
        <Link to={`/recipes/${_id}`}>
          <h3 className="recipe-card-title">{title}</h3>
        </Link>
        <p className="recipe-card-desc">{description}</p>

        {/* Cooking Quick Stats */}
        <div className="recipe-card-meta">
          <div className="recipe-card-meta-item" title="Prep time">
            <Clock size={15} color="var(--accent-orange)" />
            <span>{prepTime}m prep</span>
          </div>
          <div className="recipe-card-meta-item" title="Cook time">
            <Flame size={15} color="var(--accent-orange)" />
            <span>{cookTime}m cook</span>
          </div>
          <div className="recipe-card-meta-item" title="Servings">
            <Users size={15} color="var(--primary-medium)" />
            <span>{servings} servings</span>
          </div>
        </div>

        {/* Footer info: author and optional action buttons */}
        <div className="recipe-card-footer">
          <div className="recipe-card-author">
            <div className="author-avatar-sm">{authorInitial}</div>
            <span>{authorName}</span>
          </div>

          {showActions ? (
            <div className="recipe-card-actions">
              <button
                type="button"
                className="action-btn edit"
                onClick={() => onEdit?.(recipe)}
                title="Edit this recipe"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="action-btn delete"
                onClick={() => onDelete?.(recipe)}
                title="Delete this recipe"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            <Link to={`/recipes/${_id}`} className="btn btn-outline btn-sm">
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
