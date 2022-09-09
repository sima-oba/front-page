import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScrapyGuard } from "./scrapy.guard";
import { ScrapyComponent } from './scrapy.component';

const routes: Routes = [
    {
        path: '',
        component: ScrapyComponent,
        canActivate: [ScrapyGuard]        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScrapyRoutingModule { }
