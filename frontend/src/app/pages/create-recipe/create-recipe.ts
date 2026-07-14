import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecipeService } from '../../features/recipe/recipe.service';

function requiredTrimmed(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() ? null : { required: true };
}

@Component({
  selector: 'app-create-recipe-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-recipe.html',
})
export class CreateRecipePage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [requiredTrimmed, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(1000)],
    preparationTime: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    cookingTime: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
  });

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    const value = this.form.getRawValue();
    const description = value.description.trim();

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.recipeService
      .createRecipe({
        name: value.name.trim(),
        description: description || null,
        preparationTime: value.preparationTime,
        cookingTime: value.cookingTime,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: () => void this.router.navigateByUrl('/'),
        error: () => {
          this.errorMessage.set(
            'Impossible de créer la recette. Vérifiez les informations, puis réessayez.',
          );
        },
      });
  }
}
