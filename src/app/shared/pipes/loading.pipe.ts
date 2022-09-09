import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { LoadingService } from 'src/app/core/services/loading.service';

@Pipe({
    name: 'loading'
})
export class LoadingPipe implements PipeTransform {

    constructor(private loading: LoadingService) { }

    transform<T>(observable: Observable<T>): Observable<T> {
        return this.loading.withObservable(observable)
    }
}
