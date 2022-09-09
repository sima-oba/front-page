import { Component } from '@angular/core';

import { PlantingAnticipationService } from '../../services/planting-anticipation.service';

@Component({
    selector: 'app-planting-anticipation-list',
    templateUrl: './planting-anticipation-list.component.html',
    styleUrls: ['./planting-anticipation-list.component.scss']
})
export class PlantingAnticipationListComponent {
    expandDisabled = false
    summary$ = this.service.summary()

    constructor(private service: PlantingAnticipationService) { }

    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    navigateTo(url: string) {
        window.open(url, '_blank')
    }

    remove() {
        this.expandDisabled = true
    }
}
