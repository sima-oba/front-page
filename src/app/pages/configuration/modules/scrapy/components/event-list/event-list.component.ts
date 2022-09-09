import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JobEvent } from '../../models/event.model';

import { ScrapyService } from '../../services/scrapy.service';

@UntilDestroy()
@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
    jobEvents: JobEvent[] = []

    @ViewChild('scroll')
    scrollElement: ElementRef

    @Input()
    onTab

    constructor(private service: ScrapyService) { }

    ngOnInit() {
        this.service.jobEvents$
            .pipe(untilDestroyed(this))
            .subscribe(events => {
                this.jobEvents = events
                setTimeout(() => this.scrollToBottom(), 0)
            })
    }

    scrollToBottom(smoothly = true) {
        const el = this.scrollElement.nativeElement as HTMLElement

        el.scrollTo({
            top: el.scrollHeight,
            behavior: smoothly ? 'smooth' : 'auto'
        })
    }
}
