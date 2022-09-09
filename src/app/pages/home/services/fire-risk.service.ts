import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const PATH = '/risk/fire_risk'

@Injectable({
    providedIn: 'root'
})
export class FireRiskService {
    private _isEnabled$ = new BehaviorSubject(false)
    isEnabled$ = this._isEnabled$.asObservable()

    fireRisks$: Observable<FeatureCollection>

    constructor(private client: HttpClient) {
        this.fireRisks$ = this.isEnabled$.pipe(
            switchMap(isEnabled => isEnabled ? this.getCurrentWeekFireRisk() : this.empty())
        )
    }

    enable() {
        this._isEnabled$.next(true)
    }

    disable() {
        this._isEnabled$.next(false)
    }

    private getCurrentWeekFireRisk(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH)
    }

    private empty(): Observable<FeatureCollection> {
        return of({
            type: 'FeatureCollection',
            features: [],
        })
    }
}
