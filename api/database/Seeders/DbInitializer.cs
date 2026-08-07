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
                Description = "Un gratin familial composé de viande de bœuf et d'une purée de pommes de terre onctueuse.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Bœuf haché", Quantity = 500, Unit = "g" },
                    new RecipeIngredient { Position = 1, Name = "Pommes de terre", Quantity = 1, Unit = "kg" },
                    new RecipeIngredient { Position = 2, Name = "Lait", Quantity = 20, Unit = "cl" },
                    new RecipeIngredient { Position = 3, Name = "Beurre", Quantity = 30, Unit = "g" },
                    new RecipeIngredient { Position = 4, Name = "Oignon", Quantity = 1, Unit = null }
                }
            },
            new()
            {
                Name = "Blanquette de veau",
                Description = "Un mijoté de veau accompagné de légumes et d'une sauce blanche crémeuse.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Veau", Quantity = 800, Unit = "g" },
                    new RecipeIngredient { Position = 1, Name = "Carottes", Quantity = 3, Unit = null },
                    new RecipeIngredient { Position = 2, Name = "Champignons de Paris", Quantity = 250, Unit = "g" },
                    new RecipeIngredient { Position = 3, Name = "Oignon", Quantity = 1, Unit = null },
                    new RecipeIngredient { Position = 4, Name = "Crème fraîche", Quantity = 20, Unit = "cl" }
                }
            },
            new()
            {
                Name = "Gratin dauphinois",
                Description = "De fines rondelles de pommes de terre cuites lentement dans une crème parfumée à l'ail.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Pommes de terre", Quantity = 1.2m, Unit = "kg" },
                    new RecipeIngredient { Position = 1, Name = "Crème liquide", Quantity = 40, Unit = "cl" },
                    new RecipeIngredient { Position = 2, Name = "Lait", Quantity = 20, Unit = "cl" },
                    new RecipeIngredient { Position = 3, Name = "Ail", Quantity = 2, Unit = "gousses" },
                    new RecipeIngredient { Position = 4, Name = "Noix de muscade", Quantity = 1, Unit = "pincée" }
                }
            },
            new()
            {
                Name = "Croque-monsieur",
                Description = "Un sandwich chaud et croustillant garni de jambon, de fromage et de béchamel.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Pain de mie", Quantity = 8, Unit = "tranches" },
                    new RecipeIngredient { Position = 1, Name = "Jambon", Quantity = 4, Unit = "tranches" },
                    new RecipeIngredient { Position = 2, Name = "Fromage râpé", Quantity = 150, Unit = "g" },
                    new RecipeIngredient { Position = 3, Name = "Béchamel", Quantity = 20, Unit = "cl" }
                }
            },
            new()
            {
                Name = "Bœuf bourguignon",
                Description = "Du bœuf mijoté au vin rouge avec des carottes, des champignons et des petits oignons.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Bœuf", Quantity = 800, Unit = "g" },
                    new RecipeIngredient { Position = 1, Name = "Vin rouge", Quantity = 75, Unit = "cl" },
                    new RecipeIngredient { Position = 2, Name = "Carottes", Quantity = 4, Unit = null },
                    new RecipeIngredient { Position = 3, Name = "Champignons", Quantity = 200, Unit = "g" },
                    new RecipeIngredient { Position = 4, Name = "Oignons grelots", Quantity = 12, Unit = null }
                }
            },
            new()
            {
                Name = "Galettes de pommes de terre",
                Description = "Des galettes dorées et croustillantes à base de pommes de terre râpées.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Pommes de terre", Quantity = 800, Unit = "g" },
                    new RecipeIngredient { Position = 1, Name = "Œufs", Quantity = 2, Unit = null },
                    new RecipeIngredient { Position = 2, Name = "Farine", Quantity = 50, Unit = "g" },
                    new RecipeIngredient { Position = 3, Name = "Oignon", Quantity = 1, Unit = null },
                    new RecipeIngredient { Position = 4, Name = "Sel", Quantity = 1, Unit = "pincée" }
                }
            },
            new()
            {
                Name = "Poulet basquaise",
                Description = "Du poulet mijoté avec des poivrons, des tomates, des oignons et des aromates.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Poulet", Quantity = 4, Unit = "morceaux" },
                    new RecipeIngredient { Position = 1, Name = "Poivrons", Quantity = 3, Unit = null },
                    new RecipeIngredient { Position = 2, Name = "Tomates", Quantity = 4, Unit = null },
                    new RecipeIngredient { Position = 3, Name = "Oignon", Quantity = 1, Unit = null },
                    new RecipeIngredient { Position = 4, Name = "Ail", Quantity = 2, Unit = "gousses" }
                }
            },
            new()
            {
                Name = "Gratin de courgettes",
                Description = "Des courgettes fondantes gratinées au four avec de la crème et du fromage.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Courgettes", Quantity = 4, Unit = null },
                    new RecipeIngredient { Position = 1, Name = "Crème fraîche", Quantity = 20, Unit = "cl" },
                    new RecipeIngredient { Position = 2, Name = "Fromage râpé", Quantity = 100, Unit = "g" },
                    new RecipeIngredient { Position = 3, Name = "Ail", Quantity = 1, Unit = "gousse" }
                }
            },
            new()
            {
                Name = "Clafoutis aux cerises",
                Description = "Un dessert moelleux aux cerises recouvertes d'une pâte légère proche du flan.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Cerises", Quantity = 400, Unit = "g" },
                    new RecipeIngredient { Position = 1, Name = "Lait", Quantity = 25, Unit = "cl" },
                    new RecipeIngredient { Position = 2, Name = "Farine", Quantity = 80, Unit = "g" },
                    new RecipeIngredient { Position = 3, Name = "Œufs", Quantity = 3, Unit = null },
                    new RecipeIngredient { Position = 4, Name = "Sucre", Quantity = 80, Unit = "g" }
                }
            },
            new()
            {
                Name = "Mousse au chocolat",
                Description = "Une mousse aérienne et gourmande préparée avec du chocolat noir.",
                Ingredients =
                {
                    new RecipeIngredient { Position = 0, Name = "Chocolat noir", Quantity = 200, Unit = "g" },
                    new RecipeIngredient { Position = 1, Name = "Œufs", Quantity = 4, Unit = null },
                    new RecipeIngredient { Position = 2, Name = "Sucre", Quantity = 30, Unit = "g" },
                    new RecipeIngredient { Position = 3, Name = "Beurre", Quantity = 20, Unit = "g" }
                }
            }
        };

        context.Recipes.AddRange(recipes);
        context.SaveChanges();
    }
}
