import api from './api';

export const getRecipes = async (params = {}) => {
  const response = await api.get('/recipes', { params });
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/recipes/categories');
  return response.data;
};

export const getMyRecipes = async () => {
  const response = await api.get('/recipes/my-recipes');
  return response.data;
};

export const searchRecipes = async (searchTerm) => {
  const response = await api.get('/recipes/search', {
    params: { name: searchTerm }
  });
  return response.data;
};

export const filterByCategory = async (category) => {
  const response = await api.get('/recipes/filter', {
    params: { category }
  });
  return response.data;
};

export const createRecipe = async (formData) => {
  const response = await api.post('/recipes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateRecipe = async (id, formData) => {
  const response = await api.put(`/recipes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};
