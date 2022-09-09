import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FarmFormComponent } from './components/farm-form/farm-form.component';
import { FarmListComponent } from './components/farm-list/farm-list.component';
import {ProducerGuard} from "./producer.guard";

const routes: Routes = [
    {
        path: 'farms',
        component: FarmListComponent,
        canActivate: [ProducerGuard]
    },
    {
        path: 'farms/:id',
        component: FarmFormComponent,
        canActivate: [ProducerGuard]
    },
    {
        path: '',
        redirectTo: 'farms',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProducerRoutingModule { }
