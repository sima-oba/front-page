import { NgModule } from '@angular/core';
import { NgxSmartModalModule } from "ngx-smart-modal";

import { SharedModule } from 'src/app/shared/shared.module';
import { CalculatorRoutingModule } from './calculator-routing.module';
import { ActivityFormComponent } from './components/calculator-activity-form/calculator-activity-form.component';
import { CalculatorMainComponent } from './components/calculator-main/calculator-main.component';
import { CalculatorReportComponent } from './components/calculator-report/calculator-report.component';
import { CalculatorListComponent } from './components/calculator-result-list/calculator-result-list.component';
import { CalculatorResultComponent } from './components/calculator-result/calculator-result.component';
import { CalculatorSettingsFormComponent } from './components/calculator-settings-form/calculator-settings-form.component';
import { CalculatorComponent } from './calculator.component';

@NgModule({
    declarations: [
        ActivityFormComponent,
        CalculatorListComponent,
        CalculatorResultComponent,
        CalculatorSettingsFormComponent,
        CalculatorReportComponent,
        CalculatorMainComponent,
        CalculatorComponent
    ],
    imports: [
        SharedModule,
        CalculatorRoutingModule,
        NgxSmartModalModule.forRoot()
    ]
})
export class CalculatorModule { }
