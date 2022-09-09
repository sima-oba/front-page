import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Protocol } from '../../models/protocol.model';
import { ProtocolForm } from '../protocol-form';

@Component({
    selector: 'app-simple-request',
    templateUrl: './simple-request.component.html',
    styleUrls: ['./simple-request.component.scss']
})
export class SimpleRequestComponent implements ProtocolForm {
    form: FormGroup

    constructor(formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            text: [null, [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(1500)
            ]]
        })
    }

    getError(controlName: string): ValidationErrors {
        const control = this.form.get(controlName)
        return control.touched ? control.errors : {}
    }

    getValues(): Protocol {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return null
        }

        return {
            content: this.form.value
        }
    }

}
