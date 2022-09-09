import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DocumentsGridComponent} from "./components/documents-grid/documents-grid.component";
import {DocumentsGuard} from "./documents.guard";

const routes: Routes = [
    {
        path: '',
        component: DocumentsGridComponent,
        canActivate: [DocumentsGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentsRoutingModule { }
