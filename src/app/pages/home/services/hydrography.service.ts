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
    private _isLimitLevel1Selected$ = new BehaviorSubject(false);
    isLimitLevel1Selected$ = this._isLimitLevel1Selected$.asObservable()
    isLimitLevel1Loading$ = new BehaviorSubject(false)
    limitLevel1$: Observable<FeatureCollection>

    private _isLimitLevel2Selected$ = new BehaviorSubject(false);
    isLimitLevel2Loading$ = new BehaviorSubject(false)
    isLimitLevel2Selected$ = this._isLimitLevel2Selected$.asObservable()
    limitLevel2$: Observable<FeatureCollection>

    private _isLimitLevel4Selected$ = new BehaviorSubject(false);
    isLimitLevel4Loading$ = new BehaviorSubject(false)
    isLimitLevel4Selected$ = this._isLimitLevel4Selected$.asObservable()
    limitLevel4$: Observable<FeatureCollection>

    private _isLimitLevel5Selected$ = new BehaviorSubject(false);
    isLimitLevel5Loading$ = new BehaviorSubject(false)
    isLimitLevel5Selected$ = this._isLimitLevel5Selected$.asObservable()
    limitLevel5$: Observable<FeatureCollection>

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
        this.limitLevel1$ = this.isLimitLevel1Selected$
            .pipe(
                tap(() => this.isLimitLevel1Loading$.next(true)),
                switchMap(isSelected => isSelected ? this.getLimitLevel1() : this.empty()),
                tap(() => this.isLimitLevel1Loading$.next(false)),
                catchError(() => {
                    this.isLimitLevel1Loading$.next(false)
                    return this.empty()
                })
            )

        this.limitLevel2$ = this.isLimitLevel2Selected$
            .pipe(
                tap(() => this.isLimitLevel2Loading$.next(true)),
                switchMap(isSelected => isSelected ? this.getLimitLevel2() : this.empty()),
                tap(() => this.isLimitLevel2Loading$.next(false)),
                catchError(() => {
                    this.isLimitLevel2Loading$.next(false)
                    return this.empty()
                })
            )

        this.limitLevel4$ = this.isLimitLevel4Selected$
            .pipe(
                tap(() => this.isLimitLevel4Loading$.next(true)),
                switchMap(isSelected => isSelected ? this.getLimitLevel4() : this.empty()),
                tap(() => this.isLimitLevel4Loading$.next(false)),
                catchError(() => {
                    this.isLimitLevel4Loading$.next(false)
                    return this.empty()
                })
            )

        this.limitLevel5$ = this.isLimitLevel5Selected$
            .pipe(
                tap(() => this.isLimitLevel5Loading$.next(true)),
                switchMap(isSelected => isSelected ? this.getLimitLevel5() : this.empty()),
                tap(() => this.isLimitLevel5Loading$.next(false)),
                catchError(() => {
                    this.isLimitLevel5Loading$.next(false)
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

    selectLevel1(selected: boolean) {
        this._isLimitLevel1Selected$.next(selected);
    }

    selectLevel2(selected: boolean) {
        this._isLimitLevel2Selected$.next(selected);
    }

    selectLevel4(selected: boolean) {
        this._isLimitLevel4Selected$.next(selected);
    }

    selectLevel5(selected: boolean) {
        this._isLimitLevel5Selected$.next(selected);
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

    private getLimitLevel1(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/limits_lvl_2');
    }

    private getLimitLevel2(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/contribs');
    }

    private getLimitLevel4(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/limits_lvl_5');
    }

    private getLimitLevel5(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/limits_lvl_4');
    }

    private empty(): Observable<FeatureCollection> {
        return of({
            type: 'FeatureCollection',
            features: [],
        })
    }

}
