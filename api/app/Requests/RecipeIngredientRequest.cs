using System.ComponentModel.DataAnnotations;

namespace RecipeBook.Api.App.Requests;

public sealed class RecipeIngredientRequest
{
    [PositiveDecimal(ErrorMessage = "La quantité doit être renseignée et positive.")]
    public decimal? Quantity { get; init; }

    [StringLength(50, ErrorMessage = "L’unité ne peut pas dépasser 50 caractères.")]
    public string? Unit { get; init; }

    [Required(ErrorMessage = "Le nom de l’ingrédient est requis.")]
    [StringLength(100, ErrorMessage = "Le nom de l’ingrédient ne peut pas dépasser 100 caractères.")]
    public string? Name { get; init; }
}
