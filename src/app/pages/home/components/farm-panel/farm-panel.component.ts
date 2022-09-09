import { Component } from '@angular/core';

import { Farm } from 'src/app/core/models/farm.model';
import { ProducerService } from 'src/app/core/services/producer.service';
import { DrawerService } from '../../services/drawer.service';
import { MapService } from '../../services/map.service';

@Component({
    selector: 'app-farm-panel',
    templateUrl: './farm-panel.component.html',
    styleUrls: ['./farm-panel.component.scss']
})
export class FarmPanelComponent {
    isCitiesEnabled$ = this.producerService.isCitiesEnabled$
    isCitiesLoading$ = this.producerService.isCitiesLoading$
    
    isFarmsLoading$ = this.producerService.isFarmsLoading$
    farms$ = this.producerService.farmSelection$

    constructor(
        private drawerService: DrawerService,
        private mapService: MapService,
        private producerService: ProducerService
    ) { }

    setCitiesEnabled(enabled: boolean) {
        if (enabled) {
            this.producerService.enableCities()
        } else {
            this.producerService.disableCities()
        }
    }

    selectFarms(farms: Farm[]) {
        this.producerService.selectFarms(farms.map(farm => farm._id))
    }

    moveToFarm(farm: Farm) {
        this.mapService.zoomIn({
            latitude: farm.longitude,
            longitude: farm.latitude,
            zoom: 12,
            duration: 600
        })
    }

    close() {
        this.drawerService.closeDrawer()
    }
}
