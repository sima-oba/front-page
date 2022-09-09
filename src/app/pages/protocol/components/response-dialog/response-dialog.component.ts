import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs/operators';

import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';
import { Protocol } from '../../models/protocol.model';
import { ProtocolService } from '../../services/protocol.service';

@Component({
    selector: 'app-response-dialog',
    templateUrl: './response-dialog.component.html',
    styleUrls: ['./response-dialog.component.scss']
})
export class ResponseDialogComponent {
    readonly Role = Role
    readonly canModify: boolean
    message: string

    constructor(
        @Inject(MAT_DIALOG_DATA) public protocol: Protocol,
        private dialogRef: MatDialogRef<Protocol, Protocol>,
        private dialog: MatDialog,
        private service: ProtocolService,
        public auth: AuthorizationService
    ) {
        if (protocol == null) {
            throw new Error('Missing argument "protocol"')
        }

        this.canModify =
            auth.hasRole(Role.MANAGE_PROPERTIES) &&
            protocol.status !== 'COMPLETED' &&
            protocol.status !== 'CANCELED'

        this.message = protocol.response?.message ?? ''
    }

    accept() {
        this.showConfirmation('Deseja aceitar o requerimento?')
            .pipe(
                switchMap(() => this.service.acceptProtocol(this.protocol._id))
            )
            .subscribe(() => this.dialogRef.close())
    }

    cancel() {
        this.showConfirmation('Deseja indeferir o requerimento?')
            .pipe(
                switchMap(() => 
                    this.service.cancelProtocol(this.protocol._id, this.message)
                )
            )
            .subscribe(() => this.dialogRef.close())
    }

    complete() {
        this.showConfirmation('Deseja deferir o requerimento?')
            .pipe(
                switchMap(() => 
                    this.service.completeProtocol(this.protocol._id, this.message)
                )
            )
            .subscribe(() => this.dialogRef.close())
    }

    private showConfirmation(message: string) {
        const data: ConfirmationOptions = {
            title: message
        }

        return this.dialog.open(ConfirmationDialog, { data })
            .afterClosed()
            .pipe(filter(Boolean))
    }

}
