import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, finalize, first, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';

import { Group } from '../../models/group.model';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-group-details',
    templateUrl: './group-details.component.html',
    styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent {
    control = new FormControl(null, Validators.required)
    isLoading = false

    availableRoles: string[] = []
    groupRoles: string[] = []

    @Input()
    group: Group

    @ViewChild('scroll')
    scroll: ElementRef

    constructor(
        private dialog: MatDialog,
        private service: AccountService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        this.availableRoles = []
        this.groupRoles = []
        this.control.reset()

        if (changes.group.currentValue) {
            this.loadGroupDetails(this.group.id)
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            )
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            )
        }
    }

    save() {
        if (this.control.invalid) {
            this.control.markAllAsTouched()
            return
        }

        const group: Group = {
            id: this.group?.id,
            name: this.control.value,
            roles: this.groupRoles
        }

        this.isLoading = true
        this.service.saveGroup(group)
            .pipe(
                first(),
                finalize(() => this.isLoading = false)
            )
            .subscribe(result => {
                this.loadGroupDetails(result?.id ?? this.group.id)
            })
    }

    remove() {
        const options: ConfirmationOptions = {
            title: 'Remover Grupo',
            message: `Tem certeza que deseja remover o grupo "${this.group.name}"" ?`
        }

        this.dialog.open(ConfirmationDialog, { data: options })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.isLoading = true),
                switchMap(() => this.service.removeGroup(this.group.id)),
                finalize(() => this.isLoading = false)
            )
            .subscribe(() => this.group = undefined)
    }

    private loadGroupDetails(id: string) {
        if (this.scroll) {
            this.scroll.nativeElement.scrollTop = 0
        }

        this.isLoading = true
        this.service.getGroupDetails(id)
            .pipe(
                first(),
                finalize(() => this.isLoading = false)
            )
            .subscribe(details => {
                this.group = details
                this.control.patchValue(details.name)
                this.groupRoles = details.roles
            })

        this.service.getAvailableGroupRoles(id)
            .pipe(first())
            .subscribe(roles => this.availableRoles = roles)
    }
}
