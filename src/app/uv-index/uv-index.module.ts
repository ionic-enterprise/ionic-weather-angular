import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CsdemoWeatherWidgetsModule } from '@ionic-enterprise/cs-demo-weather-widgets-angular';
import { IonicModule } from '@ionic/angular';
import { UVIndexPageRoutingModule } from './uv-index-routing.module';
import { UVIndexPage } from './uv-index.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    CsdemoWeatherWidgetsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: UVIndexPage }]),
    UVIndexPageRoutingModule,
  ],
  declarations: [UVIndexPage],
})
export class UVIndexPageModule {}
