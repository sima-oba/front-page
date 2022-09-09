import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { SharedModule } from 'src/app/shared/shared.module';
import { FarmPanelComponent } from './components/farm-panel/farm-panel.component';
import { FireRiskPanelComponent } from './components/fire-risk-panel/fire-risk-panel.component';
import { HydrographyPanelComponent } from './components/hydrography-panel/hydrography-panel.component';
import { IcmbioPanelComponent } from './components/icmbio-panel/icmbio-panel.component';
import { IrrigatedAreasPanelComponent } from "./components/irrigated-areas-panel/irrigated-areas-panel.component";
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OccurrencePhotoDialogComponent } from './components/occurrence-photo-dialog/occurrence-photo-dialog.component';
import { OccurrencesPanelComponent } from './components/occurrences-panel/occurrences-panel.component';
import { OrdinancePanelComponent } from "./components/ordinance-panel/ordinance-panel.component";
import { RainfallDialogComponent } from './components/rainfall-dialog/rainfall-dialog.component';
import { RainfallPanelComponent } from './components/rainfall-panel/rainfall-panel.component';
import { ResolveOccurrenceDialogComponent } from './components/resolve-occurrence-dialog/resolve-occurrence-dialog.component';
import { SicarPanelComponent } from './components/sicar-panel/sicar-panel.component';
import { VisitDialogComponent } from './components/visit-dialog/visit-dialog.component';
import { VisitPanelComponent } from './components/visit-panel/visit-panel.component';
import { WeatherPanelComponent } from './components/weather-panel/weather-panel.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
    declarations: [
        HomeComponent,
        NavbarComponent,
        MapComponent,
        HydrographyPanelComponent,
        WeatherPanelComponent,
        WeatherPanelComponent,
        FarmPanelComponent,
        OrdinancePanelComponent,
        RainfallPanelComponent,
        RainfallDialogComponent,
        FireRiskPanelComponent,
        IrrigatedAreasPanelComponent,
        OccurrencesPanelComponent,
        OccurrencePhotoDialogComponent,
        ResolveOccurrenceDialogComponent,
        VisitPanelComponent,
        VisitDialogComponent,
        SicarPanelComponent,
        IcmbioPanelComponent
    ],
    imports: [
        SharedModule,
        HomeRoutingModule,
        ScrollingModule,
        NgChartsModule
    ]
})
export class HomeModule { }
