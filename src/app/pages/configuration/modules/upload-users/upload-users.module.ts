import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { UploadUsersDialog } from './components/upload-users-dialog/upload-users-dialog.component';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';
import { UploadUsersRoutingModule } from './upload-users-routing.module';

@NgModule({
    declarations: [
        UploadUsersComponent,
        UploadUsersDialog
    ],
    imports: [
        SharedModule,
        UploadUsersRoutingModule,
        NgxMatFileInputModule
    ]
})
export class UploadUsersModule { }
