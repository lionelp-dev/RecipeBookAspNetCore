import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Mock, vi } from 'vitest';
import { Recipe, RecipeService } from '../../features/recipe/recipe.service';
import { HomePage } from './home';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let recipesSubject: Subject<Recipe[]>;
  let getRecipes: Mock<() => Observable<Recipe[]>>;

  beforeEach(async () => {
    recipesSubject = new Subject<Recipe[]>();
    getRecipes = vi.fn(() => recipesSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([]), { provide: RecipeService, useValue: { getRecipes } }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
  });

  it('should render the application layout and loading state', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-testid="desktop-sidebar"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="top-bar"]')).toBeTruthy();
    expect(element.querySelector('main')).toBeTruthy();
    expect(element.querySelector('[data-testid="loading-state"]')).toBeTruthy();
  });

  it('should open and close the mobile sidebar', () => {
    const element = fixture.nativeElement as HTMLElement;
    const menuButton = element.querySelector<HTMLButtonElement>('[data-testid="menu-button"]');

    menuButton?.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="mobile-sidebar"]')).toBeTruthy();

    element.querySelector<HTMLButtonElement>('[data-testid="close-sidebar-button"]')?.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="mobile-sidebar"]')).toBeNull();

    menuButton?.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('[data-testid="sidebar-backdrop"]')?.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="mobile-sidebar"]')).toBeNull();

    menuButton?.click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="mobile-sidebar"]')).toBeNull();
  });

  it('should render recipes returned by the service', () => {
    recipesSubject.next([
      {
        id: 1,
        name: 'Soupe de tomates',
        description: 'Une soupe maison.',
        preparationTime: 15,
        cookingTime: 30,
      },
      {
        id: 2,
        name: 'Tarte aux pommes',
        description: null,
        preparationTime: 20,
        cookingTime: 40,
      },
    ]);
    recipesSubject.complete();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('article')).toHaveLength(2);
    expect(element.textContent).toContain('Soupe de tomates');
    expect(element.textContent).toContain('2 recettes');
    expect(element.textContent).toContain('Aucune description disponible.');
  });

  it('should render an empty state', () => {
    recipesSubject.next([]);
    recipesSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="empty-state"]')).toBeTruthy();
  });

  it('should show an error and retry the request', () => {
    fixture.destroy();
    getRecipes
      .mockReset()
      .mockReturnValueOnce(throwError(() => new Error('API unavailable')))
      .mockReturnValueOnce(of([]));

    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-testid="error-state"]')).toBeTruthy();

    element.querySelector<HTMLButtonElement>('[data-testid="error-state"] button')?.click();
    fixture.detectChanges();

    expect(getRecipes).toHaveBeenCalledTimes(2);
    expect(element.querySelector('[data-testid="empty-state"]')).toBeTruthy();
  });

  it('should refresh the recipes', () => {
    recipesSubject.next([]);
    recipesSubject.complete();
    fixture.detectChanges();

    getRecipes.mockReturnValueOnce(of([]));
    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
    );
    buttons.find((button) => button.textContent?.includes('Actualiser'))?.click();
    fixture.detectChanges();

    expect(getRecipes).toHaveBeenCalledTimes(2);
  });
});
