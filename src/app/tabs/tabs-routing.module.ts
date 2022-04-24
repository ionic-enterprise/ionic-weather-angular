import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'current-weather',
        loadChildren: () => import('../current-weather/current-weather.module').then((m) => m.CurrentWeatherPageModule),
      },
      {
        path: 'forecast',
        loadChildren: () => import('../forecast/forecast.module').then((m) => m.ForecastPageModule),
      },
      {
        path: 'air-quality',
        loadChildren: () => import('../air-quality/air-quality.module').then((m) => m.AirQualityPageModule),
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
