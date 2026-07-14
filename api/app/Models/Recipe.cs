namespace RecipeBook.Api.App.Models;

public class Recipe
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public int PreparationTime { get; set; }

    public int CookingTime { get; set; }
}
