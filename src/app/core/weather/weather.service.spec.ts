import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CurrentWeather } from '@app/models';
import { environment } from '@env/environment';
import { of } from 'rxjs';
import { LocationService } from '../location/location.service';
import { createLocationServiceMock } from '../testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;
  let rawWeather: any;
  let rawForecast: any;

  beforeEach(() => {
    const locationService = createLocationServiceMock();
    (locationService.getCurrentLocation as jasmine.Spy).and.resolveTo({ latitude: 0, longitude: 0 });
    (locationService.getLocationName as jasmine.Spy).and.returnValue(of('Madison, WI'));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LocationService, useValue: locationService }],
    });
    initializeTestData();
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    beforeEach(() => {
      const location = TestBed.inject(LocationService);
      (location.getCurrentLocation as jasmine.Spy).and.resolveTo({ latitude: 42.73, longitude: -89.43 });
      (location.getLocationName as jasmine.Spy).and.returnValue(of('South Padre Island, TX'));
    });

    it('gets the current location', fakeAsync(() => {
      const location = TestBed.inject(LocationService);
      service.initialize();
      tick();
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(1);
    }));

    it('gets the current weather and forecast data', fakeAsync(() => {
      service.initialize();
      tick();
      const forecastReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/forecast?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      const weatherReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/weather?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      expect(forecastReq.request.method).toEqual('GET');
      expect(weatherReq.request.method).toEqual('GET');
      httpTestingController.verify();
    }));

    it('merges the location name', fakeAsync(() => {
      const location = TestBed.inject(LocationService);
      service.initialize();
      tick();
      const forecastReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/forecast?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      const weatherReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/weather?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      forecastReq.flush(rawForecast);
      weatherReq.flush(rawWeather);
      expect(location.getLocationName).toHaveBeenCalledTimes(1);
    }));

    it('emits the converted data', fakeAsync(() => {
      let res: CurrentWeather;
      service.currentData$.subscribe((w) => (res = w));
      service.initialize();
      tick();
      const forecastReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/forecast?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      const weatherReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/weather?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      forecastReq.flush(rawForecast);
      weatherReq.flush(rawWeather);
      expect(res).toEqual({
        locationName: 'South Padre Island, TX',
        condition: 800,
        temperature: 301.34,
        uvIndex: jasmine.any(Number),
        forecasts: [
          {
            date: new Date(1749502800000),
            low: 301.36,
            high: 301.41,
            condition: 800,
          },
          {
            date: new Date(1749513600000),
            low: 301.24,
            high: 301.27,
            condition: 800,
          },
          {
            date: new Date(1749524400000),
            low: 300.97,
            high: 300.97,
            condition: 800,
          },
          {
            date: new Date(1749535200000),
            low: 300.96,
            high: 300.96,
            condition: 801,
          },
          {
            date: new Date(1749546000000),
            low: 301.02,
            high: 301.02,
            condition: 804,
          },
          {
            date: new Date(1749556800000),
            low: 301,
            high: 301,
            condition: 804,
          },
          {
            date: new Date(1749567600000),
            low: 301.25,
            high: 301.25,
            condition: 802,
          },
          {
            date: new Date(1749578400000),
            low: 301.36,
            high: 301.36,
            condition: 803,
          },
          {
            date: new Date(1749589200000),
            low: 301.43,
            high: 301.43,
            condition: 804,
          },
          {
            date: new Date(1749600000000),
            low: 301.32,
            high: 301.32,
            condition: 803,
          },
        ],
      });
    }));
  });

  describe('start refresh timer', () => {
    beforeEach(() => {
      const location = TestBed.inject(LocationService);
      (location.getCurrentLocation as jasmine.Spy).and.resolveTo({ latitude: 42.73, longitude: -89.43 });
      (location.getLocationName as jasmine.Spy).and.returnValue(of('South Padre Island, TX'));
    });

    it('creates a 15 minute refresh', fakeAsync(() => {
      const location = TestBed.inject(LocationService);
      service.initialize();
      tick();
      const forecastReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/forecast?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      const weatherReq = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/weather?lat=42.73&lon=-89.43&appid=${environment.apiKey}`,
      );
      forecastReq.flush(rawForecast);
      weatherReq.flush(rawWeather);
      service.startRefreshTimer();
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(1);
      tick(14 * 60 * 1000 + 59999);
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(1);
      tick(1);
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(2);
      tick(14 * 60 * 1000 + 59999);
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(2);
      tick(1);
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(3);
      tick(14 * 60 * 1000 + 59999);
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(3);
      tick(1);
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(4);
      service.stopRefreshTimer();
    }));
  });

  describe('UV advice', () => {
    it('returns correct advice for 0 .. <3', () => {
      expect(service.uvAdvice(0)).toContain('Wear sunglasses on bright days.');
      expect(service.uvAdvice(2.99)).toContain('Wear sunglasses on bright days.');
    });
    it('returns correct advice for 3 .. < 6', () => {
      expect(service.uvAdvice(3)).toContain('Stay in the shade near midday when the sun is strongest.');
      expect(service.uvAdvice(5.99)).toContain('Stay in the shade near midday when the sun is strongest.');
    });
    it('returns correct advice for 6 .. < 8', () => {
      expect(service.uvAdvice(6)).toContain('Reduce time in the sun between 10 a.m. and 4 p.m.');
      expect(service.uvAdvice(7.99)).toContain('Reduce time in the sun between 10 a.m. and 4 p.m.');
    });
    it('returns correct advice for 8 .. < 11', () => {
      expect(service.uvAdvice(8)).toContain('Minimize sun exposure between 10 a.m. and 4 p.m.');
      expect(service.uvAdvice(10.99)).toContain('Minimize sun exposure between 10 a.m. and 4 p.m.');
    });
    it('returns correct advice for 11 and higher', () => {
      expect(service.uvAdvice(11)).toContain('Try to avoid sun exposure between 10 a.m. and 4 p.m.');
    });
  });

  const initializeTestData = () => {
    rawForecast = {
      cod: '200',
      message: 0,
      cnt: 40,
      list: [
        {
          dt: 1749502800,
          main: {
            temp: 301.36,
            feels_like: 305.95,
            temp_min: 301.36,
            temp_max: 301.41,
            pressure: 1012,
            sea_level: 1012,
            grnd_level: 1010,
            humidity: 81,
            temp_kf: -0.05,
          },
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
          clouds: {
            all: 10,
          },
          wind: {
            speed: 7.53,
            deg: 154,
            gust: 8.44,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'd',
          },
          dt_txt: '2025-06-09 21:00:00',
        },
        {
          dt: 1749513600,
          main: {
            temp: 301.27,
            feels_like: 306.05,
            temp_min: 301.24,
            temp_max: 301.27,
            pressure: 1011,
            sea_level: 1011,
            grnd_level: 1010,
            humidity: 83,
            temp_kf: 0.03,
          },
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
          clouds: {
            all: 10,
          },
          wind: {
            speed: 6.31,
            deg: 143,
            gust: 7.52,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'd',
          },
          dt_txt: '2025-06-10 00:00:00',
        },
        {
          dt: 1749524400,
          main: {
            temp: 300.97,
            feels_like: 305.85,
            temp_min: 300.97,
            temp_max: 300.97,
            pressure: 1011,
            sea_level: 1011,
            grnd_level: 1011,
            humidity: 87,
            temp_kf: 0,
          },
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01n',
            },
          ],
          clouds: {
            all: 0,
          },
          wind: {
            speed: 7.14,
            deg: 136,
            gust: 9.09,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'n',
          },
          dt_txt: '2025-06-10 03:00:00',
        },
        {
          dt: 1749535200,
          main: {
            temp: 300.96,
            feels_like: 305.98,
            temp_min: 300.96,
            temp_max: 300.96,
            pressure: 1012,
            sea_level: 1012,
            grnd_level: 1012,
            humidity: 88,
            temp_kf: 0,
          },
          weather: [
            {
              id: 801,
              main: 'Clouds',
              description: 'few clouds',
              icon: '02n',
            },
          ],
          clouds: {
            all: 16,
          },
          wind: {
            speed: 7.72,
            deg: 134,
            gust: 9.79,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'n',
          },
          dt_txt: '2025-06-10 06:00:00',
        },
        {
          dt: 1749546000,
          main: {
            temp: 301.02,
            feels_like: 306.16,
            temp_min: 301.02,
            temp_max: 301.02,
            pressure: 1011,
            sea_level: 1011,
            grnd_level: 1011,
            humidity: 88,
            temp_kf: 0,
          },
          weather: [
            {
              id: 804,
              main: 'Clouds',
              description: 'overcast clouds',
              icon: '04n',
            },
          ],
          clouds: {
            all: 100,
          },
          wind: {
            speed: 7.59,
            deg: 137,
            gust: 9.26,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'n',
          },
          dt_txt: '2025-06-10 09:00:00',
        },
        {
          dt: 1749556800,
          main: {
            temp: 301,
            feels_like: 306.26,
            temp_min: 301,
            temp_max: 301,
            pressure: 1012,
            sea_level: 1012,
            grnd_level: 1012,
            humidity: 89,
            temp_kf: 0,
          },
          weather: [
            {
              id: 804,
              main: 'Clouds',
              description: 'overcast clouds',
              icon: '04d',
            },
          ],
          clouds: {
            all: 91,
          },
          wind: {
            speed: 8.17,
            deg: 147,
            gust: 10.37,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'd',
          },
          dt_txt: '2025-06-10 12:00:00',
        },
        {
          dt: 1749567600,
          main: {
            temp: 301.25,
            feels_like: 306.5,
            temp_min: 301.25,
            temp_max: 301.25,
            pressure: 1014,
            sea_level: 1014,
            grnd_level: 1014,
            humidity: 86,
            temp_kf: 0,
          },
          weather: [
            {
              id: 802,
              main: 'Clouds',
              description: 'scattered clouds',
              icon: '03d',
            },
          ],
          clouds: {
            all: 27,
          },
          wind: {
            speed: 7.2,
            deg: 139,
            gust: 8.36,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'd',
          },
          dt_txt: '2025-06-10 15:00:00',
        },
        {
          dt: 1749578400,
          main: {
            temp: 301.36,
            feels_like: 306.47,
            temp_min: 301.36,
            temp_max: 301.36,
            pressure: 1014,
            sea_level: 1014,
            grnd_level: 1014,
            humidity: 84,
            temp_kf: 0,
          },
          weather: [
            {
              id: 803,
              main: 'Clouds',
              description: 'broken clouds',
              icon: '04d',
            },
          ],
          clouds: {
            all: 63,
          },
          wind: {
            speed: 6.78,
            deg: 142,
            gust: 7.87,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'd',
          },
          dt_txt: '2025-06-10 18:00:00',
        },
        {
          dt: 1749589200,
          main: {
            temp: 301.43,
            feels_like: 306.49,
            temp_min: 301.43,
            temp_max: 301.43,
            pressure: 1013,
            sea_level: 1013,
            grnd_level: 1013,
            humidity: 83,
            temp_kf: 0,
          },
          weather: [
            {
              id: 804,
              main: 'Clouds',
              description: 'overcast clouds',
              icon: '04d',
            },
          ],
          clouds: {
            all: 94,
          },
          wind: {
            speed: 6,
            deg: 121,
            gust: 6.28,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'd',
          },
          dt_txt: '2025-06-10 21:00:00',
        },
        {
          dt: 1749600000,
          main: {
            temp: 301.32,
            feels_like: 306.36,
            temp_min: 301.32,
            temp_max: 301.32,
            pressure: 1012,
            sea_level: 1012,
            grnd_level: 1012,
            humidity: 84,
            temp_kf: 0,
          },
          weather: [
            {
              id: 803,
              main: 'Clouds',
              description: 'broken clouds',
              icon: '04d',
            },
          ],
          clouds: {
            all: 78,
          },
          wind: {
            speed: 7.68,
            deg: 109,
            gust: 8.32,
          },
          visibility: 10000,
          pop: 0,
          sys: {
            pod: 'd',
          },
          dt_txt: '2025-06-11 00:00:00',
        },
      ],
      city: {
        id: 4733103,
        name: 'South Padre Island',
        coord: {
          lat: 26.3943,
          lon: -96.637,
        },
        country: 'US',
        population: 2816,
        timezone: -21600,
        sunrise: 1749468797,
        sunset: 1749518321,
      },
    };
    rawWeather = {
      coord: {
        lon: -96.637,
        lat: 26.3943,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      base: 'stations',
      main: {
        temp: 301.34,
        feels_like: 305.9,
        temp_min: 301.34,
        temp_max: 301.34,
        pressure: 1013,
        humidity: 81,
        sea_level: 1013,
        grnd_level: 1013,
      },
      visibility: 10000,
      wind: {
        speed: 6.52,
        deg: 143,
        gust: 6.98,
      },
      clouds: {
        all: 4,
      },
      dt: 1749492526,
      sys: {
        country: 'US',
        sunrise: 1749468797,
        sunset: 1749518321,
      },
      timezone: -21600,
      id: 4733103,
      name: 'South Padre Island',
      cod: 200,
    };
  };
});
