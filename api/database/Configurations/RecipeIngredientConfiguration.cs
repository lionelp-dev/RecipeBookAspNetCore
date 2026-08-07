using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeBook.Api.App.Models;

namespace RecipeBook.Api.Database.Configurations;

public sealed class RecipeIngredientConfiguration : IEntityTypeConfiguration<RecipeIngredient>
{
    public void Configure(EntityTypeBuilder<RecipeIngredient> recipeIngredient)
    {
        recipeIngredient.Property(item => item.Name)
            .IsRequired()
            .HasMaxLength(100);

        recipeIngredient.Property(item => item.Unit)
            .HasMaxLength(50);

        recipeIngredient.Property(item => item.Quantity)
            .IsRequired()
            .HasColumnType("TEXT");

        recipeIngredient.HasIndex(item => new { item.RecipeId, item.Position })
            .IsUnique();

        recipeIngredient.ToTable(table =>
        {
            table.HasCheckConstraint(
                "CK_RecipeIngredients_Quantity_Positive",
                "\"Quantity\" > 0");
        });
    }
}
