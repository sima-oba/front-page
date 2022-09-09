import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OccurrencesComponent } from './components/occurrences/occurrences.component';
import { ReportOccurrenceComponent } from './components/report-occurrence/report-occurrence.component';
import { OccurrencesGuard } from "./occurrences.guard";

const routes: Routes = [
    {
        path: 'report',
        component: ReportOccurrenceComponent,
        canActivate: [OccurrencesGuard]
    },
    {
        path: '',
        component: OccurrencesComponent,
        canActivate: [OccurrencesGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OccurrencesRoutingModule { }
