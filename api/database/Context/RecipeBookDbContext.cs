using Microsoft.EntityFrameworkCore;
using RecipeBook.Api.App.Models;

namespace RecipeBook.Api.Database.Context
{
    public class RecipeBookDbContext : DbContext
    {
        public RecipeBookDbContext(DbContextOptions<RecipeBookDbContext> options) : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>(recipe =>
            {
                recipe.Property(item => item.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                recipe.Property(item => item.Description)
                    .HasMaxLength(1000);

                recipe.ToTable(table =>
                {
                    table.HasCheckConstraint(
                        "CK_Recipes_PreparationTime_NonNegative",
                        "\"PreparationTime\" >= 0");

                    table.HasCheckConstraint(
                        "CK_Recipes_CookingTime_NonNegative",
                        "\"CookingTime\" >= 0");
                });
            });
        }
    }
}
