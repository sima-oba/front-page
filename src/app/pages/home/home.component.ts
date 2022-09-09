import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DrawerService, DrawerState } from './services/drawer.service';

@UntilDestroy()
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    drawerState: DrawerState

    constructor(
        router: Router,
        drawerService: DrawerService
    ) {
        drawerService.state$
            .pipe(untilDestroyed(this))
            .subscribe(state => this.drawerState = state)

        const menuOption = router.getCurrentNavigation().extras.state?.menu

        if (menuOption) {
            drawerService.openDrawer(menuOption)
        }
    }

    @ViewChild('drawer')
    set drawer(drawer: MatDrawer) {
        if (drawer) {
            setTimeout(() => drawer.open())
        }
    }
}
