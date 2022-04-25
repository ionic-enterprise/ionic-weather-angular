// The current weather widgets was designed for an older version of the API.
// Version 2.0 of weather widgets should be more generic, IMO.
export interface Forecast {
  date: Date;
  condition: number;
  temperature: number;
}
