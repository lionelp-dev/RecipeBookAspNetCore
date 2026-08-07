import { Component, computed, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideTrash2 } from '@lucide/angular';
import { finalize } from 'rxjs';
import { RecipeService } from '../../features/recipe/recipe.service';
import { Recipe, RecipeIngredient } from '../../features/recipe/recipe.types';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, LucidePencil, LucideTrash2],
  templateUrl: './home.html',
})
export class HomePage {
  private readonly recipeService = inject(RecipeService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly deleteErrorMessage = signal<string | null>(null);
  protected readonly deletingRecipeId = signal<number | null>(null);
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly selectedRecipeId = signal<number | null>(null);
  protected readonly skeletonItems = [1, 2, 3, 4, 5, 6];
  protected readonly selectedRecipe = computed(() => {
    const selectedRecipeId = this.selectedRecipeId();

    if (selectedRecipeId === null) {
      return null;
    }

    return this.recipes().find((recipe) => recipe.id === selectedRecipeId) ?? null;
  });
  protected readonly selectedRecipeTotalTime = computed(() => {
    const recipe = this.selectedRecipe();

    if (!recipe) {
      return null;
    }

    return recipe.preparationTime + recipe.cookingTime;
  });
  protected readonly hasSelectedRecipe = computed(() => this.selectedRecipe() !== null);
  protected readonly recipeCountLabel = computed(() => {
    const count = this.recipes().length;
    return `${count} recette${count === 1 ? '' : 's'}`;
  });

  constructor() {
    this.loadRecipes();
  }

  protected loadRecipes(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.recipeService
      .getRecipes()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (recipes) => this.recipes.set(recipes),
        error: () => {
          this.errorMessage.set(
            'Impossible de charger les recettes. Vérifiez que l’API est disponible, puis réessayez.',
          );
        },
      });
  }

  protected deleteRecipe(recipe: Recipe): void {
    const shouldDelete = window.confirm(`Supprimer la recette « ${recipe.name} » ?`);

    if (!shouldDelete) {
      return;
    }

    this.deletingRecipeId.set(recipe.id);
    this.deleteErrorMessage.set(null);

    this.recipeService
      .deleteRecipe(recipe.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.deletingRecipeId.set(null)),
      )
      .subscribe({
        next: () => {
          if (this.selectedRecipeId() === recipe.id) {
            this.selectedRecipeId.set(null);
          }

          this.loadRecipes();
        },
        error: () => {
          this.deleteErrorMessage.set('Impossible de supprimer la recette. Veuillez réessayer.');
        },
      });
  }

  protected openMobileMenu(): void {
    this.isMobileMenuOpen.set(true);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected openRecipeSidebar(recipe: Recipe): void {
    this.selectedRecipeId.set(recipe.id);
    this.isMobileMenuOpen.set(false);
  }

  protected closeRecipeSidebar(): void {
    this.selectedRecipeId.set(null);
  }

  protected formatIngredient(ingredient: RecipeIngredient): string {
    const parts: string[] = [];

    parts.push(`${ingredient.quantity}`);

    if (ingredient.unit) {
      parts.push(ingredient.unit);
    }

    parts.push(ingredient.name);

    return parts.join(' ');
  }

  @HostListener('document:keydown.escape')
  protected closePanelsWithEscape(): void {
    this.closeMobileMenu();
    this.closeRecipeSidebar();
  }
}
