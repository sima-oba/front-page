import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PlantingRequest } from '../models/planting-request.model';
import { PlantingSummary } from '../models/planting-summary.model';

const PATH = '/phytosanitary/planting_anticipation'

@Injectable({
    providedIn: 'root'
})
export class PlantingAnticipationService {

    constructor(private client: HttpClient) { }

    summary(): Observable<PlantingSummary> {
        return this.client.get<PlantingSummary>(PATH)
    }

    requestPlantingAnticipation(request: PlantingRequest): Observable<any> {
        const form = new FormData()

        Object.entries(request).forEach(([key, value]) =>
            form.append(key, value)
        )

        return this.client.post<any>(PATH, form)
    }
}
