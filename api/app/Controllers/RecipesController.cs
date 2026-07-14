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
            .AsNoTracking()
            .OrderBy(recipe => recipe.Id)
            .ToListAsync();

        return Ok(recipes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Recipe>> GetRecipe(int id)
    {
        var recipe = await context.Recipes
            .AsNoTracking()
            .FirstOrDefaultAsync(recipe => recipe.Id == id);

        if (recipe is null)
        {
            return NotFound();
        }

        return Ok(recipe);
    }

    [HttpPost]
    public async Task<ActionResult<Recipe>> CreateRecipe(CreateRecipeRequest request)
    {
        var recipe = new Recipe
        {
            Name = request.Name!.Trim(),
            Description = NormalizeOptionalText(request.Description),
            PreparationTime = request.PreparationTime!.Value,
            CookingTime = request.CookingTime!.Value,
        };

        context.Recipes.Add(recipe);
        await context.SaveChangesAsync();

        return Created($"/api/recipes/{recipe.Id}", recipe);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRecipe(int id, UpdateRecipeRequest request)
    {
        var recipe = await context.Recipes.FindAsync(id);

        if (recipe is null)
        {
            return NotFound();
        }

        recipe.Name = request.Name!.Trim();
        recipe.Description = NormalizeOptionalText(request.Description);
        recipe.PreparationTime = request.PreparationTime!.Value;
        recipe.CookingTime = request.CookingTime!.Value;

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
}
