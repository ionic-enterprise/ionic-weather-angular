import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirQualityPage } from './air-quality.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AirQualityPageRoutingModule } from './air-quality-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: AirQualityPage }]),
    AirQualityPageRoutingModule,
  ],
  declarations: [AirQualityPage],
})
export class AirQualityPageModule {}
