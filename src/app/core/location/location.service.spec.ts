import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Geolocation } from '@capacitor/geolocation';
import { LocationService } from './location.service';
import { environment } from '@env/environment';

describe('LocationService', () => {
  let service: LocationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get location', () => {
    it('queries for the current position', async () => {
      spyOn(Geolocation, 'getCurrentPosition').and.callThrough();
      await service.getCurrentLocation();
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });

    describe('when successful', () => {
      beforeEach(() => {
        spyOn(Geolocation, 'getCurrentPosition').and.resolveTo({
          timestamp: 1657819201229,
          coords: {
            accuracy: 328,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: 2.3,
            latitude: 19.29404,
            longitude: -76.9934,
          },
        });
      });

      it('resolves the coordinates of the position', async () => {
        const loc = await service.getCurrentLocation();
        expect(loc).toEqual({
          latitude: 19.29404,
          longitude: -76.9934,
        });
      });
    });

    describe('when failed', () => {
      beforeEach(() => {
        spyOn(Geolocation, 'getCurrentPosition').and.rejectWith(null);
      });

      it('returns the default position', async () => {
        const loc = await service.getCurrentLocation();
        expect(loc).toEqual({
          latitude: 43.074085,
          longitude: -89.381027,
        });
      });
    });
  });

  describe('get location name', () => {
    it('gets the tea categories', () => {
      service.getLocationName({ latitude: 43.45993, longitude: -76.2435 }).subscribe();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/geo/1.0/reverse?lat=43.45993&lon=-76.2435&appid=${environment.apiKey}`
      );
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });

    it('returns the city and the postal abbreviation', () => {
      let res = '';
      service.getLocationName({ latitude: 43.45993, longitude: -76.2435 }).subscribe((x) => (res = x));
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/geo/1.0/reverse?lat=43.45993&lon=-76.2435&appid=${environment.apiKey}`
      );
      req.flush([{ name: 'Bismark', state: 'South Dakota', country: 'United States' }]);
      expect(res).toEqual('Bismark, SD');
    });

    it('returns the city and the country if there is no state', () => {
      let res = '';
      service.getLocationName({ latitude: 43.45993, longitude: -76.2435 }).subscribe((x) => (res = x));
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/geo/1.0/reverse?lat=43.45993&lon=-76.2435&appid=${environment.apiKey}`
      );
      req.flush([{ name: 'London', country: 'England' }]);
      expect(res).toEqual('London, England');
    });

    it('returns unknown if there is no data', () => {
      let res = '';
      service.getLocationName({ latitude: 43.45993, longitude: -76.2435 }).subscribe((x) => (res = x));
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/geo/1.0/reverse?lat=43.45993&lon=-76.2435&appid=${environment.apiKey}`
      );
      req.flush([]);
      expect(res).toEqual('Unknown');
    });
  });
});
