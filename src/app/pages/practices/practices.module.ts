import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ContainmentMicrodamsEvalComponent } from './components/containment-microdams-eval/containment-microdams-eval.component';
import { ContainmentMicrodamsFormComponent } from "./components/containment-microdams-form/containment-microdams-form.component";
import { ControlledTrafficEvalComponent } from './components/controlled-traffic-eval/controlled-traffic-eval.component';
import { ControlledTrafficFormComponent } from "./components/controlled-traffic-form/controlled-traffic-form.component";
import { CorrectiveEvalComponent } from './components/corrective-eval/corrective-eval.component';
import { CorrectivePracticeFormComponent } from './components/corrective-form/corrective-form.component';
import { CropRotationEvalComponent } from './components/crop-rotation-eval/crop-rotation-eval.component';
import { CropRotationFormComponent } from "./components/crop-rotation-form/crop-rotation-form.component";
import { EfficiencyBalanceEvalComponent } from './components/efficiency-balance-eval/efficiency-balance-eval.component';
import { EfficiencyBalanceFormComponent } from "./components/efficiency-balance-form/efficiency-balance-form.component";
import { FarmSearchComponent } from './components/farm-search/farm-search.component';
import { PhytosanitaryEvalComponent } from './components/phytosanitary-eval/phytosanitary-eval.component';
import { PhytosanitaryPracticeFormComponent } from './components/phytosanitary-form/phytosanitary-form.component';
import { PracticeListComponent } from './components/practice-list/practice-list.component';
import { PracticesGridComponent } from './components/practice-selector/practice-selector.component';
import { SoilHumidityEvalComponent } from './components/soil-humidity-eval/soil-humidity-eval.component';
import { SoilHumidityFormComponent } from "./components/soil-humidity-form/soil-humidity-form.component";
import { SoilTemperatureEvalComponent } from './components/soil-temperature-eval/soil-temperature-eval.component';
import { SoilTemperatureFormComponent } from "./components/soil-temperature-form/soil-temperature-form.component";
import { SustainableEvalComponent } from './components/sustainable-eval/sustainable-eval.component';
import { SustainablePracticeFormComponent } from './components/sustainable-form/sustainable-form.component';
import { PracticesRoutingModule } from './practices-routing.module';
import { PracticesComponent } from './practices.component';

@NgModule({
    declarations: [
        PhytosanitaryPracticeFormComponent,
        PhytosanitaryEvalComponent,
        SustainablePracticeFormComponent,
        SustainableEvalComponent,
        CorrectivePracticeFormComponent,
        CorrectiveEvalComponent,
        EfficiencyBalanceFormComponent,
        EfficiencyBalanceEvalComponent,
        ControlledTrafficFormComponent,
        ControlledTrafficEvalComponent,
        ContainmentMicrodamsFormComponent,
        ContainmentMicrodamsEvalComponent,
        SoilHumidityFormComponent,
        SoilHumidityEvalComponent,
        CropRotationFormComponent,
        CropRotationEvalComponent,
        SoilTemperatureFormComponent,
        SoilTemperatureEvalComponent,
        PracticesComponent,
        FarmSearchComponent,
        PracticesGridComponent,
        PracticeListComponent
    ],
    imports: [
        SharedModule,
        PracticesRoutingModule
    ]
})
export class PracticesModule { }
