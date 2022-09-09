import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorGuard } from "./calculator.guard";
import { ActivityFormComponent } from './components/calculator-activity-form/calculator-activity-form.component';
import { CalculatorListComponent } from './components/calculator-result-list/calculator-result-list.component';
import { CalculatorReportComponent } from './components/calculator-report/calculator-report.component';
import { CalculatorMainComponent } from './components/calculator-main/calculator-main.component';
import { CalculatorResultComponent } from './components/calculator-result/calculator-result.component';
import { CalculatorSettingsFormComponent } from './components/calculator-settings-form/calculator-settings-form.component';
import { CalculatorComponent } from './calculator.component';

const routes: Routes = [
    {
        path: '',
        component: CalculatorComponent,
        children: [
            {
                path: 'activity',
                component: ActivityFormComponent,
                canActivate: [CalculatorGuard]
            },
            {
                path: 'result-list',
                component: CalculatorListComponent,
                canActivate: [CalculatorGuard]
            },
            {
                path: 'result/:id',
                component: CalculatorResultComponent,
                canActivate: [CalculatorGuard]
            },
            {
                path: 'report/:id',
                component: CalculatorReportComponent,
                canActivate: [CalculatorGuard]
            },
            {
                path: 'main',
                component: CalculatorMainComponent,
                canActivate: [CalculatorGuard]
            },
            {
                path: 'settings',
                component: CalculatorSettingsFormComponent,
                canActivate: [CalculatorGuard]
            },
            {
                path: '',
                redirectTo: 'main',
                pathMatch: 'full'
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CalculatorRoutingModule { }
