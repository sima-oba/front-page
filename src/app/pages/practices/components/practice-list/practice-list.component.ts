import { ComponentType } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { Farm } from 'src/app/core/models/farm.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { filterNotNull } from 'src/app/core/utils/rxjs';
import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';
import { PracticeBase, PracticeType } from '../../models/practice.model';
import { PracticeService } from '../../services/practice.service';
import { ContainmentMicrodamsEvalComponent } from '../containment-microdams-eval/containment-microdams-eval.component';
import { ContainmentMicrodamsFormComponent } from '../containment-microdams-form/containment-microdams-form.component';
import { ControlledTrafficEvalComponent } from '../controlled-traffic-eval/controlled-traffic-eval.component';
import { ControlledTrafficFormComponent } from '../controlled-traffic-form/controlled-traffic-form.component';
import { CorrectiveEvalComponent } from '../corrective-eval/corrective-eval.component';
import { CorrectivePracticeFormComponent } from '../corrective-form/corrective-form.component';
import { CropRotationEvalComponent } from '../crop-rotation-eval/crop-rotation-eval.component';
import { CropRotationFormComponent } from '../crop-rotation-form/crop-rotation-form.component';
import { EfficiencyBalanceEvalComponent } from '../efficiency-balance-eval/efficiency-balance-eval.component';
import { EfficiencyBalanceFormComponent } from '../efficiency-balance-form/efficiency-balance-form.component';
import { PhytosanitaryEvalComponent } from '../phytosanitary-eval/phytosanitary-eval.component';
import { PhytosanitaryPracticeFormComponent } from '../phytosanitary-form/phytosanitary-form.component';
import { SoilHumidityEvalComponent } from '../soil-humidity-eval/soil-humidity-eval.component';
import { SoilHumidityFormComponent } from '../soil-humidity-form/soil-humidity-form.component';
import { SoilTemperatureEvalComponent } from '../soil-temperature-eval/soil-temperature-eval.component';
import { SoilTemperatureFormComponent } from '../soil-temperature-form/soil-temperature-form.component';
import { SustainableEvalComponent } from '../sustainable-eval/sustainable-eval.component';
import { SustainablePracticeFormComponent } from '../sustainable-form/sustainable-form.component';

@UntilDestroy()
@Component({
    selector: 'app-practice-list',
    templateUrl: './practice-list.component.html',
    styleUrls: ['./practice-list.component.scss']
})
export class PracticeListComponent {
    practiceType: PracticeType
    practices$ = this.service.practices$
    currentFarm: Farm

    title: string
    referenceLink: string
    private formComponent: ComponentType<any>
    private evalComponent: ComponentType<any>

    constructor(
        activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private loading: LoadingService,
        private service: PracticeService
    ) {
        this.practiceType = activatedRoute
            .snapshot
            .params
            .practiceType

        service.currentFarm$
            .pipe(untilDestroyed(this))
            .subscribe(farm => this.currentFarm = farm)

        switch (this.practiceType) {
            case 'CONTROLLED_TRAFFIC_SYSTEM':
                this.title = 'Sistema de tráfego controlado (STC)'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID19.pdf'
                this.formComponent = ControlledTrafficFormComponent
                this.evalComponent = ControlledTrafficEvalComponent
                break

            case 'CORRECTIVE_QUALITY':
                this.title = 'Práticas Corretivas'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID19.pdf'
                this.formComponent = CorrectivePracticeFormComponent
                this.evalComponent = CorrectiveEvalComponent
                break

            case 'CROP_ROTATION':
                this.title = 'Rotação de Culturas'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID05.pdf'
                this.formComponent = CropRotationFormComponent
                this.evalComponent = CropRotationEvalComponent
                break

            case 'IRRIGATION_USE_EFFICIENCY':
                this.title = 'Eficiência de uso da irrigação de precisão e balanço'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID01.pdf'
                this.formComponent = EfficiencyBalanceFormComponent
                this.evalComponent = EfficiencyBalanceEvalComponent
                break

            case 'PHYTOSANITARY':
                this.title = 'Boas Práticas Fitossanitárias'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID19.pdf'
                this.formComponent = PhytosanitaryPracticeFormComponent
                this.evalComponent = PhytosanitaryEvalComponent
                break

            case 'SOIL_RECHARGE_AND_MOISTURE':
                this.title = 'Recarga e Umidade do Solo'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID07.pdf'
                this.formComponent = SoilHumidityFormComponent
                this.evalComponent = SoilHumidityEvalComponent
                break

            case 'SOIL_TEMPERATURE':
                this.title = 'Temperatura do Solo'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID07.pdf'
                this.formComponent = SoilTemperatureFormComponent
                this.evalComponent = SoilTemperatureEvalComponent
                break

            case 'SUSTAINABLE':
                this.title = 'Práticas Sustentáveis'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID19.pd'
                this.formComponent = SustainablePracticeFormComponent
                this.evalComponent = SustainableEvalComponent
                break

            case 'WATER_RUNOFF_CONTAINMENT':
                this.title = 'Contenção de escoamento de água de chuva por curva de nível e microbarragens'
                this.referenceLink = 'https://www.embrapa.br/documents/10180/13599347/ID06.pdf'
                this.formComponent = ContainmentMicrodamsFormComponent
                this.evalComponent = ContainmentMicrodamsEvalComponent
                break

            default:
                throw new Error('unknown practice type: ' + this.practiceType)
        }
    }

    onAdd() {
        this.dialog
            .open(this.formComponent, { data: this.currentFarm })
            .afterClosed()
            .pipe(
                filterNotNull(),
                switchMap(this.addPractice),
                take(1)
            )
            .subscribe(() => {
                this.showSuccess('Nova Prática adicionada.')
                this.service.refreshPractices()
            })
    }

    private addPractice = (practice: PracticeBase): Observable<PracticeBase> => {
        return this.loading.withObservable(
            this.service.addPractice(practice)
        )
    }

    onEvaluate(practice: PracticeBase) {
        this.dialog
            .open(this.evalComponent, { data: practice })
            .afterClosed()
            .pipe(
                filterNotNull(),
                switchMap(this.updatePractice),
                take(1)
            )
            .subscribe(() => {
                this.showSuccess('Avaliação atualizada')
                this.service.refreshPractices()
            })
    }

    private updatePractice = (practice: PracticeBase): Observable<PracticeBase> => {
        return this.loading.withObservable(
            this.service.updatePractice(practice)
        )
    }

    onRemove(practice: PracticeBase) {
        const data: ConfirmationOptions = {
            title: 'Deseja continuar e remover a prática?',
            confirmButton: 'Sim',
            cancelButton: ' Não'
        }

        this.dialog.open(ConfirmationDialog, { data })
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap(() => this.remove(practice)),
                take(1)
            )
            .subscribe(() => {
                this.showSuccess('A prática foi removida')
                this.service.refreshPractices()
            })
    }

    private remove(practice: PracticeBase): Observable<void> {
        return this.loading.withObservable(
            this.service.removePractice(practice._id)
        )
    }

    private showSuccess(title: string) {
        const data: ConfirmationOptions = {
            title,
            cancelButton: false
        }

        this.dialog.open(ConfirmationDialog, { data })
    }

}
