import { apiRequest, CATEGORY_ENDPOINTS } from "../config/api";

const transformCategory = (categoryData) => ({
  id: categoryData._id,
  name: categoryData.name,
  isActive: categoryData.isActive,
});

// Create category
export const createCategory = async (categoryDetail) => {
  const { name } = categoryDetail;

  if (!name?.trim()) {
    throw new Error("Category name is required");
  }

  try {
    const response = await apiRequest(CATEGORY_ENDPOINTS.CREATE_CATEGORY, {
      method: "POST",
      body: {
        name,
      },
    });

    const transformedCategory = transformCategory(response);

    return transformedCategory;
  } catch (error) {
    throw new Error(error.message || "Failed to create category");
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiRequest(CATEGORY_ENDPOINTS.GET_ALL_CATEGORY);

    const transformedCategory = response.map(transformCategory);

    return transformedCategory;
  } catch (error) {
    throw new Error(error.message || "Failed to get categories");
  }
};

// Get a category
export const getCategory = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Invalid category");
  }

  try {
    const response = await apiRequest(
      CATEGORY_ENDPOINTS.GET_SINGLE_CATEGORY(categoryId),
    );

    const transformedCategory = transformCategory(response);

    return transformedCategory;
  } catch (error) {
    throw new Error(error.message || "Failed to get category");
  }
};

// Update a category
export const updateCategory = async (categoryId, name) => {
  if (!categoryId) {
    throw new Error("Invalid category");
  }

  if (!name?.trim()) {
    throw new Error("Name field is empty");
  }

  try {
    const response = await apiRequest(
      CATEGORY_ENDPOINTS.UPDATE_CATEGORY(categoryId),
      {
        method: "PATCH",
        body: {
            name
        }
      },
    );

    const transformedCategory = transformCategory(response);

    return transformedCategory;
  } catch (error) {
    throw new Error(error.message || "Failed to update category");
  }
};

// Change category status
export const changeCategoryStatus = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Invalid category");
  }

  try {
    const response = await apiRequest(
      CATEGORY_ENDPOINTS.TOGGLE_CATEGORY_STATUS(categoryId), {
        method: "PATCH"
      }
    );

    const transformedCategory = transformCategory(response);
    return transformedCategory;
  } catch (error) {
    throw new Error(error.message || "Failed to change category status");
  }
};

const categoryService = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  changeCategoryStatus,
};

export default categoryService;
