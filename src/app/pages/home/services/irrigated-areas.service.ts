import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const PATH = '/hydrography'

@Injectable({
    providedIn: 'root'
})
export class IrrigatedAreasService {
    private _isIrrigatedAreasEnabled$ = new BehaviorSubject(false)
    isIrrigatedAreasEnabled$ = this._isIrrigatedAreasEnabled$.asObservable()
    irrigatedAreas$: Observable<FeatureCollection>

    private _isPivotsEnabled$ = new BehaviorSubject(false)
    isPivotsEnabled$ = this._isPivotsEnabled$.asObservable()
    pivots$: Observable<FeatureCollection>

    constructor(private client: HttpClient) {
        this.irrigatedAreas$ = this.isIrrigatedAreasEnabled$.pipe(
            switchMap(isEnabled => isEnabled ? this.getIrrigatedAreas() : this.empty())
        )

        this.pivots$ = this._isPivotsEnabled$.pipe(
            switchMap(enabled => enabled ? this.getPivots() : this.empty())
        )
    }

    enableIrrigatedAreas() {
        this._isIrrigatedAreasEnabled$.next(true)
    }

    disableIrrigatedAreas() {
        this._isIrrigatedAreasEnabled$.next(false)
    }

    enablePivots() {
        this._isPivotsEnabled$.next(true)
    }

    disablePivots() {
        this._isPivotsEnabled$.next(false)
    }

    private getIrrigatedAreas(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/irrigated_areas')
    }

    private getPivots(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/pivots')
    }

    private empty(): Observable<FeatureCollection> {
        return of({
            type: 'FeatureCollection',
            features: [],
        })
    }
}