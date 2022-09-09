import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';

import { City } from 'src/app/core/models/city.model';
import { emptyFeatures } from 'src/app/core/utils/map';
import { SicarSubject } from '../models/sicar.model';

const PATH = '/producer'

@Injectable({
    providedIn: 'root'
})
export class SicarService {
    isAreasLoading$ = new BehaviorSubject(false)
    areaSubject$ = new BehaviorSubject<SicarSubject | null>(null)
    areaFeatures$: Observable<FeatureCollection>

    isFarmsLoading$ = new BehaviorSubject(false)
    isFarmsEnabled$ = new BehaviorSubject(false)
    farmFeatures$: Observable<FeatureCollection>

    cityGeoid$ = new BehaviorSubject<string | null>(null)
    cities$: Observable<City[]>

    constructor(private client: HttpClient) {
        this.areaFeatures$ = combineLatest([
            this.areaSubject$, this.cityGeoid$
        ]).pipe(
            tap(() => this.isAreasLoading$.next(true)),
            switchMap(([subject, geoid]) => {
                if (subject === null || geoid === null) {
                    return of(emptyFeatures())
                }

                return this.getSicar(subject, geoid)
            }),
            tap(() => this.isAreasLoading$.next(false)),
            catchError(() => {
                this.isAreasLoading$.next(false)
                return of(emptyFeatures())
            })
        )

        this.farmFeatures$ = combineLatest([
            this.cityGeoid$, this.isFarmsEnabled$
        ]).pipe(
            tap(() => this.isFarmsLoading$.next(true)),
            switchMap(([geoid, enabled]) => {
                if (!enabled || geoid === null) {
                    return of(emptyFeatures())
                }

                return this.getFarms(geoid)
            }),
            tap(() => this.isFarmsLoading$.next(false)),
            catchError(() => {
                this.isFarmsLoading$.next(false)
                return of(emptyFeatures())
            })
        )

        this.cities$ = this.getCities().pipe(
            shareReplay()
        )
    }

    set cityGeoid(value: string | null) {
        this.cityGeoid$.next(value)
    }

    set areaSubject(value: SicarSubject | null) {
        this.areaSubject$.next(value)
    }

    set isFarmsEnabled(value: boolean) {
        this.isFarmsEnabled$.next(value)
    }

    private getSicar(subject: SicarSubject, city_geoid: string): Observable<FeatureCollection> {
        const params = { subject, city_geoid }
        return this.client.get<FeatureCollection>(PATH + '/sicar/areas', { params })
    }

    private getFarms(cityGeoid: string): Observable<FeatureCollection> {
        const params = { city_geoid: cityGeoid }
        return this.client.get<FeatureCollection>(PATH + '/sicar/farms/', { params })
    }

    private getCities(): Observable<City[]> {
        return this.client.get<City[]>(PATH + "/cities")
    }

}
