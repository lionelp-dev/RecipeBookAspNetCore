import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  preparationTime: number;
  cookingTime: number;
}

export interface CreateRecipeRequest {
  name: string;
  description: string | null;
  preparationTime: number;
  cookingTime: number;
}

export type UpdateRecipeRequest = CreateRecipeRequest;

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('/api/recipes');
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`/api/recipes/${id}`);
  }

  createRecipe(request: CreateRecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>('/api/recipes', request);
  }

  updateRecipe(id: number, request: UpdateRecipeRequest): Observable<void> {
    return this.http.put<void>(`/api/recipes/${id}`, request);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`/api/recipes/${id}`);
  }
}
