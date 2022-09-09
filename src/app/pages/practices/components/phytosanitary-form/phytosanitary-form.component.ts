import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';

import { Farm } from 'src/app/core/models/farm.model';
import { Phytosanitary } from '../../models/phytosanitary.model';

@Component({
    selector: 'app-phytosanitary-form',
    templateUrl: './phytosanitary-form.component.html',
    styleUrls: ['./phytosanitary-form.component.scss']
})
export class PhytosanitaryPracticeFormComponent {
    allPlagues = []
    selectedPlagues: string[] = []

    allBiotechnologies = []
    selectedBiotechnologies: string[] = []

    allPractices = []
    selectedPractices: string[] = []

    allPesticides = []
    selectedPesticides: string[] = []

    form: FormGroup

    constructor(
        @Inject(MAT_DIALOG_DATA) public farm: Farm,
        private dialog: MatDialogRef<Farm, Phytosanitary>,
        private auth: AuthorizationService,
        private session: SessionStorageService,
        formBuilder: FormBuilder,
    ) {
        this.form = formBuilder.group({
            farm_id: [farm._id],
            practice_type: ['PHYTOSANITARY'],
            uses_refuge: [null, Validators.required],
            uses_mip: [null, Validators.required],
            uses_mid: [null, Validators.required],
            uses_agronomic_management: [null, Validators.required],
            uses_precision_systems: [null, Validators.required]
        })
    }

    getError(controlName: string): ValidationErrors {
        const control = this.form.get(controlName)
        return control.touched ? control.errors : {}
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        const practice: Phytosanitary = {
            ...this.form.value,
            plague_management: this.selectedPlagues,
            soybean_rust_management: this.selectedPractices,
            biotechnology_employed: this.selectedBiotechnologies,
            pesticides: this.selectedPesticides
        }

        if (this.auth.hasRole(Role.MANAGE_PROPERTIES)) {
            const user = this.session.usuarioLogado

            practice.evaluation = {
                resp_id: user.id,
                resp_name: user.firstName,
                uses_refuge: true,
                notes: null,
                biotechnology_employed: true,
                pesticides: true,
                plague_management: true,
                soybean_rust_management: true,
                uses_mip: true,
                uses_mid: true,
                uses_agronomic_management: true,
                uses_precision_systems: true
            }
        }

        this.dialog.close(practice)
    }
}
