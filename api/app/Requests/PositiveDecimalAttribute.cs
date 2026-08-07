using System.ComponentModel.DataAnnotations;

namespace RecipeBook.Api.App.Requests;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
public sealed class PositiveDecimalAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is decimal decimalValue && decimalValue > 0m)
        {
            return ValidationResult.Success;
        }

        return new ValidationResult(ErrorMessage ?? "La quantité doit être positive.");
    }
}
