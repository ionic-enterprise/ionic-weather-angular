import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { CurrentWeatherPageRoutingModule } from './current-weather-routing.module';
import { CurrentWeatherPage } from './current-weather.page';

@NgModule({
  imports: [CommonModule, CurrentWeatherPageRoutingModule, ExploreContainerComponentModule, FormsModule, IonicModule],
  declarations: [CurrentWeatherPage],
})
export class CurrentWeatherPageModule {}
