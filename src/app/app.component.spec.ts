import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { WeatherService } from './core';
import { createWeatherServiceMock } from './core/testing';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: WeatherService, useFactory: createWeatherServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('initializes the weather service', () => {
    const weather = TestBed.inject(WeatherService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(weather.initialize).toHaveBeenCalledTimes(1);
  });

  it('starts the refresh timer on the weather service', () => {
    const weather = TestBed.inject(WeatherService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(weather.startRefreshTimer).toHaveBeenCalledTimes(1);
  });

  describe('on destroy', () => {
    it('stops the refresh timer on the weather service', () => {
      const weather = TestBed.inject(WeatherService);
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      app.ngOnDestroy();
      expect(weather.stopRefreshTimer).toHaveBeenCalledTimes(1);
    });
  });
});
