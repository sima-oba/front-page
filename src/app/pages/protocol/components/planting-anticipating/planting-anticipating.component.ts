import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { Protocol, ProtocolValues } from '../../models/protocol.model';
import { ProtocolService } from '../../services/protocol.service';
import { ProtocolForm } from '../protocol-form';

@Component({
    selector: 'app-planting-anticipating',
    templateUrl: './planting-anticipating.component.html',
    styleUrls: ['./planting-anticipating.component.scss']
})
export class PlantingAnticipatingComponent implements ProtocolForm {
    private readonly MAX_FILE_SIZE = 2097152

    farms$ = this.service.getAllFarms()
    form: FormGroup

    constructor(
        formBuilder: FormBuilder,
        private service: ProtocolService
    ) {
        this.form = formBuilder.group({
            farm_id: [null, Validators.required],
            sketch: [null, this.pdfValidator()],
            rg_cnpj: [null, [
                MaxSizeValidator(this.MAX_FILE_SIZE),
                AcceptValidator('image/jpeg')
            ]],
            art: [null, this.pdfValidator()],
            attorney_letter: [null, this.pdfValidator(false)],
            commitment: [null, this.pdfValidator()],
            soy_planting: [null, this.pdfValidator()],
            work_plan: [null, this.pdfValidator()],
            notes: [null]
        })
    }

    private pdfValidator(required = true): ValidatorFn[] {
        const validators = [
            MaxSizeValidator(this.MAX_FILE_SIZE),
            AcceptValidator('application/pdf')
        ]

        if (required) {
            validators.push(Validators.required)
        }

        return validators
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

        const values = this.form.value

        return {
            content: {
                farm_id: values.farm_id,
                notes: values.notes
            },
            attachments: {
                sketch: values.sketch,
                rg_cnpj: values.rg_cnpj,
                art: values.art,
                attorney_letter: values.attorney_letter,
                commitment: values.commitment,
                soy_planting: values.soy_planting,
                work_plan: values.work_plan
            }
        }
    }

}
