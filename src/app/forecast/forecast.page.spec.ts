import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WeatherService } from '@app/core';
import { createWeatherServiceMock } from '@app/core/testing';
import { IonicModule } from '@ionic/angular';
import { ForecastPage } from './forecast.page';

describe('ForecastPage', () => {
  let component: ForecastPage;
  let fixture: ComponentFixture<ForecastPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastPage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: WeatherService, useFactory: createWeatherServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
