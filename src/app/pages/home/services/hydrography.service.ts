import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { Aquifer } from '../models/aquifer.model';
import { RiverSummary } from '../models/river-summary.model';

const PATH = '/hydrography'

@Injectable({
    providedIn: 'root'
})
export class HydrographyService {
    private _isLimitsSelected$ = new BehaviorSubject(false);
    isLimitsLoading$ = new BehaviorSubject(false)
    isLimitsSelected$ = this._isLimitsSelected$.asObservable()
    limits$: Observable<FeatureCollection>

    private _isQ90Selected$ = new BehaviorSubject(false);
    isQ90Selected$ = this._isQ90Selected$.asObservable()
    q90$: Observable<FeatureCollection>

    private _isQmldSelected$ = new BehaviorSubject(false);
    isQmldSelected$ = this._isQmldSelected$.asObservable()
    qmld$: Observable<FeatureCollection>

    isFlowRatesLoading$ = new BehaviorSubject(false)
    flowRates$: Observable<FeatureCollection>

    private selectedRivers$ = new BehaviorSubject<string[]>([]);
    isRiversLoading$ = new BehaviorSubject(false)
    isAllRiversSelected$ = new BehaviorSubject(false)
    riverSummary$: Observable<RiverSummary[]>
    rivers$: Observable<FeatureCollection>

    isAquifersLoading$ = new BehaviorSubject(false)
    selectedAquifer$ = new BehaviorSubject<string>('')
    aquiferSummary$: Observable<Aquifer[]>
    aquifers$: Observable<FeatureCollection>

    constructor(private client: HttpClient) {
        this.limits$ = this.isLimitsSelected$
            .pipe(
                tap(() => this.isLimitsLoading$.next(true)),
                switchMap(isSelected => isSelected ? this.getLimits() : this.empty()),
                tap(() => this.isLimitsLoading$.next(false)),
                catchError(() => {
                    this.isLimitsLoading$.next(false)
                    return this.empty()
                })
            )

        this.q90$ = this.isQ90Selected$
            .pipe(
                switchMap(isSelected => isSelected ? this.getFlowRates() : this.empty())
            )

        this.qmld$ = this.isQmldSelected$
            .pipe(
                switchMap(isSelected => isSelected ? this.getFlowRates() : this.empty())
            )

        this.flowRates$ = combineLatest([this.isQ90Selected$, this.isQmldSelected$])
            .pipe(
                tap(() => this.isFlowRatesLoading$.next(true)),
                switchMap(([q90, qmld]) => q90 || qmld ? this.getAllRivers() : this.empty()),
                tap(() => this.isFlowRatesLoading$.next(false)),
                catchError(() => {
                    this.isFlowRatesLoading$.next(false)
                    return this.empty()
                })
            )

        this.riverSummary$ = combineLatest([this.summaryRivers().pipe(shareReplay()), this.isAllRiversSelected$])
            .pipe(
                map(([summary, allSelected]) => {
                    const ids = allSelected ? summary.map(item => item._id) : this.selectedRivers$.value
                    return this.mapRiversSelectedState(summary, ids)
                })
            )

        this.rivers$ = combineLatest([this.selectedRivers$, this.isAllRiversSelected$])
            .pipe(
                tap(() => this.isRiversLoading$.next(true)),
                switchMap(([selection, allSelected]) =>
                    allSelected ? this.getAllRivers() : this.getSelectedRivers(selection)
                ),
                tap(() => this.isRiversLoading$.next(false)),
                catchError(() => {
                    this.isRiversLoading$.next(false)
                    return this.empty()
                })
            )

        this.aquiferSummary$ = this.summaryAquifers()
            .pipe(
                shareReplay(),
                map(summary => this.mapAquifersSelectedState(summary)),
            )

        this.aquifers$ = this.selectedAquifer$
            .pipe(
                tap(() => this.isAquifersLoading$.next(true)),
                switchMap(ids => this.getSelectedAquifer(ids)),
                tap(() => this.isAquifersLoading$.next(false)),
                catchError(() => {
                    this.isAquifersLoading$.next(false)
                    return this.empty()
                })
            )
    }

    selectRiver(riverId: string) {
        const currentRivers = this.selectedRivers$.getValue()
        this.selectedRivers$.next(currentRivers.concat(riverId))
    }

    deselectRiver(riverId: string) {
        const newSelection = this.selectedRivers$.value
        newSelection.splice(newSelection.indexOf(riverId), 1)
        this.selectedRivers$.next(newSelection)
    }

    selectAllRivers() {
        this.isAllRiversSelected$.next(true)
    }

    deselectAllRivers() {
        this.isAllRiversSelected$.next(false)
    }

    selectAquifer(aquiferId: string) {
        this.selectedAquifer$.next(aquiferId)
    }

    deselectAquifers() {
        this.selectedAquifer$.next('')
    }

    selectQ90(isSelected: boolean) {
        this._isQ90Selected$.next(isSelected);
    }

    selectQmld(isSelected: boolean) {
        this._isQmldSelected$.next(isSelected);
    }

    selectLimits(selected: boolean) {
        this._isLimitsSelected$.next(selected);
    }

    private summaryRivers(): Observable<RiverSummary[]> {
        return this.client.get<RiverSummary[]>(PATH + '/hydrography/summary');
    }

    private mapRiversSelectedState(summary: RiverSummary[], ids: string[]): RiverSummary[] {
        return summary.map(river => ({
            ...river,
            isSelected: ids.includes(river._id)
        }))
    }

    private getSelectedRivers(ids: string[]): Observable<FeatureCollection> {
        if (ids.length === 0) {
            return this.empty()
        }

        return this.client.post<FeatureCollection>(PATH + '/hydrography/geojson', { ids });
    }

    private summaryAquifers(): Observable<any> {
        return this.client.get(PATH + '/aquifers')
    }

    private mapAquifersSelectedState(data: any[]): Aquifer[] {
        const selection = this.selectedAquifer$.value

        return data.map(aquifer => ({
            ...aquifer,
            isSelected: selection.includes(aquifer._id)
        }))
    }

    private getSelectedAquifer(aquiferId: string): Observable<FeatureCollection> {
        if (aquiferId.length === 0) {
            return this.empty()
        }

        const params = { ids: [aquiferId] };
        return this.client.get<FeatureCollection>(PATH + '/aquifers/geojson', { params });
    }

    private getAllRivers(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/hydrography/geojson');
    }

    private getFlowRates(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/flow_rates');
    }

    private getLimits(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/limits_lvl_2');
    }

    private empty(): Observable<FeatureCollection> {
        return of({
            type: 'FeatureCollection',
            features: [],
        })
    }

}
