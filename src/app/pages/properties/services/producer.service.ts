import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Farm } from 'src/app/core/models/farm.model';

const PATH = '/producer/farms'

@Injectable({
    providedIn: 'root'
})
export class ProducerService {

    constructor(private client: HttpClient) { }

    fetchAllFarms(): Observable<Farm[]> {
        return this.client.get<Farm[]>(PATH)
    }

    fetchFarmById(id: string): Observable<Farm> {
        return this.client.get<Farm>(PATH + `/${id}`)
    }

    updateFarm(farm: Farm): Observable<Farm> {
        return this.client.put<Farm>(PATH + `/${farm._id}`, farm)
    }

    fetchCrops(): Observable<string[]> {
        return this.fetchList('/crops')
    }

    fetchVegetationTypes(): Observable<string[]> {
        return this.fetchList('/vegetation_types')
    }

    fetchIndustries(): Observable<string[]> {
        return this.fetchList('/industries')
    }

    private fetchList(subpath: string): Observable<string[]> {
        return this.client.get<string[]>(PATH + subpath)
    }
}
