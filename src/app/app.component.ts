import { Component, OnInit } from '@angular/core';
import { WeatherService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private weather: WeatherService) {}

  ngOnInit(): void {
    this.weather.initialize();
  }
}
