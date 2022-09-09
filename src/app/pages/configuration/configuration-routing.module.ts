import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigurationComponent } from './configuration.component';
import { ConfigurationGuard } from "./configuration.guard";

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
        canActivate: [ConfigurationGuard],
        children: [
            {
                path: 'accounts',
                loadChildren: () => import('./modules/accounts/accounts.module').then(m => m.AccountsModule)
            },
            {
                path: 'data-import',
                loadChildren: () => import('./modules/scrapy/scrapy.module').then(m => m.ScrapyModule)
            },
            {
                path: 'sicar',
                loadChildren: () => import('./modules/sicar/sicar.module').then(m => m.SicarModule)
            },
            {
                path: 'owners',
                loadChildren: () => import('./modules/upload-users/upload-users.module').then(m => m.UploadUsersModule)
            },
            {
                path: '',
                redirectTo: 'accounts',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
