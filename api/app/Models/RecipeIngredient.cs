namespace RecipeBook.Api.App.Models;

public class RecipeIngredient
{
    public int Id { get; set; }

    public int RecipeId { get; set; }

    public decimal Quantity { get; set; }

    public string? Unit { get; set; }

    public required string Name { get; set; }

    public int Position { get; set; }
}
