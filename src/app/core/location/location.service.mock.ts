import { EMPTY } from 'rxjs';
import { LocationService } from './location.service';

export const createLocationServiceMock = () =>
  jasmine.createSpyObj<LocationService>('LocationService', {
    getCurrentLocation: Promise.resolve(null),
    getLocationName: EMPTY,
  });
