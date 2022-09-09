import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { MultiSelectItem } from 'src/app/core/models/selection.model';
import { normalizeString } from 'src/app/core/utils/format';

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent {
    private allItems?: MultiSelectItem<any>[]
    filteredItems?: MultiSelectItem<any>[]

    @Input()
    placeholder = ''

    @Output()
    selectedItems = new EventEmitter<any[]>()

    @Output()
    lastSelectedItem = new EventEmitter<any>()

    @Input()
    set items(value: MultiSelectItem<any>[] | null) {
        if (value != null) {
            this.filteredItems = this.allItems = value
        }
    }

    applyFilter(query: string) {
        if (query.length === 0) {
            this.filteredItems = this.allItems
            return
        }

        const normalizedQuery = normalizeString(query)

        this.filteredItems = this.allItems?.filter(item =>
            normalizeString(item.label).includes(normalizedQuery)
        )
    }

    clearFilter() {
        this.filteredItems = this.allItems
    }

    onSelectionChange(event: MatCheckboxChange, item: MultiSelectItem<any>) {
        item.isSelected = event.checked
        
        if (item.isSelected) {
            this.lastSelectedItem.next(item.data)
        }

        const selectedItems = this.allItems
            .filter(item => item.isSelected)
            .map(item => item.data)

        this.selectedItems.next(selectedItems)
    }

}
