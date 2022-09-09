import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { JobEvent } from '../../models/event.model';

@Component({
    selector: 'app-event-notification',
    templateUrl: './event-notification.component.html',
    styleUrls: ['./event-notification.component.scss']
})
export class EventNotificationComponent {

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public jobEvent: JobEvent,
        private snackbar: MatSnackBarRef<EventNotificationComponent>
    ) {
        if (jobEvent == null) {
            throw new Error('Missing "jobEvent" argument')
        }
    }

    close() {
        this.snackbar.dismiss()
    }
}
