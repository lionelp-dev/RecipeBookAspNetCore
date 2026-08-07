export interface RecipeIngredient {
  id: number;
  quantity: number;
  unit: string | null;
  name: string;
  position: number;
}

export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  preparationTime: number;
  cookingTime: number;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredientRequest {
  quantity: number;
  unit: string | null;
  name: string;
}

export interface CreateRecipeRequest {
  name: string;
  description: string | null;
  preparationTime: number;
  cookingTime: number;
  ingredients: RecipeIngredientRequest[];
}

export type UpdateRecipeRequest = CreateRecipeRequest;
