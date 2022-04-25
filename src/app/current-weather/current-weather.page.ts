import { Component } from '@angular/core';
import { WeatherService } from '@app/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-current-weather',
  templateUrl: 'current-weather.page.html',
  styleUrls: ['current-weather.page.scss'],
})
export class CurrentWeatherPage {
  scale = 'F';
  data$ = this.weather.currentData$;
  icons = environment.icons;

  constructor(private weather: WeatherService) {}
}
