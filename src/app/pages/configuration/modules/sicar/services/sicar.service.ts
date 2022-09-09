import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { City } from '../models/city.model';

const PATH = '/producer/cities'

@Injectable({
    providedIn: 'root'
})
export class SicarService {

    constructor(private client: HttpClient) { }

    getCities(): Observable<City[]> {
        return this.client.get<City[]>(PATH)
    }

    updateSicar(cityId: string, file: File): Observable<City> {
        const url = `${PATH}/${cityId}/sicar`
        const form = new FormData()
        form.append('sicar', file)

        return this.client.post<City>(url, form)
    }
}
