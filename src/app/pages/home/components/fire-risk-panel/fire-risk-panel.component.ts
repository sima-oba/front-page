import { Component } from '@angular/core';
import { DrawerService } from '../../services/drawer.service';
import { FireRiskService } from '../../services/fire-risk.service';

@Component({
    selector: 'app-fire-risk-panel',
    templateUrl: './fire-risk-panel.component.html',
    styleUrls: ['./fire-risk-panel.component.scss']
})
export class FireRiskPanelComponent {
    isEnabled$ = this.fireRiskService.isEnabled$

    constructor(
        private drawer: DrawerService,
        private fireRiskService: FireRiskService
    ) { }

    setEnabled(enabled: boolean) {
        if (enabled) {
            this.fireRiskService.enable()
        } else {
            this.fireRiskService.disable()
        }
    }

    close() {
        this.drawer.closeDrawer()
    }
}
