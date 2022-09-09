import { Component } from '@angular/core';

import { DrawerService } from '../../services/drawer.service';
import { RainfallService } from '../../services/rainfall.service';

@Component({
    selector: 'app-rainfall-panel',
    templateUrl: './rainfall-panel.component.html',
    styleUrls: ['./rainfall-panel.component.scss']
})
export class RainfallPanelComponent {
    stations$ = this.rainfallService.stationsSelection$

    constructor(
        private drawerService: DrawerService,
        private rainfallService: RainfallService
    ) { }

    selectStation(checked: boolean, id: string) {
        if (checked) {
            this.rainfallService.selectStation(id)
        } else {
            this.rainfallService.deselectStation(id)
        }
    }

    close() {
        this.drawerService.closeDrawer()
    }
}
