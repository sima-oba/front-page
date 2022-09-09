import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';

@NgModule({
    declarations: [
        ConfigurationComponent
    ],
    imports: [
        SharedModule,
        ConfigurationRoutingModule
    ]
})
export class ConfigurationModule { }
