import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import {delay, map, tap} from 'rxjs/operators';

import { DrawerService } from '../../services/drawer.service';
import { HydrographyService } from '../../services/hydrography.service';
import { RiverSummary } from '../../models/river-summary.model'
import { Aquifer } from '../../models/aquifer.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

const FEATURED_AQUIFERS = ['Bambuí Cárstico', 'Urucuia-Areado', 'Fraturado Centro-Sul', 'Fraturado Semiárido']

@UntilDestroy()
@Component({
    selector: 'app-hydrography-panel',
    templateUrl: './hydrography-panel.component.html',
    styleUrls: ['./hydrography-panel.component.scss']
})
export class HydrographyPanelComponent {
    isRiversAndLimitsLoading$ = combineLatest([
        this.hydrographyService.isRiversLoading$,
        this.hydrographyService.isLimitsLoading$
    ]).pipe(
        map(([isRiversLoading, isLimitsLoading]) => isRiversLoading || isLimitsLoading)
    )

    isLimitsSelected$ = this.hydrographyService.isLimitsSelected$

    isFlowRatesLoading$ = this.hydrographyService.isFlowRatesLoading$
    isQmldSelected$ = this.hydrographyService.isQmldSelected$
    isQ90Selected$ = this.hydrographyService.isQ90Selected$
    
    riversSelection = new SelectionModel(true)
    riversSummary$: Observable<RiverSummary[]>
    isAllRiversSelected = false

    isAquifersLoading$ = this.hydrographyService.isAquifersLoading$
    aquiferSummary$ = this.hydrographyService.aquiferSummary$
    featuredAquiferSummary$: Observable<Aquifer[]>
    selectedAquifer = ''
    isloading: boolean = false;

    constructor(
        private drawerService: DrawerService,
        private hydrographyService: HydrographyService
    ) {
        this.riversSummary$ = this.hydrographyService.riverSummary$
            .pipe(tap(this.setUpSelectedRivers))

        this.hydrographyService.isAllRiversSelected$
            .pipe(untilDestroyed(this))
            .subscribe(allSelected => this.isAllRiversSelected = allSelected)

        this.hydrographyService.selectedAquifer$
            .pipe(untilDestroyed(this))
            .subscribe(aquiferId => this.selectedAquifer = aquiferId)

        this.featuredAquiferSummary$ = this.aquiferSummary$
            .pipe(map(this.filterFeaturedAquifers))
    }

    selectRiver(checked: boolean, riverId: string) {
        if (checked) {
            this.riversSelection.select(riverId)
            this.hydrographyService.selectRiver(riverId);
        } else {
            this.riversSelection.deselect(riverId)
            this.hydrographyService.deselectRiver(riverId);
        }
    }

    selectAllRivers(checked: boolean) {
        if (checked) {
            this.hydrographyService.selectAllRivers()
        } else {
            this.hydrographyService.deselectAllRivers()
        }
    }

    deselectAllRivers() {
        this.hydrographyService.deselectAllRivers()
    }

    selectAquifer(checked: boolean, aquiferId: string) {
        this.selectedAquifer = aquiferId

        if (checked) {
            this.hydrographyService.selectAquifer(aquiferId);
        } else {
            this.hydrographyService.deselectAquifers();
        }
    }

    selectQ90(checked: boolean) {
        this.hydrographyService.selectQ90(checked);
    }

    selectQmld(checked: boolean) {
        this.hydrographyService.selectQmld(checked);
    }

    selectLimits(checked: boolean) {
        this.isloading = true;
        this.hydrographyService.selectLimits(checked);
        setTimeout(() =>
            {
                this.isloading = false;            },
            2000);

    }

    close() {
        this.drawerService.closeDrawer()
    }

    private setUpSelectedRivers = (rivers: RiverSummary[]) => {        
        rivers.forEach(river => {
            if (river.isSelected) {
                this.riversSelection.select(river._id)
            } else {
                this.riversSelection.deselect(river._id)
            }
        })
    }

    private filterFeaturedAquifers = (aquifers: Aquifer[]) => {
        return aquifers.filter(aquifer =>
            FEATURED_AQUIFERS.includes(aquifer.name)
        )
    }

}
