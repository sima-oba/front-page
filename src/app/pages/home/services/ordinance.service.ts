import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { FeatureCollection } from "geojson";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { OrdinanceSummary } from "../models/ordinance-summary.model";

const PATH = '/ordinances'
const ORDINANCE_LIST: OrdinanceSummary[] = [
    {
        ordinanceType: 34,
        ordinance_name: "Penalidade de Demolição",
        isSelected: false
    },
    {
        ordinanceType: 10,
        ordinance_name: "Crédito de Reposicao Florestal",
        isSelected: false
    },
    {
        ordinanceType: 53,
        ordinance_name: "Notificação de Infração do IBAMA",
        isSelected: false
    },
    {
        ordinanceType: 25,
        ordinance_name: "Direito de Uso de Recursos Hídricos",
        isSelected: false
    },
    {
        ordinanceType: 9,
        ordinance_name: "Gerenciamento Florestal",
        isSelected: false
    },
    {
        ordinanceType: 14,
        ordinance_name: "Concessão",
        isSelected: false
    }
]

@Injectable({
    providedIn: 'root'
})
export class OrdinanceService {
    private _selectedOrdinances$ = new BehaviorSubject<number[]>([])

    ordinanceSummary$: Observable<OrdinanceSummary[]> = this._selectedOrdinances$.pipe(
        map(ordinanceType => this.mapSelectedOrdinances(ordinanceType))
    )

    ordinances$: Observable<FeatureCollection> = this._selectedOrdinances$.pipe(
        switchMap(types => this.getOrdinancesByTypes(types))
    )

    constructor(protected client: HttpClient) { }

    selectOrdinance(ordinanceType: number) {
        const currentTypes = this._selectedOrdinances$.getValue()
        this._selectedOrdinances$.next(currentTypes.concat(ordinanceType));
    }

    deselectOrdinance(ordinanceType: number) {
        const newSelection = this._selectedOrdinances$.getValue()
        newSelection.splice(newSelection.indexOf(ordinanceType), 1)
        this._selectedOrdinances$.next(newSelection)
    }

    private getOrdinancesByTypes(types: number[]): Observable<FeatureCollection> {
        const filter = JSON.stringify({ ordinance_type: { $in: types } })
        const params = { filter }

        return this.client.get<FeatureCollection>(`${PATH}/geojson`, { params }).pipe(
            map(result => result !== null ? result : this.empty())
        )
    }

    private mapSelectedOrdinances(types: number[]): OrdinanceSummary[] {
        ORDINANCE_LIST.forEach(ordinance =>
            ordinance.isSelected = types.includes(ordinance.ordinanceType)
        )

        return ORDINANCE_LIST
    }

    private empty(): FeatureCollection {
        return {
            type: 'FeatureCollection',
            features: [],
        }
    }
}
