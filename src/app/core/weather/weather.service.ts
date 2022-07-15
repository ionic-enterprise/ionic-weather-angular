import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentWeather, Forecast } from '@app/models';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, mergeMap, switchMap, map, from } from 'rxjs';
import { Location } from '@app/models';
import { LocationService } from '../location/location.service';

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface RawForecast {
  dt: number;
  weather: [WeatherCondition];
  temp: {
    min: number;
    max: number;
  };
}
interface OneCallResponse {
  locationName: string;
  current: {
    dt: number;
    temp: number;
    uvi: number;
    weather: [WeatherCondition];
  };
  daily: [RawForecast];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private currentData: BehaviorSubject<CurrentWeather>;
  private refresh: BehaviorSubject<void>;

  constructor(private http: HttpClient, private location: LocationService) {
    this.currentData = new BehaviorSubject(null);
    this.refresh = new BehaviorSubject(null);
  }

  get currentData$() {
    return this.currentData.asObservable();
  }

  initialize() {
    this.refresh
      .pipe(
        switchMap(() => from(this.location.getCurrentLocation())),
        mergeMap((loc: Location) => this.getData(loc)),
        map((data) => this.convert(data))
      )
      .subscribe((w) => this.currentData.next(w));

    setInterval(() => {
      this.refresh.next();
    }, 15 * 60 * 1000);
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

  private convert(data: OneCallResponse): CurrentWeather {
    return {
      locationName: data.locationName,
      condition: data.current.weather[0].id,
      temperature: data.current.temp,
      uvIndex: data.current.uvi,
      forecasts: this.convertForecast(data.daily),
    };
  }

  private convertForecast(daily: Array<RawForecast>): Array<Forecast> {
    const result = [];
    daily.forEach((day: RawForecast) => {
      result.push({
        date: new Date(day.dt * 1000),
        condition: day.weather[0].id,
        low: day.temp.min,
        high: day.temp.max,
      });
    });
    return result;
  }

  private getData(location: Location): Observable<OneCallResponse> {
    return this.http
      .get<OneCallResponse>(
        `${environment.baseUrl}/data/2.5/onecall?exclude=minutely,hourly` +
          `&lat=${location.latitude}&lon=${location.longitude}&appid=${environment.apiKey}`
      )
      .pipe(
        mergeMap((x: any) =>
          this.location.getLocationName(location).pipe(map((locationName: string) => ({ ...x, locationName })))
        )
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
