import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  constructor(private weather: WeatherService) {}

  ngOnDestroy(): void {
    this.weather.stopRefreshTimer();
  }

  ngOnInit(): void {
    this.weather.initialize();
    this.weather.startRefreshTimer();
  }
}
