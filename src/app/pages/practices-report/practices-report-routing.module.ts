import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SustainableComponent } from './components/sustainable/sustainable.component';
import { TotalComponent } from './components/total/total.component';
import { PracticesReportComponent } from './practices-report.component';

import { ContainmentMicrodamsComponent } from './components/containment-microdams/containment-microdams.component';
import { CorrectiveQualityComponent } from './components/corrective/corrective.component';
import { CultureRotationComponent } from './components/culture-rotation/culture-rotation.component';
import { EfficiencyBalanceComponent } from './components/efficiency-balance/efficiency-balance.component';
import { PhytosanitaryComponent } from './components/phytosanitary/phytosanitary.component';
import { PracticesReportGuard } from "./practices-report.guard";

const routes: Routes = [
    {
        path: '',
        component: PracticesReportComponent,
        canActivate: [PracticesReportGuard],
        children: [
            {
                path: 'total',
                component: TotalComponent,
                canActivate: [PracticesReportGuard]
            },
            {
                path: 'containment-microdams',
                component: ContainmentMicrodamsComponent,
                canActivate: [PracticesReportGuard]
            },
            {
                path: 'corrective',
                component: CorrectiveQualityComponent,
                canActivate: [PracticesReportGuard]
            },
            {
                path: 'culture-rotation',
                component: CultureRotationComponent,
                canActivate: [PracticesReportGuard]
            },
            {
                path: 'efficiency-balance',
                component: EfficiencyBalanceComponent,
                canActivate: [PracticesReportGuard]
            },
            {
                path: 'phytosanitary',
                component: PhytosanitaryComponent,
                canActivate: [PracticesReportGuard]
            },
            {
                path: 'sustainable',
                component: SustainableComponent,
                canActivate: [PracticesReportGuard]
            },
            {
                path: '',
                redirectTo: 'total',
                pathMatch: 'full'
            }
        ]        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PracticesReportRoutingModule { }
