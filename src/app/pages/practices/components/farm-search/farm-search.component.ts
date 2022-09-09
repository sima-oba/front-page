import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Farm } from 'src/app/core/models/farm.model';
import { normalizeString } from 'src/app/core/utils/format';

@Component({
    selector: 'app-farm-search',
    templateUrl: './farm-search.component.html',
    styleUrls: ['./farm-search.component.scss']
})
export class FarmSearchComponent {
    private allFarms?: Farm[]
    filteredFarms?: Farm[]

    @Input()
    selectedFarm?: Farm

    @Output()
    selectedFarmChange = new EventEmitter<Farm>()

    @Input()
    set farms(value: Farm[]) {
        this.filteredFarms = this.allFarms = value
    }

    applyFilter(query: string) {
        if (query.length === 0) {
            this.filteredFarms = this.allFarms
            return
        }

        const normalizedQuery = normalizeString(query)

        this.filteredFarms = this.allFarms?.filter(farm =>
            normalizeString(farm.farm_name).includes(normalizedQuery)
        )
    }

    clearFilter() {
        this.filteredFarms = this.allFarms
    }

    isSelected(farm: Farm): boolean {
        return farm?._id === this.selectedFarm?._id
    }

    onItemClick(farm: Farm) {
        this.selectedFarm = farm
        this.selectedFarmChange.next(farm)
    }

}
