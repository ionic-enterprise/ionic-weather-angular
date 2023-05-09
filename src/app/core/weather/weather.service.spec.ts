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
      (location.getLocationName as jasmine.Spy).and.returnValue(of('Jimmy Crossing, IL'));
    });

    it('gets the current location', fakeAsync(() => {
      const location = TestBed.inject(LocationService);
      service.initialize();
      tick();
      expect(location.getCurrentLocation).toHaveBeenCalledTimes(1);
    }));

    it('gets the weather data', fakeAsync(() => {
      service.initialize();
      tick();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/onecall?exclude=minutely,hourly&lat=42.73&lon=-89.43&appid=${environment.apiKey}`
      );
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    }));

    it('merges the location name', fakeAsync(() => {
      const location = TestBed.inject(LocationService);
      service.initialize();
      tick();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/onecall?exclude=minutely,hourly&lat=42.73&lon=-89.43&appid=${environment.apiKey}`
      );
      req.flush(rawWeather);
      expect(location.getLocationName).toHaveBeenCalledTimes(1);
    }));

    it('emits the converted data', fakeAsync(() => {
      let res: CurrentWeather;
      service.currentData$.subscribe((w) => (res = w));
      service.initialize();
      tick();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/onecall?exclude=minutely,hourly&lat=42.73&lon=-89.43&appid=${environment.apiKey}`
      );
      req.flush(rawWeather);
      expect(res).toEqual({
        locationName: 'Jimmy Crossing, IL',
        condition: 800,
        temperature: 299.18,
        uvIndex: 1.1,
        forecasts: [
          { date: new Date(1658080800000), condition: 500, low: 288.69, high: 299.18 },
          { date: new Date(1658167200000), condition: 800, low: 290.05, high: 301.22 },
          { date: new Date(1658253600000), condition: 802, low: 292.49, high: 301.2 },
          { date: new Date(1658340000000), condition: 800, low: 292.7, high: 299.49 },
          { date: new Date(1658426400000), condition: 500, low: 292.12, high: 301.9 },
          { date: new Date(1658512800000), condition: 500, low: 293.67, high: 301.42 },
          { date: new Date(1658599200000), condition: 501, low: 293.99, high: 305.09 },
          { date: new Date(1658685600000), condition: 502, low: 294.3, high: 302.98 },
        ],
      });
    }));
  });

  describe('start refresh timer', () => {
    beforeEach(() => {
      const location = TestBed.inject(LocationService);
      (location.getCurrentLocation as jasmine.Spy).and.resolveTo({ latitude: 42.73, longitude: -89.43 });
      (location.getLocationName as jasmine.Spy).and.returnValue(of('Jimmy Crossing, IL'));
    });

    it('creates a 15 minute refresh', fakeAsync(() => {
      const location = TestBed.inject(LocationService);
      service.initialize();
      tick();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/data/2.5/onecall?exclude=minutely,hourly&lat=42.73&lon=-89.43&appid=${environment.apiKey}`
      );
      req.flush(rawWeather);
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
    rawWeather = {
      lat: 42.73,
      lon: -89.43,
      timezone: 'America/Chicago',
      timezone_offset: -18000,
      current: {
        dt: 1658099470,
        sunrise: 1658054078,
        sunset: 1658107962,
        temp: 299.18,
        feels_like: 299.18,
        pressure: 1012,
        humidity: 69,
        dew_point: 293.05,
        uvi: 1.1,
        clouds: 0,
        visibility: 10000,
        wind_speed: 1.54,
        wind_deg: 40,
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      },
      daily: [
        {
          dt: 1658080800,
          sunrise: 1658054078,
          sunset: 1658107962,
          moonrise: 1658118420,
          moonset: 1658070420,
          moon_phase: 0.65,
          temp: { day: 297.66, min: 288.69, max: 299.18, night: 292.3, eve: 298.7, morn: 290.68 },
          feels_like: { day: 298.18, night: 292.65, eve: 299.22, morn: 291 },
          pressure: 1012,
          humidity: 77,
          dew_point: 293.24,
          wind_speed: 4.23,
          wind_deg: 35,
          wind_gust: 6.12,
          weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
          clouds: 97,
          pop: 0.9,
          rain: 2.53,
          uvi: 8.16,
        },
        {
          dt: 1658167200,
          sunrise: 1658140531,
          sunset: 1658194319,
          moonrise: 1658206140,
          moonset: 1658161140,
          moon_phase: 0.69,
          temp: { day: 300.56, min: 290.05, max: 301.22, night: 294.72, eve: 299.34, morn: 291.6 },
          feels_like: { day: 302.04, night: 295.39, eve: 299.34, morn: 291.88 },
          pressure: 1012,
          humidity: 63,
          dew_point: 292.86,
          wind_speed: 3.41,
          wind_deg: 222,
          wind_gust: 6.46,
          weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
          clouds: 0,
          pop: 0,
          uvi: 9.25,
        },
        {
          dt: 1658253600,
          sunrise: 1658226985,
          sunset: 1658280674,
          moonrise: 0,
          moonset: 1658251620,
          moon_phase: 0.72,
          temp: { day: 300.76, min: 292.49, max: 301.2, night: 298.33, eve: 299.06, morn: 293.61 },
          feels_like: { day: 303.19, night: 298.89, eve: 299.8, morn: 294.14 },
          pressure: 1008,
          humidity: 71,
          dew_point: 294.84,
          wind_speed: 7.45,
          wind_deg: 200,
          wind_gust: 16.83,
          weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
          clouds: 43,
          pop: 0,
          uvi: 8.92,
        },
        {
          dt: 1658340000,
          sunrise: 1658313440,
          sunset: 1658367026,
          moonrise: 1658293800,
          moonset: 1658342100,
          moon_phase: 0.75,
          temp: { day: 299.04, min: 292.7, max: 299.49, night: 293.43, eve: 297.46, morn: 293.31 },
          feels_like: { day: 299.46, night: 293.97, eve: 298.04, morn: 293.68 },
          pressure: 1002,
          humidity: 68,
          dew_point: 292.5,
          wind_speed: 7.16,
          wind_deg: 212,
          wind_gust: 18.21,
          weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
          clouds: 0,
          pop: 0,
          uvi: 8.78,
        },
        {
          dt: 1658426400,
          sunrise: 1658399896,
          sunset: 1658453377,
          moonrise: 1658381520,
          moonset: 1658432400,
          moon_phase: 0.79,
          temp: { day: 301.46, min: 292.12, max: 301.9, night: 294.98, eve: 300.19, morn: 293.3 },
          feels_like: { day: 302.71, night: 295.59, eve: 302.98, morn: 293.77 },
          pressure: 1009,
          humidity: 57,
          dew_point: 292.12,
          wind_speed: 3.83,
          wind_deg: 283,
          wind_gust: 7.32,
          weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
          clouds: 0,
          pop: 0.34,
          rain: 0.41,
          uvi: 8.66,
        },
        {
          dt: 1658512800,
          sunrise: 1658486353,
          sunset: 1658539727,
          moonrise: 1658469360,
          moonset: 1658522700,
          moon_phase: 0.82,
          temp: { day: 301.42, min: 293.67, max: 301.42, night: 293.87, eve: 296.79, morn: 293.67 },
          feels_like: { day: 302.43, night: 294.35, eve: 297.4, morn: 294.15 },
          pressure: 1014,
          humidity: 55,
          dew_point: 291.41,
          wind_speed: 4.6,
          wind_deg: 159,
          wind_gust: 10.16,
          weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
          clouds: 49,
          pop: 0.7,
          rain: 1.94,
          uvi: 0.41,
        },
        {
          dt: 1658599200,
          sunrise: 1658572810,
          sunset: 1658626074,
          moonrise: 1658557440,
          moonset: 1658612940,
          moon_phase: 0.85,
          temp: { day: 303.62, min: 293.99, max: 305.09, night: 295.63, eve: 302.32, morn: 295.62 },
          feels_like: { day: 309.63, night: 296.44, eve: 308.83, morn: 296.38 },
          pressure: 1014,
          humidity: 71,
          dew_point: 297.7,
          wind_speed: 3.79,
          wind_deg: 217,
          wind_gust: 10.39,
          weather: [{ id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' }],
          clouds: 13,
          pop: 0.96,
          rain: 8.62,
          uvi: 1,
        },
        {
          dt: 1658685600,
          sunrise: 1658659268,
          sunset: 1658712420,
          moonrise: 1658645760,
          moonset: 1658703000,
          moon_phase: 0.88,
          temp: { day: 301.53, min: 294.3, max: 302.98, night: 294.91, eve: 299.6, morn: 294.3 },
          feels_like: { day: 305.36, night: 295.65, eve: 299.6, morn: 295.03 },
          pressure: 1009,
          humidity: 75,
          dew_point: 296.66,
          wind_speed: 6.92,
          wind_deg: 89,
          wind_gust: 13.26,
          weather: [{ id: 502, main: 'Rain', description: 'heavy intensity rain', icon: '10d' }],
          clouds: 87,
          pop: 1,
          rain: 26.97,
          uvi: 1,
        },
      ],
    };
  };
});
