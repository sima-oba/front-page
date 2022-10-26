import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

import { LocationService } from 'src/app/core/services/location.service';
import { ConservationQuery } from '../../models/conservation-unit';
import { DrawerService } from '../../services/drawer.service';
import { IcmbioService } from '../../services/icmbio.service';

@Component({
    selector: 'app-icmbio-panel',
    templateUrl: './icmbio-panel.component.html',
    styleUrls: ['./icmbio-panel.component.scss']
})
export class IcmbioPanelComponent {
    conservationQuery: Partial<ConservationQuery>
    isConservationEnabled: boolean
    isConservationLoading$ = this.icmbioService.isConservationLoading$

    indiState = this.icmbioService.isIndiEnabled
    isGeoSitesEnabled = this.icmbioService.isGeoSitesEnabled
    isGeoParksEnabled = this.icmbioService.isGeoParksEnabled
    isCorridorsEnabled = this.icmbioService.isCorridorsEnabled
    isAtlanticForestEnabled = this.icmbioService.isAtlanticForestEnabled
    isBiomeEnabled = this.icmbioService.isBiomeEnabled
    isCerradoEnabled = this.icmbioService.isCerradoEnabled
    isMatopibaEnabled = this.icmbioService.isMatopibaEnabled
    isVegetationEnabled = this.icmbioService.isVegetationEnabled
    isOtherLoading$ = this.icmbioService.isOtherLoading$

    states$ = this.locationService.getStateCodes()

    constructor(
        private drawer: DrawerService,
        private locationService: LocationService,
        private icmbioService: IcmbioService
    ) {
        this.conservationQuery = this.icmbioService.conservationQuery ?? {}
        this.isConservationEnabled = Object.keys(this.conservationQuery).length > 0
    }

    onConservationCheckChanged() {
        if (this.isConservationEnabled) {
            this.onConservationValuesChanged()
        } else {
            this.icmbioService.disableConservation()
        }
    }

    onConservationValuesChanged() {
        if (this.conservationQuery.category && this.conservationQuery.sphere) {
            const { sphere, category  } = this.conservationQuery
            this.icmbioService.searchConservation(sphere, category)
        }
    }

    onIndigenousLandChanged(event: MatCheckboxChange) {
        this.icmbioService.isIndiEnabled = event.checked
    }

    onGeoSitesChanged(event: MatCheckboxChange) {
        this.icmbioService.isGeoSitesEnabled = event.checked
    }

    onCorridorsChanged(event: MatCheckboxChange) {
        this.icmbioService.isCorridorsEnabled = event.checked
    }

    onGeoParksChanged(event: MatCheckboxChange) {
        this.icmbioService.isGeoParksEnabled = event.checked
    }

    onAtlanticForestChanged(event: MatCheckboxChange) {
        this.icmbioService.isAtlanticForestEnabled = event.checked
    }

    onBiomeChanged(event: MatCheckboxChange) {
        this.icmbioService.isBiomeEnabled = event.checked
    }

    onCerradoChanged(event: MatCheckboxChange) {
        this.icmbioService.isCerradoEnabled = event.checked
    }

    onMatopibaChanged(event: MatCheckboxChange) {
        this.icmbioService.isMatopibaEnabled = event.checked
    }

    onVegetationChanged(event: MatCheckboxChange) {
        this.icmbioService.isVegetationEnabled = event.checked
    }

    close() {
        this.drawer.closeDrawer()
    }

}
