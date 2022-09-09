import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-upload-users-dialog',
    templateUrl: './upload-users-dialog.component.html',
    styleUrls: ['./upload-users-dialog.component.scss']
})
export class UploadUsersDialog {
    readonly MAX_FILE_SIZE = 8388608 /* 8MB */
    readonly MIMETYPES = 'application/zip;application/x-zip-compressed;multipart/x-zip'
    readonly form: FormGroup

    constructor(
        formBuilder: FormBuilder,
        private dialog: MatDialogRef<UploadUsersDialog>
    ) {
        this.form = formBuilder.group({
            file: [null,
                [
                    MaxSizeValidator(this.MAX_FILE_SIZE),
                    AcceptValidator(this.MIMETYPES),
                    Validators.required
                ]
            ]
        })
    }

    get error() {
        const control = this.form.get('file')
        return control.touched ? control.errors : {}
    }

    close() {
        this.dialog.close()
    }

    send() {
        if (this.form.invalid) {
            this.form.markAllAsTouched()

            return
        }

        this.dialog.close(this.form.value['file'])
    }
}
