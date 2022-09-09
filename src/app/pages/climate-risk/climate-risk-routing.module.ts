import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClimateRiskFormComponent} from "./components/climate-risk-form/climate-risk-form.component";
import {ClimateRiskGuard} from "./climate-risk.guard";

const routes: Routes = [
    {
        path: '',
        component: ClimateRiskFormComponent,
        canActivate: [ClimateRiskGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClimateRiskRoutingModule { }
