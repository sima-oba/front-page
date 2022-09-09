import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { UploadUsersGuard } from "./upload-users.guard";
import { UploadUsersComponent } from './components/upload-users/upload-users.component';

const routes: Routes = [
    {
        path: '',
        component: UploadUsersComponent,
        canActivate: [UploadUsersGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadUsersRoutingModule { }
