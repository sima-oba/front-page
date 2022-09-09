import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OccurrenceService } from '../../services/occurrence.service';

@Component({
    selector: 'app-resolve-occurrence-dialog',
    templateUrl: './resolve-occurrence-dialog.component.html',
    styleUrls: ['./resolve-occurrence-dialog.component.css']
})
export class ResolveOccurrenceDialogComponent implements OnInit {
    form: FormGroup
    private followingId: string

    constructor(
        @Inject(MAT_DIALOG_DATA) data: any,
        private dialog: MatDialogRef<ResolveOccurrenceDialogComponent>,
        private formBuilder: FormBuilder,
        private service: OccurrenceService
    ) {
        this.followingId = data.id
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            notes: [null, [Validators.required, Validators.minLength(10)]],
            resolved_date: [null, [Validators.required]],
            resolved_photo: [null, [
                Validators.required,
                MaxSizeValidator(2097152 /* 2MB */),
                AcceptValidator('image/jpeg')
            ]]
        })
    }

    getError(controlName: string): ValidationErrors {
        const control = this.form.get(controlName)
        return control.touched ? control.errors : {}
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        const data = this.form.value
        const resolved = {
            _id: this.followingId,
            notes: data.notes,
            resolved_date: (data.resolved_date as Date).toISOString(),
            resolved_photo: data.resolved_photo
        }

        this.service.resolveOccurrence(resolved)
            .subscribe({
                next: () => this.dialog.close(true),
                error: error => {
                    console.log(error)
                    this.dialog.close(false)
                }
            })
    }
}
