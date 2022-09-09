import { Component, Input, OnInit } from '@angular/core';

import { JobEvent } from '../../models/event.model';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
    @Input()
    jobEvent: JobEvent

    ngOnInit() {
        if (this.jobEvent == null) {
            throw new Error('Missing "jobEvent" input')
        }
    }
}
