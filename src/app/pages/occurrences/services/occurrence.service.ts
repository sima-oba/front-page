import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Occurrence } from '../models/occurrence.model';
import { ResolveOccurrence } from '../models/resolve-occurrence.model';
import { ReportOccurrence } from '../models/report-occurrence.model';

export type OccurrenceType = 'NONE' | 'ALL' | 'FALLOW' | 'RUST'

const PATH = '/phytosanitary/reports';

@Injectable({
    providedIn: 'root'
})
export class OccurrenceService {
    private occurrenceType$ = new BehaviorSubject<OccurrenceType>('NONE')
    occurrences$: Observable<FeatureCollection>

    constructor(private client: HttpClient) {
        this.occurrences$ = this.occurrenceType$.pipe(
            switchMap(this.getOccurrencesAsGeoJson)
        )
    }

    reportOccurrence(occurrence: ReportOccurrence): Observable<ReportOccurrence> {
        const form = this.objectToFormData(occurrence)
        
        return this.client.post<ReportOccurrence>(PATH, form).pipe(
            tap(_ => this.refresh())
        )
    }

    resolveOccurrence(occurrence: ResolveOccurrence): Observable<Occurrence> {
        const id = occurrence._id
        delete occurrence._id
        const form = this.objectToFormData(occurrence)

        return this.client.put<Occurrence>(`${PATH}/${id}`, form).pipe(
            tap(_ => this.refresh())
        )
    }

    filterOccurrences(occurrenceType: OccurrenceType) {
        this.occurrenceType$.next(occurrenceType)
    }

    private objectToFormData(object: Object) {
        const form = new FormData()

        Object.entries(object).forEach(([key, value]) =>
            form.append(key, value)
        )

        return form
    }

    private getOccurrencesAsGeoJson = (occurrenceType: OccurrenceType): Observable<FeatureCollection> => {
        if (occurrenceType == 'NONE') {
            return of({
                type: 'FeatureCollection',
                features: []
            })
        }

        const params = occurrenceType === 'ALL' ? {} : { occurrence_type: occurrenceType }
        return this.client.get<FeatureCollection>(PATH + '/geojson', { params })
    }

    private refresh() {
        this.occurrenceType$.next(this.occurrenceType$.value)
    }
}
