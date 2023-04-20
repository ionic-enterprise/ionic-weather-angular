import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '@app/core';
import { CsdemoWeatherWidgetsModule } from '@ionic-enterprise/cs-demo-weather-widgets-angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-forecast',
  templateUrl: 'forecast.page.html',
  styleUrls: ['forecast.page.scss'],
  standalone: true,
  imports: [CommonModule, CsdemoWeatherWidgetsModule, FormsModule, IonicModule],
})
export class ForecastPage {
  scale = 'F';
  data$ = this.weather.currentData$;

  constructor(private weather: WeatherService) {}
}
