import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DrawerType =
    'farm' |
    'hydrography' |
    'weather' |
    'rainfall' |
    'fire-risk' |
    'irrigated-areas' |
    'ordinance' |
    'occurrences' |
    'visit' |
    'sicar' |
    'icmbio'

export type DrawerState = DrawerType | 'closed'

@Injectable({
    providedIn: 'root'
})
export class DrawerService {
    private _state$ = new BehaviorSubject<DrawerState>('closed')
    state$ = this._state$.asObservable()

    openDrawer(type: DrawerType) {
        this._state$.next(type)
    }

    closeDrawer() {
        this._state$.next('closed')
    }
}
