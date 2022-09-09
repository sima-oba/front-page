import { NgModule } from '@angular/core';


import {NgxSmartModalModule} from "ngx-smart-modal";
import {ClimateRiskRoutingModule} from "./climate-risk-routing.module";
import {ClimateRiskFormComponent} from "./components/climate-risk-form/climate-risk-form.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    declarations: [
        ClimateRiskFormComponent
    ],
    imports: [
        SharedModule,
        ClimateRiskRoutingModule,
        NgxSmartModalModule.forRoot()

    ]
})
export class ClimateRiskModule { }
