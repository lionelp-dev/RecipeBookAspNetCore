using RecipeBook.Api.App.Models;
using RecipeBook.Api.Database.Context;

namespace RecipeBook.Api.Database.Seeders;

public static class DbInitializer
{
    public static void Initialize(RecipeBookDbContext context)
    {
        if (context.Recipes.Any())
        {
            return;
        }

        var recipes = new Recipe[]
        {
            new()
            {
                Name = "Hachis parmentier",
                Description = "Un gratin familial composé de viande de bœuf et d'une purée de pommes de terre onctueuse."
            },
            new()
            {
                Name = "Blanquette de veau",
                Description = "Un mijoté de veau accompagné de légumes et d'une sauce blanche crémeuse."
            },
            new()
            {
                Name = "Gratin dauphinois",
                Description = "De fines rondelles de pommes de terre cuites lentement dans une crème parfumée à l'ail."
            },
            new()
            {
                Name = "Croque-monsieur",
                Description = "Un sandwich chaud et croustillant garni de jambon, de fromage et de béchamel."
            },
            new()
            {
                Name = "Bœuf bourguignon",
                Description = "Du bœuf mijoté au vin rouge avec des carottes, des champignons et des petits oignons."
            },
            new()
            {
                Name = "Galettes de pommes de terre",
                Description = "Des galettes dorées et croustillantes à base de pommes de terre râpées."
            },
            new()
            {
                Name = "Poulet basquaise",
                Description = "Du poulet mijoté avec des poivrons, des tomates, des oignons et des aromates."
            },
            new()
            {
                Name = "Gratin de courgettes",
                Description = "Des courgettes fondantes gratinées au four avec de la crème et du fromage."
            },
            new()
            {
                Name = "Clafoutis aux cerises",
                Description = "Un dessert moelleux aux cerises recouvertes d'une pâte légère proche du flan."
            },
            new()
            {
                Name = "Mousse au chocolat",
                Description = "Une mousse aérienne et gourmande préparée avec du chocolat noir."
            }
        };

        context.Recipes.AddRange(recipes);
        context.SaveChanges();
    }
}
