import { EMPTY } from 'rxjs';

export const createWeatherServiceMock = () => ({
  currentData$: EMPTY,
});
