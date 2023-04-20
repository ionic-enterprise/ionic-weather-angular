import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'current-weather',
        loadComponent: () => import('../current-weather/current-weather.page').then((m) => m.CurrentWeatherPage),
      },
      {
        path: 'forecast',
        loadComponent: () => import('../forecast/forecast.page').then((m) => m.ForecastPage),
      },
      {
        path: 'uv-index',
        loadComponent: () => import('../uv-index/uv-index.page').then((m) => m.UVIndexPage),
      },
      {
        path: '',
        redirectTo: '/tabs/current-weather',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/current-weather',
    pathMatch: 'full',
  },
];
