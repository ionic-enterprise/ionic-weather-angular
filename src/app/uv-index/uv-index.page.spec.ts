import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WeatherService } from '@app/core';
import { createWeatherServiceMock } from '@app/core/testing';
import { UVIndexPage } from './uv-index.page';

describe('UVIndexPage', () => {
  let component: UVIndexPage;
  let fixture: ComponentFixture<UVIndexPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UVIndexPage],
    })
      .overrideProvider(WeatherService, { useFactory: createWeatherServiceMock })
      .compileComponents();

    fixture = TestBed.createComponent(UVIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
