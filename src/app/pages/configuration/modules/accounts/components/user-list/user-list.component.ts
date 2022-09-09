import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { User } from '../../../../../../core/models/user.model';
import { AccountService } from '../../services/account.service';

@UntilDestroy()
@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
    filteredUsers$: Observable<User[]>
    searchControl = new FormControl()
    lastSelectedId = ''

    @Output()
    onUserSelected = new EventEmitter<User>()

    constructor(private service: AccountService) {
        const search$ = this.searchControl
            .valueChanges
            .pipe(
                startWith(''),
                debounceTime(400),
                distinctUntilChanged()
            )

        this.filteredUsers$ = combineLatest([search$, this.service.users$])
            .pipe(
                untilDestroyed(this),
                map(this.filterList),
                map(this.sortUsersByName)
            )
    }

    onSelectionChange(user: User) {
        this.lastSelectedId = user.id
        this.onUserSelected.next(user)
    }

    private filterList = (combinedResult: [string, User[]]): User[] => {
        const [query, users] = combinedResult

        if (query.length === 0) {
            return users
        }

        const normalizedQuery = query.toLocaleLowerCase()

        return users.filter(user => {
            if (user.username.toLowerCase().includes(normalizedQuery)) {
                return true
            }

            const fullname = user.firstName + ' ' + user.lastName

            if (fullname.toLowerCase().includes(normalizedQuery)) {
                return true
            }

            return false
        })
    }

    private sortUsersByName = (users: User[]): User[] => {
        return users.sort((first, second) => {
            const firstFullname = first.firstName + first.lastName
            const secondFullname = second.firstName + second.lastName

            return firstFullname.localeCompare(secondFullname)
        })
    } 
}
