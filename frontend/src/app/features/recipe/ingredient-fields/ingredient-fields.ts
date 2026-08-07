import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LucidePlus, LucideTrash2 } from '@lucide/angular';
import { createIngredientGroup, IngredientFormArray } from './ingredient-form';

@Component({
  selector: 'app-ingredient-fields',
  imports: [ReactiveFormsModule, LucidePlus, LucideTrash2],
  templateUrl: './ingredient-fields.html',
})
export class IngredientFieldsComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) ingredients!: IngredientFormArray;

  protected addIngredient(): void {
    this.ingredients.push(createIngredientGroup(this.formBuilder));
  }

  protected removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }
}
