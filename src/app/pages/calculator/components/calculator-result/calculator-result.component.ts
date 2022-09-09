import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CalculatorBundle } from '../../models/calculator-bundle.model';

import { CalculatorResult } from "../../models/calculator-result.model";
import { CalculatorResultService } from "../../services/calculator-result.service";

@Component({
    selector: 'calculator-result-form',
    templateUrl: './calculator-result.component.html',
    styleUrls: ['./calculator-result.component.scss']
})
export class CalculatorResultComponent {
    bundle$: Observable<CalculatorBundle>
    result$: Observable<CalculatorResult>

    constructor(
        protected activatedRouter: ActivatedRoute,
        protected resultService: CalculatorResultService,
        loading: LoadingService
    ) {
        const resultId = activatedRouter.snapshot.params.id

        this.bundle$ = loading.withObservable(
            from(resultService.loadById(resultId))
        )

        this.result$ = this.bundle$
            .pipe(map(bundle => bundle.result))
    }

    getBoxValueClass(value: number): string {
        return value > 0 ? 'box-value-red' : 'box-value-green'
    }
}
