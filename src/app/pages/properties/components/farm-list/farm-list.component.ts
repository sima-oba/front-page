import { Component } from '@angular/core';

import { ProducerService } from '../../services/producer.service';

@Component({
    selector: 'app-farm-list',
    templateUrl: './farm-list.component.html',
    styleUrls: ['./farm-list.component.scss']
})
export class FarmListComponent {
    farms$ = this.service.fetchAllFarms()

    constructor(private service: ProducerService) { }

    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
}
