import { Component } from '@angular/core';
import { WeatherService } from '@app/core';

@Component({
  selector: 'app-forecast',
  templateUrl: 'forecast.page.html',
  styleUrls: ['forecast.page.scss'],
})
export class ForecastPage {
  constructor(private weather: WeatherService) {
    this.weather.currentData$.subscribe(console.log);
  }
}
