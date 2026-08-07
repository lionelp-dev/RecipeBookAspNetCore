import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RecipeIngredientRequest } from '../recipe.types';

export interface IngredientFormValue {
  quantity: number | null;
  unit: string;
  name: string;
}

export type IngredientFormGroup = FormGroup<{
  quantity: FormControl<number | null>;
  unit: FormControl<string>;
  name: FormControl<string>;
}>;

export type IngredientFormArray = FormArray<IngredientFormGroup>;

export function createIngredientGroup(
  formBuilder: FormBuilder,
  ingredient: Partial<IngredientFormValue> = {},
): IngredientFormGroup {
  return formBuilder.group(
    {
      quantity: formBuilder.control<number | null>(ingredient.quantity ?? null, {
        validators: [Validators.required, positiveDecimalValidator()],
      }),
      unit: formBuilder.nonNullable.control(ingredient.unit ?? '', [Validators.maxLength(50)]),
      name: formBuilder.nonNullable.control(ingredient.name ?? '', [Validators.maxLength(100)]),
    },
    { validators: [ingredientLineValidator] },
  ) as IngredientFormGroup;
}

export function normalizeIngredient(value: IngredientFormValue): RecipeIngredientRequest | null {
  const name = value.name.trim();
  const unit = value.unit.trim();

  if (!name && !unit && value.quantity === null) {
    return null;
  }

  if (value.quantity === null) {
    return null;
  }

  return {
    quantity: value.quantity,
    unit: unit || null,
    name,
  };
}

export function ingredientHasVisibleContent(value: IngredientFormValue): boolean {
  return Boolean(value.name.trim() || value.unit.trim() || value.quantity !== null);
}

function ingredientLineValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as IngredientFormGroup;
  const value = group.getRawValue();

  if (!ingredientHasVisibleContent(value)) {
    return null;
  }

  return value.name.trim() ? null : { ingredientNameRequired: true };
}

function positiveDecimalValidator(): ValidatorFn {
  return (control: AbstractControl<number | null>): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined) {
      return null;
    }

    return value > 0 ? null : { positiveDecimal: true };
  };
}
