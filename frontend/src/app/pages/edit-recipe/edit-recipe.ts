import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecipeService } from '../../features/recipe/recipe.service';
import { IngredientFieldsComponent } from '../../features/recipe/ingredient-fields/ingredient-fields';
import {
  createIngredientGroup,
  IngredientFormGroup,
  normalizeIngredient,
} from '../../features/recipe/ingredient-fields/ingredient-form';
import { RecipeIngredientRequest } from '../../features/recipe/recipe.types';

function requiredTrimmed(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() ? null : { required: true };
}

@Component({
  selector: 'app-edit-recipe-page',
  imports: [ReactiveFormsModule, RouterLink, IngredientFieldsComponent],
  templateUrl: './edit-recipe.html',
})
export class EditRecipePage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recipeId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly loadErrorMessage = signal<string | null>(null);
  protected readonly saveErrorMessage = signal<string | null>(null);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [requiredTrimmed, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(1000)],
    preparationTime: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    cookingTime: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    ingredients: new FormArray<IngredientFormGroup>([]),
  });

  constructor() {
    this.loadRecipe();
  }

  protected loadRecipe(): void {
    if (!Number.isInteger(this.recipeId) || this.recipeId <= 0) {
      this.isLoading.set(false);
      this.loadErrorMessage.set('La recette demandée est introuvable.');
      return;
    }

    this.isLoading.set(true);
    this.loadErrorMessage.set(null);

    this.recipeService
      .getRecipe(this.recipeId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (recipe) => {
          this.form.controls.ingredients.clear();
          this.form.patchValue({
            name: recipe.name,
            description: recipe.description ?? '',
            preparationTime: recipe.preparationTime,
            cookingTime: recipe.cookingTime,
          });

          for (const ingredient of recipe.ingredients) {
            this.form.controls.ingredients.push(
              createIngredientGroup(this.formBuilder, {
                quantity: ingredient.quantity,
                unit: ingredient.unit ?? '',
                name: ingredient.name,
              }),
            );
          }
        },
        error: () => {
          this.loadErrorMessage.set(
            'Impossible de charger la recette. Vérifiez que l’API est disponible, puis réessayez.',
          );
        },
      });
  }

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    const value = this.form.getRawValue();
    const description = value.description.trim();
    const ingredients = value.ingredients
      .map(normalizeIngredient)
      .filter((ingredient): ingredient is RecipeIngredientRequest => ingredient !== null);

    this.isSubmitting.set(true);
    this.saveErrorMessage.set(null);

    this.recipeService
      .updateRecipe(this.recipeId, {
        name: value.name.trim(),
        description: description || null,
        preparationTime: value.preparationTime,
        cookingTime: value.cookingTime,
        ingredients,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: () => void this.router.navigateByUrl('/'),
        error: () => {
          this.saveErrorMessage.set(
            'Impossible de modifier la recette. Vérifiez les informations, puis réessayez.',
          );
        },
      });
  }
}
