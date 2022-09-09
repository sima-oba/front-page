import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { NoticeComponent } from './core/components/notice/notice.component';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
    },
    {
        path: 'notice',
        component: NoticeComponent
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'calculator',
        loadChildren: () => import('./pages/calculator/calculator.module').then(m => m.CalculatorModule)
    },
    {
        path: 'occurrences',
        loadChildren: () => import('src/app/pages/occurrences/occurrences.module').then(m => m.OccurrencesModule)
    },
    {
        path: 'properties',
        loadChildren: () => import('src/app/pages/properties/producer.module').then(m => m.ProducerModule)
    },
    {
        path: 'planting-anticipation',
        loadChildren: () => import('src/app/pages/planting-anticipation/planting-anticipation.module').then(m => m.PlantingAnticipationModule)
    },
    {
        path: 'practices',
        loadChildren: () => import('src/app/pages/practices/practices.module').then(m => m.PracticesModule)
    },
    {
        path: 'practices-report',
        loadChildren: () => import('src/app/pages/practices-report/practices-report.module').then(m => m.PracticesReportModule)
    },
    {
        path: 'configuration',
        loadChildren: () => import('src/app/pages/configuration/configuration.module').then(m => m.ConfigurationModule)
    },
    {
        path: 'protocol',
        loadChildren: () => import('./pages/protocol/protocol.module').then(m => m.ProtocolModule)
    },
    {
        path: 'climate-risk',
        loadChildren: () => import('./pages/climate-risk/climate-risk.module').then(m => m.ClimateRiskModule)
    },
    {
        path: 'documents',
        loadChildren: () => import('./pages/documents/documents.module').then(m => m.DocumentsModule)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
