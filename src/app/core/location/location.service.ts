import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@app/models';
import { EMPTY, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  async getCurrentLocation(): Promise<Location> {
    try {
      const pos = await Geolocation.getCurrentPosition();
      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
    } catch (err) {
      return {
        latitude: 43.074085,
        longitude: -89.381027,
      };
    }
  }

  getLocationName(location: Location): Observable<string> {
    return this.http
      .get(
        `${environment.baseUrl}/geo/1.0/reverse?lat=${location.latitude}&lon=${location.longitude}&appid=${environment.apiKey}`,
      )
      .pipe(
        map((data: Array<any>) =>
          data && data.length
            ? `${data[0].name}, ${data[0].state ? this.postalAbbreviation(data[0].state) : data[0].country}`
            : 'Unknown',
        ),
      );
  }

  private postalAbbreviation(state: string): string {
    switch (state) {
      case 'Alabama':
        return 'AL';
      case 'Alaska':
        return 'AK';
      case 'Arizona':
        return 'AZ';
      case 'Arkansas':
        return 'AR';
      case 'California':
        return 'CA';
      case 'Colorado':
        return 'CO';
      case 'Connecticut':
        return 'CT';
      case 'Delaware':
        return 'DE';
      case 'Florida':
        return 'FL';
      case 'Georgia':
        return 'GA';
      case 'Hawaii':
        return 'HI';
      case 'Idaho':
        return 'ID';
      case 'Illinois':
        return 'IL';
      case 'Indiana':
        return 'IN';
      case 'Iowa':
        return 'IA';
      case 'Kansas':
        return 'KS';
      case 'Kentucky':
        return 'KY';
      case 'Louisiana':
        return 'LA';
      case 'Maine':
        return 'ME';
      case 'Maryland':
        return 'MD';
      case 'Massachusetts':
        return 'MA';
      case 'Michigan':
        return 'MI';
      case 'Minnesota':
        return 'MN';
      case 'Mississippi':
        return 'MS';
      case 'Missouri':
        return 'MO';
      case 'Montana':
        return 'MT';
      case 'Nebraska':
        return 'NE';
      case 'Nevada':
        return 'NV';
      case 'New Hampshire':
        return 'NH';
      case 'New Jersey':
        return 'NJ';
      case 'New Mexico':
        return 'NM';
      case 'New York':
        return 'NY';
      case 'North Carolina':
        return 'NC';
      case 'North Dakota':
        return 'ND';
      case 'Ohio':
        return 'OH';
      case 'Oklahoma':
        return 'OK';
      case 'Oregon':
        return 'OR';
      case 'Pennsylvania':
        return 'PA';
      case 'Rhode Island':
        return 'RI';
      case 'South Carolina':
        return 'SC';
      case 'South Dakota':
        return 'SD';
      case 'Tennessee':
        return 'TN';
      case 'Texas':
        return 'TX';
      case 'Utah':
        return 'UT';
      case 'Vermont':
        return 'VT';
      case 'Virginia':
        return 'VA';
      case 'Washington':
        return 'WA';
      case 'West Virginia':
        return 'WV';
      case 'Wisconsin':
        return 'WI';
      case 'Wyoming':
        return 'WY';
      default:
        return '';
    }
  }
}
