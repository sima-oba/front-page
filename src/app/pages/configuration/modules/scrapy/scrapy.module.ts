import { NgModule } from '@angular/core';

import { ScrapyComponent } from './scrapy.component';
import { ScrapyRoutingModule } from './scrapy-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobComponent } from './components/job/job.component';
import { JobConfigDialog } from './components/job-config-dialog/job-config-dialog.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventComponent } from './components/event/event.component';
import { EventNotificationComponent } from './components/event-notification/event-notification.component';

@NgModule({
  declarations: [
    ScrapyComponent,
    JobConfigDialog,
    JobComponent,
    JobListComponent,
    EventListComponent,
    EventComponent,
    EventNotificationComponent
  ],
  imports: [
    SharedModule,
    ScrapyRoutingModule
  ]
})
export class ScrapyModule { }
