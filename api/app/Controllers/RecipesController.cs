using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.Api.App.Models;
using RecipeBook.Api.App.Requests;
using RecipeBook.Api.Database.Context;

namespace RecipeBook.Api.App.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class RecipesController : ControllerBase
{
    private readonly RecipeBookDbContext context;

    public RecipesController(RecipeBookDbContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
    {
        var recipes = await context.Recipes
            .Include(recipe => recipe.Ingredients)
            .AsNoTracking()
            .OrderBy(recipe => recipe.Id)
            .ToListAsync();

        OrderIngredients(recipes);
        return Ok(recipes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Recipe>> GetRecipe(int id)
    {
        var recipe = await context.Recipes
            .Include(recipe => recipe.Ingredients)
            .AsNoTracking()
            .FirstOrDefaultAsync(recipe => recipe.Id == id);

        if (recipe is null)
        {
            return NotFound();
        }

        OrderIngredients(recipe);
        return Ok(recipe);
    }

    [HttpPost]
    public async Task<ActionResult<Recipe>> CreateRecipe(RecipeRequest request)
    {
        var recipe = new Recipe
        {
            Name = request.Name!.Trim(),
            Description = NormalizeOptionalText(request.Description),
            PreparationTime = request.PreparationTime!.Value,
            CookingTime = request.CookingTime!.Value,
            Ingredients = MapIngredients(request.Ingredients),
        };

        context.Recipes.Add(recipe);
        await context.SaveChangesAsync();

        return Created($"/api/recipes/{recipe.Id}", recipe);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRecipe(int id, RecipeRequest request)
    {
        var recipe = await context.Recipes
            .Include(item => item.Ingredients)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (recipe is null)
        {
            return NotFound();
        }

        recipe.Name = request.Name!.Trim();
        recipe.Description = NormalizeOptionalText(request.Description);
        recipe.PreparationTime = request.PreparationTime!.Value;
        recipe.CookingTime = request.CookingTime!.Value;
        recipe.Ingredients.Clear();
        recipe.Ingredients.AddRange(MapIngredients(request.Ingredients));

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var recipe = await context.Recipes.FindAsync(id);

        if (recipe is null)
        {
            return NotFound();
        }

        context.Recipes.Remove(recipe);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static List<RecipeIngredient> MapIngredients(IEnumerable<RecipeIngredientRequest> ingredients)
    {
        return ingredients
            .Select((ingredient, index) => new RecipeIngredient
            {
                Name = ingredient.Name!.Trim(),
                Unit = NormalizeOptionalText(ingredient.Unit),
                Quantity = ingredient.Quantity!.Value,
                Position = index,
            })
            .ToList();
    }

    private static void OrderIngredients(Recipe recipe)
    {
        recipe.Ingredients = recipe.Ingredients
            .OrderBy(ingredient => ingredient.Position)
            .ToList();
    }

    private static void OrderIngredients(IEnumerable<Recipe> recipes)
    {
        foreach (var recipe in recipes)
        {
            OrderIngredients(recipe);
        }
    }
}
