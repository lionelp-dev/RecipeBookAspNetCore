import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Recipe, RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(RecipeService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should get recipes from the API', () => {
    const recipes: Recipe[] = [
      {
        id: 1,
        name: 'Soupe de tomates',
        description: 'Une soupe maison.',
        preparationTime: 15,
        cookingTime: 30,
      },
    ];

    service.getRecipes().subscribe((result) => expect(result).toEqual(recipes));

    const request = httpTesting.expectOne('/api/recipes');
    expect(request.request.method).toBe('GET');
    request.flush(recipes);
  });
});
