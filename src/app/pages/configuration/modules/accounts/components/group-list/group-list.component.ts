import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { Group } from '../../models/group.model';
import { AccountService } from '../../services/account.service';

@UntilDestroy()
@Component({
    selector: 'app-group-list',
    templateUrl: './group-list.component.html',
    styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent {
    filteredGroups$: Observable<Group[]>
    searchControl = new FormControl()
    lastSelectedId = ''

    @Output()
    onGroupSelected = new EventEmitter<Group>()

    @Output()
    onClickAdd = new EventEmitter()

    constructor(private service: AccountService) {
        const search$ = this.searchControl
            .valueChanges
            .pipe(
                startWith(''),
                debounceTime(400),
                distinctUntilChanged()
            )

        this.filteredGroups$ = combineLatest([search$, this.service.groups$])
            .pipe(
                untilDestroyed(this),
                map(this.filterList),
            )
    }

    onSelectionChange(group: Group) {
        this.lastSelectedId = group?.id
        this.onGroupSelected.next(group)
    }

    onAdd() {
        this.lastSelectedId = ''
        this.onClickAdd.next()
    }

    private filterList = (combinedResult: [string, Group[]]): Group[] => {
        const [query, groups] = combinedResult

        if (query.length === 0) {
            return groups
        }

        const normalizedQuery = query.toLocaleLowerCase()

        return groups.filter(group =>
            group.name.toLowerCase().includes(normalizedQuery)
        )
    }
}
