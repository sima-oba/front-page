import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlantingAnticipationListComponent } from './components/planting-anticipation-list/planting-anticipation-list.component';
import { PlantingAnticipationRequestComponent } from './components/planting-anticipation-request/planting-anticipation-request.component';
import { PlantingAnticipationGuard } from "./planting-anticipation.guard";

const routes: Routes = [
    {
        path: 'request',
        component: PlantingAnticipationRequestComponent,
        canActivate: [PlantingAnticipationGuard]
    },
    {
        path: '',
        component: PlantingAnticipationListComponent,
        canActivate: [PlantingAnticipationGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlantingAnticipationRoutingModule { }
