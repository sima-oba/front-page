import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filterNotNull } from 'src/app/core/utils/rxjs';
import { ZoomIn } from '../models/map.model';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private _zoomIn$ = new BehaviorSubject<ZoomIn | null>(null)
    zoomIn$ = this._zoomIn$.asObservable().pipe(filterNotNull())

    zoomIn(zoom: ZoomIn) {
        this._zoomIn$.next(zoom)
    }
}
