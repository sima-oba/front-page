import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { SharedModule } from 'src/app/shared/shared.module';
import { PlantingAnticipationListComponent } from './components/planting-anticipation-list/planting-anticipation-list.component';
import { PlantingAnticipationRequestComponent } from './components/planting-anticipation-request/planting-anticipation-request.component';
import { PlantingAnticipationRoutingModule } from './planting-anticipation-routing.module';

@NgModule({
    declarations: [
        PlantingAnticipationListComponent,
        PlantingAnticipationRequestComponent
    ],
    imports: [
        SharedModule,
        PlantingAnticipationRoutingModule,
        NgxMatFileInputModule,
        NgxMaskModule.forChild()
    ]
})
export class PlantingAnticipationModule { }
