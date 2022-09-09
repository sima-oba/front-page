import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _isLoading$ = new BehaviorSubject(false)
    isLoading$ = this._isLoading$.asObservable()

    on() {
        this._isLoading$.next(true)
    }

    off() {
        this._isLoading$.next(false)
    }

    withObservable<T>(observable: Observable<T>): Observable<T> {
        return new BehaviorSubject(true).pipe(
            tap(() => this.on()),
            switchMap(() => observable),
            tap(() => this.off()),
            catchError(error => {
                this.off()
                return of(error)
            })
        )
    }

}
