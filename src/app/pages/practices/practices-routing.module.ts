import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PracticeListComponent } from './components/practice-list/practice-list.component';
import { PracticesGridComponent } from './components/practice-selector/practice-selector.component';
import { PracticeListGuard } from './guards/practice-list.guard';
import { PracticesComponent } from './practices.component';
import { PracticesGuard } from "./practices.guard";


const routes: Routes = [
    {
        path: '',
        component: PracticesComponent,
        canActivate: [PracticesGuard],
        children: [
            {
                path: '',
                component: PracticesGridComponent
            },
            {
                path: ':practiceType',
                component: PracticeListComponent,
                canActivate: [PracticeListGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PracticesRoutingModule { }
