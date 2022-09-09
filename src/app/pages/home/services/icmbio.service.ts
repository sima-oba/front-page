import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { emptyFeatures } from 'src/app/core/utils/map';
import { ConservationQuery } from '../models/conservation-unit';

const PATH = '/producer'

@Injectable({
    providedIn: 'root'
})
export class IcmbioService {
    private conservationQuery$ = new BehaviorSubject<ConservationQuery | null>(null)
    isConservationLoading$ = new BehaviorSubject(false)
    conservationFeatures$: Observable<FeatureCollection>

    private indiState$ = new BehaviorSubject<string | null>(null)
    isIndiLoading$ = new BehaviorSubject(false)
    indiFeatures$: Observable<FeatureCollection>

    private isGeoSitesEnabled$ = new BehaviorSubject(false)
    private isGeoSitesLoading$ = new BehaviorSubject(false)
    geoSiteFeatures$: Observable<FeatureCollection>

    private isGeoParksEnabled$ = new BehaviorSubject(false)
    private isGeoParksLoading$ = new BehaviorSubject(false)
    geoParksFeatures$: Observable<FeatureCollection>

    private isCorridorsEnabled$ = new BehaviorSubject(false)
    private isCorridorsLoading$ = new BehaviorSubject(false)
    corridorsFeatures$: Observable<FeatureCollection>

    isOtherLoading$: Observable<boolean>

    constructor(private client: HttpClient) {
        this.conservationFeatures$ = this.bind(
            this.conservationQuery$,
            this.getConservation,
            this.isConservationLoading$
        )

        this.indiFeatures$ = this.bind(
            this.indiState$,
            this.getIndigenousLand,
            this.isIndiLoading$
        )

        this.geoSiteFeatures$ = this.bind(
            this.isGeoSitesEnabled$,
            this.getGeoSites,
            this.isGeoSitesLoading$
        )

        this.geoParksFeatures$ = this.bind(
            this.isGeoParksEnabled$,
            this.getGeoParks,
            this.isGeoParksLoading$
        )

        this.corridorsFeatures$ = this.bind(
            this.isCorridorsEnabled$,
            this.getCorridors,
            this.isCorridorsLoading$
        )

        this.isOtherLoading$ = combineLatest([
            this.isGeoSitesLoading$,
            this.isGeoParksLoading$,
            this.isCorridorsLoading$
        ]).pipe(
            map(loadingArray =>
                loadingArray.reduce((acc, curr) => acc || curr, false)
            )
        )
    }

    get conservationQuery(): ConservationQuery | null {
        return this.conservationQuery$.value
    }

    get indiState(): string | null {
        return this.indiState$.value
    }

    set indiState(value: string | null) {
        this.indiState$.next(value)
    }

    get isGeoSitesEnabled(): boolean {
        return this.isGeoSitesEnabled$.value
    }

    set isGeoSitesEnabled(value: boolean) {
        this.isGeoSitesEnabled$.next(value)
    }

    get isCorridorsEnabled(): boolean {
        return this.isCorridorsEnabled$.value
    }

    set isCorridorsEnabled(value: boolean) {
        this.isCorridorsEnabled$.next(value)
    }

    get isGeoParksEnabled(): boolean {
        return this.isGeoParksEnabled$.value
    }

    set isGeoParksEnabled(value: boolean) {
        this.isGeoParksEnabled$.next(value)
    }

    searchConservation(sphere: string, category: string) {
        this.conservationQuery$.next({ sphere, category })
    }

    disableConservation() {
        this.conservationQuery$.next(null)
    }

    private bind<S>(
        source$: Observable<S>,
        transformFn: (s?: S) => Observable<FeatureCollection>,
        loading$: BehaviorSubject<boolean>
    ): Observable<FeatureCollection> {
        return source$.pipe(
            tap(() => loading$.next(true)),
            switchMap(value => transformFn(value)),
            tap(() => loading$.next(false)),
            catchError(this.handleError),
            shareReplay()
        )
    }

    private handleError = (error: any): Observable<FeatureCollection> => {
        console.warn(error)
        return of(emptyFeatures())
    }

    private getConservation = (query: ConservationQuery | null): Observable<FeatureCollection> => {
        if (query == null) {
            return of(emptyFeatures())
        }

        const params = {
            sphere: query.sphere,
            category: query.category
        }

        return this.getFeatures('/conservation/geojson', params)
    }

    private getIndigenousLand = (state: string | null): Observable<FeatureCollection> => {
        if (state == null) {
            return of(emptyFeatures())
        }

        return this.getFeatures('/indigenousland/geojson', { state })
    }

    private getGeoSites = (isEnabled: boolean): Observable<FeatureCollection> => {
        if (!isEnabled) {
            return of(emptyFeatures())
        }

        return this.getFeatures('/geosites/geojson')
    }

    private getGeoParks = (isEnabled: boolean): Observable<FeatureCollection> => {
        if (!isEnabled) {
            return of(emptyFeatures())
        }

        return this.getFeatures('/geoparks/geojson')
    }

    private getCorridors = (isEnabled: boolean): Observable<FeatureCollection> => {
        if (!isEnabled) {
            return of(emptyFeatures())
        }

        return this.getFeatures('/ecocorridors/geojson')
    }

    private getFeatures(subpath: string, params = {}): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + subpath, { params })
    }

}
