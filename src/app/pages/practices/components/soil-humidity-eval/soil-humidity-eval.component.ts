import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';

import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { SoilHumidity } from '../../models/soil-humidity.model';

@Component({
    selector: 'app-soil-humidity-eval',
    templateUrl: './soil-humidity-eval.component.html',
    styleUrls: ['./soil-humidity-eval.component.scss']
})
export class SoilHumidityEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: SoilHumidity,
        private dialog: MatDialogRef<SoilHumidity, SoilHumidity>,
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
            soil_moisture_management: [{
                value: ev?.soil_moisture_management ?? false,
                disabled
            }],
            has_agricultural_practices_relationship: [{
                value: ev?.has_agricultural_practices_relationship ?? false,
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
