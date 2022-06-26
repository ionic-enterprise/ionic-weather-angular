import { Forecast } from './forecast';

export interface CurrentWeather {
  condition: number;
  temperature: number;
  uvIndex: number;
  forecasts: Array<Forecast>;
}
