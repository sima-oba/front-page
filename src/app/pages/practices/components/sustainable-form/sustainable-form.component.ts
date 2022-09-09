import { Component, Inject } from '@angular/core';
import { FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { Sustainable } from '../../models/sustainable.model';
import { PracticeFormComponent } from '../practice-form.component';

@UntilDestroy()
@Component({
    selector: 'app-sustainable-form',
    templateUrl: './sustainable-form.component.html',
    styleUrls: ['./sustainable-form.component.scss']
})
export class SustainablePracticeFormComponent extends PracticeFormComponent<Sustainable> {
    form = this.formBuilder.group({
        practice_type: ['SUSTAINABLE'],
        city: [{ value: null, disabled: true }, Validators.required],
        owner_name: [{ value: null, disabled: true }, Validators.required],
        are_satisfied_with_planting: [null, Validators.required],
        planting_assessment: [null, Validators.required],
        planting_difficulties: [''],
        planting_years: [0, [Validators.required, Validators.min(0)]],
        planting_importance: [''],
        perform_agricultural_operations: [null, Validators.required],
        has_terraces: [null, Validators.required],
        has_erosion: [null, Validators.required],
        has_soil_disturbance: [null, Validators.required],
        is_soil_compactated: [null, Validators.required],
        soil_preparation_frequency: [''],
        bare_soil_months: [0, Validators.min(0)],
        summer_crops: [[]],
        winter_crops: [[]],
        animals_on_plating_area: [''],
        has_earthworms: [null, Validators.required],
        are_earthworms_different: [null],
        are_earthworms_good_for_crops: [null],
        earthworms_consequence_for_crops: [''],
        fertilizing_type: [null, Validators.required],
        follow_technical_guidelines: [null, Validators.required],
        uses_manure: [null, Validators.required],
        manure_per_year: [null, Validators.required],
        no_soil_preparation_start: [null, Validators.required],
        no_soil_preparation_end: [null, [
            Validators.required,
            this.assureDateIsAfter('no_soil_preparation_start')
        ]],
        soil_management_start: [null, Validators.required],
        soil_management_end: [null, [
            Validators.required,
            this.assureDateIsAfter('soil_management_start')
        ]],
        dry_material_accumulation_start: [null, Validators.required],
        dry_material_accumulation_end: [null, [
            Validators.required,
            this.assureDateIsAfter('dry_material_accumulation_start')
        ]],
        dry_material_accumulation_tons: [null, [
            Validators.required,
            Validators.min(0)
        ]]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, Sustainable>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)

        this.setValidationTrigger(
            'no_soil_preparation_start',
            'no_soil_preparation_end'
        )

        this.setValidationTrigger(
            'soil_management_start',
            'soil_management_end'
        )

        this.setValidationTrigger(
            'dry_material_accumulation_start',
            'dry_material_accumulation_end'
        )
    }

    private assureDateIsAfter(otherControlName: string): ValidatorFn {
        return control => {
            if (!control.parent) {
                return null
            }

            const thisTime = control.value?.getTime()
            const otherTime = control.parent.get(otherControlName)?.value?.getTime()

            return otherTime == null || thisTime == null || thisTime > otherTime
                ? null
                : { notAfter: true }
        }
    }

    private setValidationTrigger(sourceControl: string, triggeredControl: string) {
        this.form.get(sourceControl).valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(() =>
                this.form.get(triggeredControl).updateValueAndValidity()
            )
    }

}
