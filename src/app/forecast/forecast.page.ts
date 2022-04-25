import { Component } from '@angular/core';
import { WeatherService } from '@app/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-forecast',
  templateUrl: 'forecast.page.html',
  styleUrls: ['forecast.page.scss'],
})
export class ForecastPage {
  scale = 'F';
  data$ = this.weather.currentData$;
  icons = environment.icons;

  constructor(private weather: WeatherService) {}
}
