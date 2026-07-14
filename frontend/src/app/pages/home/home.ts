import { Component, computed, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideTrash2 } from '@lucide/angular';
import { finalize } from 'rxjs';
import { Recipe, RecipeService } from '../../features/recipe/recipe.service';

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
  protected readonly isSidebarOpen = signal(false);
  protected readonly skeletonItems = [1, 2, 3, 4, 5, 6];
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
        next: () => this.loadRecipes(),
        error: () => {
          this.deleteErrorMessage.set('Impossible de supprimer la recette. Veuillez réessayer.');
        },
      });
  }

  protected openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeSidebarWithEscape(): void {
    this.closeSidebar();
  }
}
