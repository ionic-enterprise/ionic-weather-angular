import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WeatherService } from '@app/core';
import { createWeatherServiceMock } from '@app/core/testing';

import { CurrentWeatherPage } from './current-weather.page';
describe('CurrentWeatherPage', () => {
  let component: CurrentWeatherPage;
  let fixture: ComponentFixture<CurrentWeatherPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CurrentWeatherPage],
    })
      .overrideProvider(WeatherService, { useFactory: createWeatherServiceMock })
      .compileComponents();

    fixture = TestBed.createComponent(CurrentWeatherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
