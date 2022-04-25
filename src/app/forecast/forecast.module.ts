import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForecastPage } from './forecast.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ForecastPageRoutingModule } from './forecast-routing.module';
import { CsdemoWeatherWidgetsModule } from '@ionic-enterprise/cs-demo-weather-widgets-angular';

@NgModule({
  imports: [IonicModule, CommonModule, CsdemoWeatherWidgetsModule, FormsModule, ForecastPageRoutingModule],
  declarations: [ForecastPage],
})
export class ForecastPageModule {}
