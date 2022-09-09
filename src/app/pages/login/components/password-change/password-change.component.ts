import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {
    isPasswordHidden = true
    form: FormGroup

    constructor(formBuilder: FormBuilder) {
        this.form = new FormGroup({})

        const newPassword = formBuilder.control(
            null, [Validators.required, Validators.minLength(8)]
        )

        const confirmNewPassword = formBuilder.control(
            null, [Validators.required, this.checkPasswordAreEquals]
        )

        this.form.addControl('newPassword', newPassword)
        this.form.addControl('confirmNewPassword', confirmNewPassword)

        // Validates "confirmNewPassword" control whenever the newPassword changes
        newPassword.valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(() => confirmNewPassword.updateValueAndValidity())
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

        // TODO Send user data
    }

    private checkPasswordAreEquals = (control: AbstractControl): ValidationErrors => {
        const passwordControl = this.form.get('newPassword')
        return passwordControl?.value === control.value ? null : { notEquals: true }
    }
}
