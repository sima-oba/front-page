import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { VisitDetails } from '../models/visit.model';

const PATH = '/phytosanitary/farms'

@Injectable({
    providedIn: 'root'
})
export class VisitService {
    private _isEnabled$ = new BehaviorSubject(false)
    isEnabled$ = this._isEnabled$.asObservable()

    visits$: Observable<FeatureCollection>

    constructor(private client: HttpClient) {
        this.visits$ = this.isEnabled$.pipe(
            switchMap(isEnabled => isEnabled ? this.getVisits() : this.empty())
        )
    }

    enable() {
        this._isEnabled$.next(true)
    }

    disable() {
        this._isEnabled$.next(false)
    }

    private getVisits(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/geojson')
    }

    getVisitDetails(visitId: string): Observable<VisitDetails[]> {
        return this.client.get<VisitDetails[]>(`${PATH}/${visitId}/visits`)
    }

    private empty(): Observable<FeatureCollection> {
        return of({
            type: 'FeatureCollection',
            features: [],
        })
    }
}
