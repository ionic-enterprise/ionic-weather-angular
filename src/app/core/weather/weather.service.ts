import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentWeather, Forecast } from '@app/models';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, mergeMap, switchMap, map, from, forkJoin, tap } from 'rxjs';
import { Location } from '@app/models';
import { LocationService } from '../location/location.service';

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface RawCurrentWeather {
  dt: number;
  main: {
    temp: number;
  };
  weather: [WeatherCondition];
}
interface RawForecast {
  list: [
    {
      dt: number;
      weather: [WeatherCondition];
      main: {
        temp_min: number;
        temp_max: number;
      };
    },
  ];
}
interface CallResponse {
  locationName: string;
  current: RawCurrentWeather;
  forecast: RawForecast;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private currentData: BehaviorSubject<CurrentWeather>;
  private refresh: BehaviorSubject<void>;
  private refreshTimer: any;

  constructor(
    private http: HttpClient,
    private location: LocationService,
  ) {
    this.currentData = new BehaviorSubject(null);
    this.refresh = new BehaviorSubject(null);
  }

  get currentData$(): Observable<CurrentWeather> {
    return this.currentData.asObservable();
  }

  initialize(): void {
    this.refresh
      .pipe(
        switchMap(() => from(this.location.getCurrentLocation())),
        mergeMap((loc: Location) =>
          forkJoin({
            current: this.getCurrentWeatherData(loc),
            forecast: this.getForecastData(loc),
            locationName: this.location.getLocationName(loc),
          }),
        ),
        map((data) => this.convert(data as any)),
      )
      .subscribe((w) => this.currentData.next(w as any));
  }

  startRefreshTimer(): void {
    this.refreshTimer = setInterval(
      () => {
        this.refresh.next();
      },
      15 * 60 * 1000,
    );
  }

  stopRefreshTimer(): void {
    clearInterval(this.refreshTimer);
  }

  uvAdvice(uvIndex: number): string {
    const level = this.riskLevel(uvIndex);
    return [
      'Wear sunglasses on bright days. If you burn easily, cover up and use broad spectrum SPF 30+ sunscreen. ' +
        'Bright surfaces, such as sand, water and snow, will increase UV exposure.',
      'Stay in the shade near midday when the sun is strongest. If outdoors, wear sun protective clothing, ' +
        'a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every ' +
        '2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and ' +
        'snow, will increase UV exposure.',
      'Reduce time in the sun between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, ' +
        'a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 ' +
        'hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such sand, water and snow, will ' +
        'increase UV exposure.',
      'Minimize sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, ' +
        'a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 ' +
        'hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, ' +
        'will increase UV exposure.',
      'Try to avoid sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, ' +
        'a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every ' +
        '2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, ' +
        'will increase UV exposure.',
    ][level];
  }

  private convert(data: CallResponse): CurrentWeather {
    return {
      locationName: data.locationName,
      condition: data.current.weather[0].id,
      temperature: data.current.main.temp,
      uvIndex: Math.floor(Math.random() * 14) + 1,
      forecasts: this.convertForecast(data.forecast),
    };
  }

  private convertForecast(forecast: RawForecast): Array<Forecast> {
    const result = [];
    forecast.list.forEach((item) => {
      result.push({
        date: new Date(item.dt * 1000),
        condition: item.weather[0].id,
        low: item.main.temp_min,
        high: item.main.temp_max,
      });
    });
    return result;
  }

  private getForecastData(location: Location): Observable<RawForecast> {
    return this.http.get<RawForecast>(
      `${environment.baseUrl}/data/2.5/forecast` +
        `?lat=${location.latitude}&lon=${location.longitude}&appid=${environment.apiKey}`,
    );
  }

  private getCurrentWeatherData(location: Location): Observable<RawCurrentWeather> {
    return this.http.get<RawCurrentWeather>(
      `${environment.baseUrl}/data/2.5/weather` +
        `?lat=${location.latitude}&lon=${location.longitude}&appid=${environment.apiKey}`,
    );
  }

  private riskLevel(value: number): number {
    if (value < 3) {
      return 0;
    }
    if (value < 6) {
      return 1;
    }
    if (value < 8) {
      return 2;
    }
    if (value < 11) {
      return 3;
    }
    return 4;
  }
}
