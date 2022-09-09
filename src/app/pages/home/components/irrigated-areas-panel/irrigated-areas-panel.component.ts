import { Component } from '@angular/core';
import { DrawerService } from '../../services/drawer.service';
import { IrrigatedAreasService } from '../../services/irrigated-areas.service';

@Component({
    selector: 'app-irrigated-areas-panel',
    templateUrl: './irrigated-areas-panel.component.html',
    styleUrls: ['./irrigated-areas-panel.component.scss']
})
export class IrrigatedAreasPanelComponent {
    isIrrigatedAreasEnabled$ = this.irrigatedAreasService.isIrrigatedAreasEnabled$
    isPivotsEnabled$ = this.irrigatedAreasService.isPivotsEnabled$

    constructor(
        private drawer: DrawerService,
        private irrigatedAreasService: IrrigatedAreasService,
    ) { }

    setIrrigatedAreasEnabled(enabled: boolean) {
        if (enabled) {
            this.irrigatedAreasService.enableIrrigatedAreas()
        } else {
            this.irrigatedAreasService.disableIrrigatedAreas()
        }
    }

    setPivotsEnabled(enabled: boolean) {
        if (enabled) {
            this.irrigatedAreasService.enablePivots()
        } else {
            this.irrigatedAreasService.disablePivots()
        }
    }

    close() {
        this.drawer.closeDrawer()
    }
}