import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocationService } from '../location/location.service';
import { createLocationServiceMock } from '../testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const locationService = createLocationServiceMock();
    (locationService.getCurrentLocation as jasmine.Spy).and.resolveTo({ latitude: 0, longitude: 0 });
    (locationService.getLocationName as jasmine.Spy).and.returnValue(of('Madison, WI'));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LocationService, useValue: locationService }],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
