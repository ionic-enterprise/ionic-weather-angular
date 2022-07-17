import { EMPTY } from 'rxjs';
import { WeatherService } from './weather.service';

export const createWeatherServiceMock = () =>
  jasmine.createSpyObj<WeatherService>(
    'WeatherService',
    {
      initialize: null,
      startRefreshTimer: null,
      stopRefreshTimer: null,
      uvAdvice: '',
    },
    {
      currentData$: EMPTY,
    }
  );
