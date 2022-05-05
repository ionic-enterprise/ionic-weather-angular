import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WeatherService } from '@app/core';
import { createWeatherServiceMock } from '@app/core/testing';
import { IonicModule } from '@ionic/angular';
import { CurrentWeatherPage } from './current-weather.page';

describe('CurrentWeatherPage', () => {
  let component: CurrentWeatherPage;
  let fixture: ComponentFixture<CurrentWeatherPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentWeatherPage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: WeatherService, useFactory: createWeatherServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentWeatherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
