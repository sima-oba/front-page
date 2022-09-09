import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, skip } from 'rxjs/operators';
import { EventListComponent } from './components/event-list/event-list.component';

import { EventNotificationComponent } from './components/event-notification/event-notification.component';
import { JobEvent } from './models/event.model';
import { ScrapyService } from './services/scrapy.service';

const JOBS_TAB_INDEX = 0
const EVENTS_TAB_INDEX = 1

@UntilDestroy()
@Component({
    selector: 'app-scrapy',
    templateUrl: './scrapy.component.html',
    styleUrls: ['./scrapy.component.scss']
})
export class ScrapyComponent implements OnInit {
    private shouldShowNotification = false

    @ViewChild('eventListEl')
    eventListEl: EventListComponent

    constructor(
        private snackBar: MatSnackBar,
        private scrapyService: ScrapyService
    ) { }

    ngOnInit() {
        this.scrapyService.jobEvents$
            .pipe(
                untilDestroyed(this),
                skip(1),
                filter(() => this.shouldShowNotification)
            )
            .subscribe(events =>
                this.showNotification(events[events.length - 1])
            )
    }

    onTabChange(tabEvent: MatTabChangeEvent) {
        this.shouldShowNotification = tabEvent.index === JOBS_TAB_INDEX
        
        if (tabEvent.index === EVENTS_TAB_INDEX) {
            this.eventListEl.scrollToBottom(false)
        }
    }

    private showNotification(jobEvent: JobEvent) {
        this.snackBar.openFromComponent(EventNotificationComponent, {
            data: jobEvent,
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: 'snackbar'
        })
    }
}
