import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { from } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

import { LoadingService } from 'src/app/core/services/loading.service';
import Swal from 'sweetalert2';
import { OwnerActivation } from '../../models/owner-registration.model';
import { RegistrationService } from '../../services/registration.service';

@UntilDestroy()
@Component({
    selector: 'app-owner-activation',
    templateUrl: './owner-activation.component.html',
    styleUrls: ['./owner-activation.component.scss']
})
export class OwnerActivationComponent {
    isPasswordHidden = true
    form: FormGroup

    constructor(
        formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private loading: LoadingService,
        private service: RegistrationService
    ) {
        const password = formBuilder.control(null, [
            Validators.required,
            Validators.minLength(8)
        ])

        const confirmPassword = formBuilder.control(null, [
            Validators.required,
            this.checkPasswordAreEquals(password)
        ])

        password.valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(() => confirmPassword.updateValueAndValidity())

        this.form = formBuilder.group({
            password,
            confirmPassword
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

        const activation: OwnerActivation = {
            code: this.activatedRoute.snapshot.params?.code,
            password: this.form.value?.password
        }

        this.loading.on()
        this.service.activateOwner(activation)
            .pipe(
                first(),
                finalize(() => this.loading.off())
            )
            .subscribe({
                next: this.onSuccess,
                error: this.onError
            })
    }

    private checkPasswordAreEquals = (otherControl: AbstractControl): ValidatorFn => {
        return (control: AbstractControl) => otherControl?.value === control.value ? null : { notEquals: true }
    }

    private onSuccess = () => {
        const result = Swal.fire({
            title: 'Cadastro concluído!',
            confirmButtonColor: '#458985'
        })

        from(result).subscribe(() =>
            this.router.navigate(['/login'])
        )
    }

    private onError = (error: any) => {
        if (!(error instanceof HttpErrorResponse)) return

        if (error.status === 403) {
            Swal.fire({
                title: 'Link de ativação inválido.',
                text: 'Por favor, contate o administrador para mais informações.',
                confirmButtonColor: '#458985'
            })
        } else {
            Swal.fire({
                title: 'Erro',
                text: error.message,
                confirmButtonColor: '#458985'
            })
        }
    }
}
