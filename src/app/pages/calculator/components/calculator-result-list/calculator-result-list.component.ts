import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { LoadingService } from 'src/app/core/services/loading.service';
import { CalculatorBundle } from '../../models/calculator-bundle.model';
import { CalculatorResultService } from '../../services/calculator-result.service';

@UntilDestroy()
@Component({
    selector: 'app-calculator-result-list',
    templateUrl: './calculator-result-list.component.html',
    styleUrls: ['./calculator-result-list.component.scss']
})
export class CalculatorListComponent {
    private refresh$ = new BehaviorSubject(true)
    bundles$: Observable<CalculatorBundle[]>

    constructor(
        private resultService: CalculatorResultService,
        private loading: LoadingService
    ) {
        this.bundles$ = this.refresh$.pipe(
            untilDestroyed(this),
            tap(() => this.loading.on()),
            switchMap(() => from(this.resultService.loadAll())),
            tap(() => this.loading.off())
        )
    }

    async remove(id: string) {
        this.loading.on()
        await this.resultService.removeById(id)
        this.refresh()
    }

    private refresh() {
        this.refresh$.next(true)
    }
}
