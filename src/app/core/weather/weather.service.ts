import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentWeather, Forecast } from '@app/models';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, switchMap, map } from 'rxjs';

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

  constructor(private http: HttpClient) {
    this.currentData = new BehaviorSubject(null);
    this.refresh = new BehaviorSubject(null);
    this.refresh
      .pipe(
        switchMap(() => this.getData()),
        map((data) => this.convert(data))
      )
      .subscribe((w) => this.currentData.next(w));

    setInterval(() => {
      this.refresh.next();
    }, 15 * 60 * 1000);
  }

  get currentData$() {
    return this.currentData.asObservable();
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

  private getData(): Observable<OneCallResponse> {
    return this.http.get<OneCallResponse>(
      `https://api.openweathermap.org/data/2.5/onecall?lat=43.074085&lon=-89.381027&exclude=minutely,hourly&appid=${environment.apiKey}`
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
