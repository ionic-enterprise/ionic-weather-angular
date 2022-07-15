import { Forecast } from './forecast';

export interface CurrentWeather {
  locationName: string;
  condition: number;
  temperature: number;
  uvIndex: number;
  forecasts: Array<Forecast>;
}
