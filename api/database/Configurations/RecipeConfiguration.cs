using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeBook.Api.App.Models;

namespace RecipeBook.Api.Database.Configurations;

public sealed class RecipeConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> recipe)
    {
        recipe.Property(item => item.Name)
            .IsRequired()
            .HasMaxLength(100);

        recipe.Property(item => item.Description)
            .HasMaxLength(1000);

        recipe.HasMany(item => item.Ingredients)
            .WithOne()
            .HasForeignKey(item => item.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        recipe.ToTable(table =>
        {
            table.HasCheckConstraint(
                "CK_Recipes_PreparationTime_NonNegative",
                "\"PreparationTime\" >= 0");

            table.HasCheckConstraint(
                "CK_Recipes_CookingTime_NonNegative",
                "\"CookingTime\" >= 0");
        });
    }
}
