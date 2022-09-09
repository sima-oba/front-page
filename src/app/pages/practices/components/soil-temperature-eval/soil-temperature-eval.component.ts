import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { SoilTemperature } from '../../models/soil-temperature';

@Component({
    selector: 'app-soil-temperature-eval',
    templateUrl: './soil-temperature-eval.component.html',
    styleUrls: ['./soil-temperature-eval.component.scss']
})
export class SoilTemperatureEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: SoilTemperature,
        private dialog: MatDialogRef<SoilTemperature, SoilTemperature>,
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
            temperature_measurement: [{
                value: ev?.temperature_measurement ?? false,
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
