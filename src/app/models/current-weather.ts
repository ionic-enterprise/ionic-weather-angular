import { Forecast } from './forecast';

export interface CurrentWeather {
  condition: number;
  temperature: number;
  uvIndex: number;
  uvRiskIndex: number;
  forecasts: Array<Array<Forecast>>;
}
