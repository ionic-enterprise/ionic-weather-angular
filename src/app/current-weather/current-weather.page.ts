import { Component } from '@angular/core';
import { WeatherService } from '@app/core';

@Component({
  selector: 'app-current-weather',
  templateUrl: 'current-weather.page.html',
  styleUrls: ['current-weather.page.scss'],
})
export class CurrentWeatherPage {
  scale = 'F';
  data$ = this.weather.currentData$;

  constructor(private weather: WeatherService) {}
}
