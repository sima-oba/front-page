import { Component } from '@angular/core';
import { AuthorizationService } from 'src/app/configurations/security/authorization.service';

import { DrawerService, DrawerType } from '../../services/drawer.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    constructor(
        public auth: AuthorizationService,
        private drawerService: DrawerService
    ) { }

    openDrawer(type: DrawerType) {
        this.drawerService.openDrawer(type)
    }
}
