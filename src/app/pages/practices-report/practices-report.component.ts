import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { Event, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@UntilDestroy()
@Component({
    selector: 'app-practices-report',
    templateUrl: './practices-report.component.html',
    styleUrls: ['./practices-report.component.scss']
})
export class PracticesReportComponent {
    isMobile$: Observable<boolean>
    navMode$: Observable<'side' | 'over'>
    navOpened$: Observable<boolean>

    @ViewChild(MatDrawer)
    drawer: MatDrawer

    @ViewChild(MatDrawerContent)
    drawerContent: MatDrawerContent

    constructor(
        router: Router,
        breakpoint: BreakpointObserver
    ) {
        this.isMobile$ = breakpoint.observe('(max-width: 1032px)')
            .pipe(map(breakpoint => breakpoint.matches))

        this.navMode$ = this.isMobile$
            .pipe(map(isMobile => isMobile ? 'over' : 'side'))

        this.navOpened$ = this.isMobile$
            .pipe(map(isMobile => !isMobile))

        router.events
            .pipe(untilDestroyed(this))
            .subscribe(this.onNavigationChanges)
    }

    private onNavigationChanges = (event: Event) => {
        if (!(event instanceof NavigationEnd)) return

        this.scrollToTop()
        this.closeDrawerOnMobileDevice()
    }

    private scrollToTop() {
        this.drawerContent?.scrollTo({ top: 0 })
    }

    private closeDrawerOnMobileDevice() {
        this.isMobile$
            .pipe(first())
            .subscribe(isMobile => {
                if (isMobile) this.drawer.close()
            })
    }
}
