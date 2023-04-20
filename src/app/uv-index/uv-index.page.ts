import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '@app/core';
import { CsdemoWeatherWidgetsModule } from '@ionic-enterprise/cs-demo-weather-widgets-angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-uv-index',
  templateUrl: 'uv-index.page.html',
  styleUrls: ['uv-index.page.scss'],
  standalone: true,
  imports: [CommonModule, CsdemoWeatherWidgetsModule, FormsModule, IonicModule],
})
export class UVIndexPage {
  data$ = this.weather.currentData$;

  constructor(private weather: WeatherService) {}

  advice(uvIndex: number): string {
    return this.weather.uvAdvice(uvIndex);
  }
}
