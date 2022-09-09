import { Component } from '@angular/core';
import { DrawerService } from '../../services/drawer.service';
import { VisitService } from '../../services/visit.service';

@Component({
    selector: 'app-visit-panel',
    templateUrl: './visit-panel.component.html',
    styleUrls: ['./visit-panel.component.scss']
})
export class VisitPanelComponent {
    isEnabled$ = this.visitService.isEnabled$

    constructor(
        private drawer: DrawerService,
        private visitService: VisitService
    ) { }

    setEnabled(enabled: boolean) {
        if (enabled) {
            this.visitService.enable()
        } else {
            this.visitService.disable()
        }
    }

    close() {
        this.drawer.closeDrawer()
    }
}