import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-sicar-upload-dialog',
    templateUrl: './sicar-upload-dialog.component.html',
    styleUrls: ['./sicar-upload-dialog.component.scss']
})
export class SicarUploadDialogComponent {
    readonly MAX_FILE_SIZE = 8388608 /* 8MB */
    readonly MIMETYPES = 'application/zip;application/x-zip-compressed;multipart/x-zip'
    readonly form: FormGroup

    constructor(
        formBuilder: FormBuilder,
        private dialog: MatDialogRef<SicarUploadDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public cityId: string
    ) {
        if (cityId == null) {
            throw Error('Missing cityId argument')
        }

        this.form = formBuilder.group({
            sicar: [null,
                [
                    MaxSizeValidator(this.MAX_FILE_SIZE),
                    AcceptValidator(this.MIMETYPES),
                    Validators.required
                ]
            ]
        })
    }

    get error() {
        const control = this.form.get('sicar')
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

        this.dialog.close(this.form.value['sicar'])
    }
}
