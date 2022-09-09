import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { OccurrencesComponent } from './components/occurrences/occurrences.component';
import { ReportOccurrenceComponent } from './components/report-occurrence/report-occurrence.component';
import { ResolveOccurrenceDialogComponent } from './components/resolve-occurrence-dialog/resolve-occurrence-dialog.component';
import { OccurrencesRoutingModule } from './occurrences-routing.module';

@NgModule({
    declarations: [
        OccurrencesComponent,
        ReportOccurrenceComponent,
        ResolveOccurrenceDialogComponent
    ],
    imports: [
        SharedModule,
        OccurrencesRoutingModule,
        NgxMatFileInputModule
    ]
})
export class OccurrencesModule { }
