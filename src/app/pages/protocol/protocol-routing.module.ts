import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProtocolListComponent } from './components/protocol-list/protocol-list.component';
import { ProtocolGuard } from "./protocol.guard";

const routes: Routes = [
    {
        path: '',
        component: ProtocolListComponent,
        canActivate: [ProtocolGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProtocolRoutingModule { }
