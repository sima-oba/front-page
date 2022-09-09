import { Component } from '@angular/core';

import { OccurrenceService, OccurrenceType } from 'src/app/pages/occurrences/services/occurrence.service';
import { DrawerService } from '../../services/drawer.service';

@Component({
    selector: 'app-occurrences-panel',
    templateUrl: './occurrences-panel.component.html',
    styleUrls: ['./occurrences-panel.component.scss']
})
export class OccurrencesPanelComponent {
    constructor(
        private occurrenceService: OccurrenceService,
        private drawer: DrawerService
    ) { }

    applyFilter(occurrenceType: OccurrenceType) {
        this.occurrenceService.filterOccurrences(occurrenceType)
    }

    close() {
        this.drawer.closeDrawer()
    }
}
