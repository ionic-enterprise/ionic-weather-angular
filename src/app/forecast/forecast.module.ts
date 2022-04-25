import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CsdemoWeatherWidgetsModule } from '@ionic-enterprise/cs-demo-weather-widgets-angular';
import { IonicModule } from '@ionic/angular';
import { ForecastPageRoutingModule } from './forecast-routing.module';
import { ForecastPage } from './forecast.page';

@NgModule({
  imports: [IonicModule, CommonModule, CsdemoWeatherWidgetsModule, FormsModule, ForecastPageRoutingModule],
  declarations: [ForecastPage],
})
export class ForecastPageModule {}
