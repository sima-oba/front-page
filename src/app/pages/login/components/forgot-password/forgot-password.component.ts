import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent{
  form: FormGroup

  constructor(formBuilder: FormBuilder) {
      this.form = formBuilder.group({
          email: [null, [
              Validators.required,
              Validators.email
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

      // TODO Send user data
  }
}

