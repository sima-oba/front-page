import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthenticationService} from "../../../../configurations/authentication/authentication.service";
import {LocalStorageService} from "../../../../configurations/security/storages/local-storage.service";


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
    isPasswordHidden = true
    showCredentialsError = false
    form: FormGroup

    constructor(formBuilder: FormBuilder,
                private authService: AuthenticationService,
                private localStorage: LocalStorageService,
                private router: Router) {
        this.form = formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required]
        })
    }

    getError(controlName: string): ValidationErrors {
        const control = this.form.get(controlName)
        return control.touched ? control.errors : {}
    }

    async submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        this.showCredentialsError = false

        // TODO Improve login logic
        try {
            const responseAuth = await this.authService.doAuthentication(this.form.value);

            if (responseAuth) {
                this.localStorage.setItem('credentials', JSON.stringify(this.form.value))
                this.router.navigate(['/home'])
            }
        } catch (error) {
            if (error === 'Invalid credentials') {
                this.showCredentialsError = true
                this.form.reset()
            } else if (error.endsWith('has outstanding debts')) {
                this.router.navigate(['/notice'])
            }
        }
    }
}
