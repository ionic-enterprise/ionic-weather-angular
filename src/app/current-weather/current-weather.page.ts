import { Component } from '@angular/core';
import { WeatherService } from '@app/core';

@Component({
  selector: 'app-current-weather',
  templateUrl: 'current-weather.page.html',
  styleUrls: ['current-weather.page.scss'],
})
export class CurrentWeatherPage {
  constructor(private weather: WeatherService) {
    this.weather.currentData$.subscribe(console.log);
  }
}
