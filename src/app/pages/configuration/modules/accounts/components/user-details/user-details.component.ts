import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, finalize, first, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';

import { User } from '../../../../../../core/models/user.model';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnChanges {
    form: FormGroup
    isLoading = false

    username: string
    email: string

    availableGroups: string[] = []
    userGroups: string[] = []

    availableRoles: string[] = []
    userRoles: string[] = []

    @Input()
    user: User

    @ViewChild('scroll')
    scroll: ElementRef

    constructor(
        formBuilder: FormBuilder,
        private dialog: MatDialog,
        private service: AccountService
    ) {
        this.form = formBuilder.group({
            doc: [null],
            firstName: [null, Validators.required],
            lastName: [null],
            enabled: [null, Validators.required]
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.user.currentValue) {
            this.loadUserDetails()
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
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        const user: User = {
            id: this.user.id,
            groups: this.userGroups,
            roles: this.userRoles,
            ...this.form.value,
        }

        this.isLoading = true
        this.service.saveUser(user)
            .pipe(
                first(),
                finalize(() => this.isLoading = false)
            )
            .subscribe(() => this.loadUserDetails())
    }

    remove() {
        const options: ConfirmationOptions = {
            title: 'Remover Usuário',
            message: `Tem certeza que deseja remover o usuário "${this.user.username}" ?`
        }

        this.dialog.open(ConfirmationDialog, { data: options })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.isLoading = true),
                switchMap(() => this.service.removeUser(this.user.id)),
                finalize(() => this.isLoading = false)
            )
            .subscribe(() => this.user = null)
    }

    private loadUserDetails() {
        this.isLoading = true
        this.availableGroups = []
        this.userGroups = []
        this.availableRoles = []
        this.userRoles = []
        this.form.reset()
        
        if (this.scroll) {
            this.scroll.nativeElement.scrollTop = 0
        }

        this.service.getUserDetails(this.user.id)
            .pipe(
                first(),
                finalize(() => this.isLoading = false)
            )
            .subscribe(details => {                
                this.form.patchValue(details)
                this.username = this.user.username
                this.email = details.email
                this.userGroups = details.groups
                this.userRoles = details.roles
            })

        this.service.getAvailableUserGroups(this.user.id)
            .pipe(first())
            .subscribe(groups => this.availableGroups = groups)

        this.service.getAvailableUserRoles(this.user.id)
            .pipe(first())
            .subscribe(roles => this.availableRoles = roles)
    }
}
