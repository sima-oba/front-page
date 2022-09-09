import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentsGridComponent } from "./components/documents-grid/documents-grid.component";
import { DocumentsRoutingModule } from './documents-routing.module';

@NgModule({
    declarations: [
        DocumentsGridComponent
    ],
    imports: [
        SharedModule,
        DocumentsRoutingModule        
    ]
})
export class DocumentsModule { }
