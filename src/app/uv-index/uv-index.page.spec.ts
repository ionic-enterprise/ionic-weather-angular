import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WeatherService } from '@app/core';
import { createWeatherServiceMock } from '@app/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { UVIndexPage } from './uv-index.page';

describe('UVIndexPage', () => {
  let component: UVIndexPage;
  let fixture: ComponentFixture<UVIndexPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UVIndexPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
      providers: [{ provide: WeatherService, useFactory: createWeatherServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UVIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
