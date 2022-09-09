import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

import { Farm } from 'src/app/core/models/farm.model';
import { Phytosanitary } from '../models/phytosanitary.model';
import { PracticeBase, PracticeQuery } from '../models/practice.model';

const PATH = '/producer'

@Injectable({ providedIn: 'root' })
export class PracticeService {
    private query$ = new BehaviorSubject<PracticeQuery>({})
    allFarms$: Observable<Farm[]>
    currentFarm$: Observable<Farm | null>
    practices$: Observable<Phytosanitary[]>

    constructor(private client: HttpClient) {
        this.allFarms$ = this.getAllFarms().pipe(
            shareReplay()
        )

        this.currentFarm$ = combineLatest([
            this.allFarms$, this.query$
        ]).pipe(
            map(([farms, query]) => {
                const index = farms.findIndex(it => it._id === query.farmId)
                return index >= 0 ? farms[index] : null
            })
        )

        this.practices$ = this.query$.pipe(
            switchMap(this.getPractices)
        )
    }

    get query(): PracticeQuery {
        return this.query$.value
    }

    updateQuery(query: PracticeQuery) {
        this.query$.next({
            ...this.query$.value,
            ...query
        })
    }

    refreshPractices() {
        this.query$.next(this.query$.value)
    }

    addPractice(practice: PracticeBase): Observable<PracticeBase> {
        return this.client.post<PracticeBase>(PATH + '/practices', practice)
    }

    updatePractice(practice: PracticeBase): Observable<PracticeBase> {
        return this.client.put<PracticeBase>(`${PATH}/practices/${practice._id}`, practice)
    }

    removePractice(practiceId: string): Observable<void> {
        return this.client.delete<void>(`${PATH}/practices/${practiceId}`)
    }

    private getAllFarms(): Observable<Farm[]> {
        return this.client.get<Farm[]>(PATH + '/farms')
    }

    private getPractices = (query: PracticeQuery): Observable<Phytosanitary[]> => {
        if (!query.farmId || !query.practiceType) {
            return of([])
        }

        const params = {
            farm_id: query.farmId,
            practice_type: query.practiceType
        }

        return this.client.get<Phytosanitary[]>(PATH + '/practices', { params })
    }

}
