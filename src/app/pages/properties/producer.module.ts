import { NgModule } from '@angular/core';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProducerRoutingModule } from './producer-routing.module';
import { FarmFormComponent } from './components/farm-form/farm-form.component';
import { FarmListComponent } from './components/farm-list/farm-list.component';

@NgModule({
    declarations: [
        FarmFormComponent,
        FarmListComponent
    ],
    imports: [
        SharedModule,
        ProducerRoutingModule,
        NgxMatFileInputModule
    ]
})
export class ProducerModule { }
