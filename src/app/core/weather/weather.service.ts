import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentWeather, Forecast } from '@app/models';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, switchMap, map } from 'rxjs';

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

  private convert(data: any): CurrentWeather {
    return {
      condition: data.current.weather[0].id,
      temperature: data.current.temp,
      uvIndex: data.current.uvi,
      uvRiskIndex: this.riskLevel(data.current.uvi),
      forecasts: this.convertForecast(data.daily),
    };
  }

  private convertForecast(daily: Array<any>): Array<Array<Forecast>> {
    const result = [];
    daily.forEach((day: any) => {
      result.push([
        {
          date: new Date(day.dt * 1000),
          condition: day.weather[0].id,
          temperature: day.temp.min,
        },
        {
          date: new Date(day.dt * 1000),
          condition: day.weather[0].id,
          temperature: day.temp.max,
        },
      ]);
    });
    return result;
  }

  private getData(): Observable<any> {
    return this.http.get<any>(
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
