import { Component } from '@angular/core';
import { DrawerService } from '../../services/drawer.service';
import { OrdinanceService } from "../../services/ordinance.service";

@Component({
    selector: 'app-ordinance-panel',
    templateUrl: './ordinance-panel.component.html',
    styleUrls: ['./ordinance-panel.component.scss']
})
export class OrdinancePanelComponent {
    ordinanceSummary$ = this.ordinanceService.ordinanceSummary$
    ordinances$ = this.ordinanceService.ordinances$

    constructor(
        private drawerService: DrawerService,
        private ordinanceService: OrdinanceService
    ) { }

    selectOrdinance(checked: boolean, ordinanceType: number) {
        if (checked) {
            this.ordinanceService.selectOrdinance(ordinanceType)
        } else {
            this.ordinanceService.deselectOrdinance(ordinanceType)
        }
    }

    close() {
        this.drawerService.closeDrawer()
    }
}
