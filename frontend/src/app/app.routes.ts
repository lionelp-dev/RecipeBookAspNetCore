import { Routes } from '@angular/router';
import { CreateRecipePage } from './pages/create-recipe/create-recipe';
import { EditRecipePage } from './pages/edit-recipe/edit-recipe';

export const routes: Routes = [
  {
    path: 'recipes/create',
    component: CreateRecipePage,
  },
  {
    path: 'recipes/:id/edit',
    component: EditRecipePage,
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((component) => component.HomePage),
  },
];
