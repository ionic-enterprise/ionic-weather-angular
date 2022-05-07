import { Component } from '@angular/core';
import { WeatherService } from '@app/core';

@Component({
  selector: 'app-uv-index',
  templateUrl: 'uv-index.page.html',
  styleUrls: ['uv-index.page.scss'],
})
export class UVIndexPage {
  data$ = this.weather.currentData$;

  constructor(private weather: WeatherService) {}

  advice(uvIndex: number): string {
    return this.weather.uvAdvice(uvIndex);
  }
}
