import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UVIndexPage } from './uv-index.page';

const routes: Routes = [
  {
    path: '',
    component: UVIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UVIndexPageRoutingModule {}
