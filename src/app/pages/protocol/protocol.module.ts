import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { SharedModule } from 'src/app/shared/shared.module';
import { PlantingAnticipatingComponent } from './components/planting-anticipating/planting-anticipating.component';
import { ProtocolListComponent } from './components/protocol-list/protocol-list.component';
import { RequestDialogComponent } from './components/request-dialog/request-dialog.component';
import { ResponseDialogComponent } from './components/response-dialog/response-dialog.component';
import { SimpleRequestComponent } from './components/simple-request/simple-request.component';
import { ProtocolRoutingModule } from './protocol-routing.module';
import { SimpleRequestContentComponent } from './components/simple-request-content/simple-request-content.component';
import { PlantingAnticipatingContentComponent } from './components/planting-anticipating-content/planting-anticipating-content.component';

@NgModule({
    declarations: [
        ProtocolListComponent,
        RequestDialogComponent,
        SimpleRequestComponent,
        PlantingAnticipatingComponent,
        ResponseDialogComponent,
        SimpleRequestContentComponent,
        PlantingAnticipatingContentComponent
    ],
    imports: [
        SharedModule,
        ProtocolRoutingModule,
        NgxMatFileInputModule,
        NgxMatFileInputModule,
        NgxMaskModule.forChild()
    ]
})
export class ProtocolModule { }
