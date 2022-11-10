import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { LoadingService } from 'src/app/core/services/loading.service';
import { UserEmail } from '../../models/registration-result';
import { RegistrationService } from '../../services/registration.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';

type ProfileType = 'OWNER' | 'PUBLIC'

@UntilDestroy()
@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
    isPasswordHidden = true
    successEmail = ''
    form: FormGroup

    private _profile: ProfileType

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private loading: LoadingService,
        private service: RegistrationService
    ) {
        this.profile = 'OWNER'
    }

    get profile(): ProfileType {
        return this._profile
    }

    set profile(value: ProfileType) {
        this._profile = value

        if (this._profile == 'OWNER') {
            this.setUpProducerForm()
        } else {
            this.setUpPublicForm()
        }
    }

    private setUpProducerForm() {
        this.form = this.formBuilder.group({
            doc: [null, Validators.required]
        })
    }

    private setUpPublicForm() {
        this.form = this.formBuilder.group({
            doc: [null,
                Validators.required
            ],
            full_name: [null, [
                Validators.required,
                Validators.minLength(2)
            ]],
            email: [null, [
                Validators.required,
                Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
            ]],
            phone: [null, [
                Validators.required
            ]],
            password: [null, [
                Validators.required,
                Validators.minLength(8)
            ]],
            confirmPassword: [null, [
                Validators.required,
                this.checkPasswordAreEquals
            ]]
        })

        const password = this.form.get('password')
        const confirmPassword = this.form.get('confirmPassword')

        password.valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(() => confirmPassword.updateValueAndValidity())
    }

    private checkPasswordAreEquals = (control: AbstractControl): ValidationErrors | null => {
        const passwordControl = this.form.get('password')
        return passwordControl?.value === control.value ? null : { notEquals: true }
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

        const registration = this.form.value
        const result$ = this._profile == 'OWNER'
            ? this.service.registerOwner(registration)
            : this.service.registerPublicUser(registration)

        this.loading.on()

        result$
            .pipe(
                first(),
                finalize(() => this.loading.off())
            )
            .subscribe({
                next: this.onSuccess,
                error: this.onError
            })
    }

    private onSuccess = (result: UserEmail) => {
        this.successEmail = result.email
    }

    private onError = (error: any) => {
        if (!(error instanceof HttpErrorResponse)) return

        switch (error.status) {
            case 409:
                this.showError(
                    'Erro ao cadastrar usuário',
                    `Usuário com CPF/CNPJ ${this.form.value.doc} já possui cadastro.`,
                )
                break

            case 404:
                this.showError(
                    'Usuário não encontrado',
                    `Ainda não há registro de usuário com CPF/CNPJ ${this.form.value.doc}.`,
                )
                break

            case 400:
                console.log(error)
                if (error.error.error.includes('exists')) {
                    this.showError(
                        'Erro ao cadastrar usuário',
                        `Usuário com CPF/CNPJ ${this.form.value.doc} já possui cadastro.`,
                    )
                } else {
                    this.showError('Falha ao realizar cadastro', error.message)
                }
                break

            default:
                this.showError(
                    'Não foi possível cadastrar usuário',
                    'Por favor, contate o administrador para mais informações'
                )
        }
    }

    private showError(title: string, message: string) {
        const data: ConfirmationOptions = {
            title,
            message,
            cancelButton: false
        }

        this.dialog.open(ConfirmationDialog, { data })
    }
}
