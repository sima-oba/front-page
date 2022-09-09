import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SicarTutorialComponent } from './components/sicar-tutorial/sicar-tutorial.component';
import { SicarUploadDialogComponent } from './components/sicar-upload-dialog/sicar-upload-dialog.component';
import { SicarUploadComponent } from './components/sicar-upload/sicar-upload.component';
import { SicarRoutingModule } from './sicar-routing.module';


@NgModule({
    declarations: [
        SicarTutorialComponent,
        SicarUploadComponent,
        SicarUploadDialogComponent
    ],
    imports: [
        SharedModule,
        SicarRoutingModule,
        NgxMatFileInputModule
    ]
})
export class SicarModule { }
