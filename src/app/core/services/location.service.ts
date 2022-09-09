import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CityIBGE } from 'src/app/core/models/city.model';

const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor(
        private client: HttpClient,
        private geoLocationService: GeolocationService
    ) { }

    get currentLocation$(): GeolocationService {
        return this.geoLocationService
    }

    getStateCodes(): Observable<string[]> {
        return this.client.get<any[]>(BASE_URL).pipe(
            map(states => states
                .map(state => state.sigla)
                .sort()
            )
        )
    }

    getCitiesByState(stateCode: string): Observable<CityIBGE[]> {
        const url = `${BASE_URL}/${stateCode}/municipios`

        return this.client.get<CityIBGE[]>(url).pipe(
            map(cities => cities.sort())
        )
    }
}
