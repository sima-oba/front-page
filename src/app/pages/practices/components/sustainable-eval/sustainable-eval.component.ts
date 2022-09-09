import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';

import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Sustainable } from '../../models/sustainable.model';

@Component({
    selector: 'app-sustainable-eval',
    templateUrl: './sustainable-eval.component.html',
    styleUrls: ['./sustainable-eval.component.scss']
})
export class SustainableEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: Sustainable,
        private dialog: MatDialogRef<Sustainable, Sustainable>,
        private formBuilder: FormBuilder,
        private session: SessionStorageService,
        auth: AuthorizationService
    ) {
        this.canSave = auth.hasRole(Role.MANAGE_PROPERTIES)
        this.setUpForm()
    }

    private setUpForm() {
        const user = this.session.usuarioLogado
        const disabled = !this.canSave
        const ev = this.practice.evaluation

        this.form = this.formBuilder.group({
            resp_id: [user.id],
            resp_name: [user.firstName],
            notes: [{
                value: ev?.notes,
                disabled
            }],
            are_satisfied_with_planting: [{
                value: ev?.are_satisfied_with_planting ?? false,
                disabled
            }],
            planting_assessment: [{
                value: ev?.planting_assessment ?? false,
                disabled
            }],
            planting_difficulties: [{
                value: ev?.planting_difficulties ?? false,
                disabled
            }],
            planting_years: [{
                value: ev?.planting_years ?? false,
                disabled
            }],
            planting_importance: [{
                value: ev?.planting_importance ?? false,
                disabled
            }],
            perform_agricultural_operations: [{
                value: ev?.perform_agricultural_operations ?? false,
                disabled
            }],
            has_terraces: [{
                value: ev?.has_terraces ?? false,
                disabled
            }],
            has_erosion: [{
                value: ev?.has_erosion ?? false,
                disabled
            }],
            has_soil_disturbance: [{
                value: ev?.has_soil_disturbance ?? false,
                disabled
            }],
            is_soil_compactated: [{
                value: ev?.is_soil_compactated ?? false,
                disabled
            }],
            soil_preparation_frequency: [{
                value: ev?.soil_preparation_frequency ?? false,
                disabled
            }],
            bare_soil_months: [{
                value: ev?.bare_soil_months ?? false,
                disabled
            }],
            summer_crops: [{
                value: ev?.summer_crops ?? false,
                disabled
            }],
            winter_crops: [{
                value: ev?.winter_crops ?? false,
                disabled
            }],
            animals_on_plating_area: [{
                value: ev?.animals_on_plating_area ?? false,
                disabled
            }],
            has_earthworms: [{
                value: ev?.has_earthworms ?? false,
                disabled
            }],
            are_earthworms_different: [{
                value: ev?.are_earthworms_different ?? false,
                disabled
            }],
            are_earthworms_good_for_crops: [{
                value: ev?.are_earthworms_good_for_crops ?? false,
                disabled
            }],
            earthworms_consequence_for_crops: [{
                value: ev?.earthworms_consequence_for_crops ?? false,
                disabled
            }],
            fertilizing_type: [{
                value: ev?.fertilizing_type ?? false,
                disabled
            }],
            follow_technical_guidelines: [{
                value: ev?.follow_technical_guidelines ?? false,
                disabled
            }],
            uses_manure: [{
                value: ev?.uses_manure ?? false,
                disabled
            }],
            manure_per_year: [{
                value: ev?.manure_per_year ?? false,
                disabled
            }],
            no_soil_preparation_start: [{
                value: ev?.no_soil_preparation_start ?? false,
                disabled
            }],
            no_soil_preparation_end: [{
                value: ev?.no_soil_preparation_end ?? false,
                disabled
            }],
            soil_management_start: [{
                value: ev?.soil_management_start ?? false,
                disabled
            }],
            soil_management_end: [{
                value: ev?.soil_management_end ?? false,
                disabled
            }],
            dry_material_accumulation_start: [{
                value: ev?.dry_material_accumulation_start ?? false,
                disabled
            }],
            dry_material_accumulation_end: [{
                value: ev?.dry_material_accumulation_start ?? false,
                disabled
            }],
            dry_material_accumulation_tons: [{
                value: ev?.dry_material_accumulation_start ?? false,
                disabled
            }]
        })
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        this.practice.evaluation = this.form.value
        this.dialog.close(this.practice)
    }

}
