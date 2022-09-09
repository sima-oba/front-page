import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationOptions {
    title: string
    message?: string
    confirmButton?: string
    cancelButton?: string | boolean
}

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.html',
    styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationDialog {
    isCancelVisible: boolean

    constructor(
        private dialog: MatDialogRef<ConfirmationDialog, boolean>,
        @Inject(MAT_DIALOG_DATA) public options: ConfirmationOptions
    ) {
        if (options?.title == null) {
            throw new Error('Missing required field "title"')
        }

        this.isCancelVisible = options?.cancelButton !== false
    }

    confirm() {
        this.dialog.close(true)
    }

    cancel() {
        this.dialog.close(false)
    }
}
