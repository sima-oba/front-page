import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { FarmSummary } from 'src/app/pages/home/models/farm-summary.model';
import { Farm } from '../models/farm.model';
import { Owner } from '../models/owner.model';
import { MultiSelectItem } from '../models/selection.model';

const PATH = '/producer'

@Injectable({
    providedIn: 'root'
})
export class ProducerService {
    private farmIds$ = new BehaviorSubject<string[]>([])

    isFarmsLoading$ = new BehaviorSubject(false)
    farmSelection$ = this.getAllFarms().pipe(
        shareReplay(),
        map(farms => this.getSelectedState(farms)),
    )

    farmFeatures$ = this.farmIds$.pipe(
        tap(() => this.isFarmsLoading$.next(true)),
        switchMap(ids => this.getFarmFeatures(ids)),
        tap(() => this.isFarmsLoading$.next(false)),
        catchError(() => {
            this.isCitiesLoading$.next(false)
            return this.empty()
        })
    )

    isCitiesEnabled$ = new BehaviorSubject(false)
    isCitiesLoading$ = new BehaviorSubject(false)
    cities$ = this.isCitiesEnabled$.pipe(
        tap(() => this.isCitiesLoading$.next(true)),
        switchMap(isSelected => isSelected ? this.getCities() : this.empty()),
        tap(() => this.isCitiesLoading$.next(false)),
        catchError(() => {
            this.isCitiesLoading$.next(false)
            return this.empty()
        })
    )

    constructor(protected client: HttpClient) { }

    getAllFarms(): Observable<FarmSummary[]> {
        return this.client.get<FarmSummary[]>(`${PATH}/farms`)
    }

    getFarmById(id: string): Observable<Farm> {
        return this.client.get<Farm>(`${PATH}/farms/${id}`)
    }

    selectFarms(farmIds: string[]) {
        this.farmIds$.next(farmIds)
    }

    getOwnerById(id: string): Observable<Owner> {
        return this.client.get<Owner>(`${PATH}/owners/${id}`)
    }

    private getFarmFeatures(farmIds: string[]): Observable<FeatureCollection> {
        if (farmIds.length === 0) {
            return this.empty()
        }

        const body = { ids: farmIds.join(',') }
        return this.client.post<FeatureCollection>(`${PATH}/farms/geojson`, body)
    }

    private getSelectedState = (farms: any[]): MultiSelectItem<Farm>[] => {
        return farms.map(farm => ({
            data: farm,
            label: farm.farm_name,
            legend: `Cód: ${farm.farm_code.slice(28)}`,
            isSelected: this.farmIds$.value.includes(farm._id)
        }))
    }

    private empty(): Observable<FeatureCollection> {
        return of({
            type: 'FeatureCollection',
            features: [],
        })
    }

    enableCities() {
        this.isCitiesEnabled$.next(true)
    }

    disableCities() {
        this.isCitiesEnabled$.next(false)
    }

    private getCities(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(`${PATH}/cities/geojson`)
    }

}
