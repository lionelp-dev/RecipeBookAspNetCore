using System.ComponentModel.DataAnnotations;

namespace RecipeBook.Api.App.Requests;

public sealed class UpdateRecipeRequest
{
    [Required(ErrorMessage = "Le nom est requis.")]
    [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères.")]
    public string? Name { get; init; }

    [StringLength(1000, ErrorMessage = "La description ne peut pas dépasser 1 000 caractères.")]
    public string? Description { get; init; }

    [Required(ErrorMessage = "Le temps de préparation est requis.")]
    [Range(0, int.MaxValue, ErrorMessage = "Le temps de préparation doit être positif ou nul.")]
    public int? PreparationTime { get; init; }

    [Required(ErrorMessage = "Le temps de cuisson est requis.")]
    [Range(0, int.MaxValue, ErrorMessage = "Le temps de cuisson doit être positif ou nul.")]
    public int? CookingTime { get; init; }
}
