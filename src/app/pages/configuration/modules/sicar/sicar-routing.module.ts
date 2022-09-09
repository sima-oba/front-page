import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SicarTutorialComponent } from './components/sicar-tutorial/sicar-tutorial.component';
import { SicarUploadComponent } from './components/sicar-upload/sicar-upload.component';
import {SicarGuard} from "./sicar.guard";

const routes: Routes = [
    {
        path: 'upload',
        component: SicarUploadComponent,
        canActivate: [SicarGuard]
    },
    {
        path: '',
        component: SicarTutorialComponent,
        canActivate: [SicarGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SicarRoutingModule { }
