import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';

import { SharedModule } from 'src/app/shared/shared.module';
import { ContainmentMicrodamsComponent } from './components/containment-microdams/containment-microdams.component';
import { CorrectiveQualityComponent } from './components/corrective/corrective.component';
import { CultureRotationComponent } from './components/culture-rotation/culture-rotation.component';
import { EfficiencyBalanceComponent } from './components/efficiency-balance/efficiency-balance.component';
import { NavPanelComponent } from './components/nav-panel/nav-panel.component';
import { PhytosanitaryComponent } from './components/phytosanitary/phytosanitary.component';
import { SustainableComponent } from './components/sustainable/sustainable.component';
import { TotalComponent } from './components/total/total.component';
import { PracticesReportRoutingModule } from './practices-report-routing.module';
import { PracticesReportComponent } from './practices-report.component';
import { SustainableAnswersComponent } from './components/sustainable/sustainable-answers/sustainable-answers.component';
import { SustainablePlantingAssessmentComponent } from './components/sustainable/sustainable-planting-assessment/sustainable-planting-assessment.component';
import { ContainmentMicrodamsAnswersComponent } from './components/containment-microdams/containment-microdams-answers/containment-microdams-answers.component';
import { ContainmentMicrodamsQualityComponent } from './components/containment-microdams/containment-microdams-quality/containment-microdams-quality.component';
import { LevelCurvesQualityComponent } from './components/containment-microdams/level-curves-quality/level-curves-quality.component';

@NgModule({
  declarations: [
    TotalComponent, 
    PhytosanitaryComponent, 
    SustainableComponent, 
    CorrectiveQualityComponent, 
    CultureRotationComponent, 
    ContainmentMicrodamsComponent, 
    EfficiencyBalanceComponent, 
    PracticesReportComponent, 
    NavPanelComponent, 
    SustainableAnswersComponent, 
    SustainablePlantingAssessmentComponent, 
    ContainmentMicrodamsAnswersComponent, 
    ContainmentMicrodamsQualityComponent, 
    LevelCurvesQualityComponent
  ],
  imports: [
    NgChartsModule,
    SharedModule,
    PracticesReportRoutingModule
  ]
})
export class PracticesReportModule { }
