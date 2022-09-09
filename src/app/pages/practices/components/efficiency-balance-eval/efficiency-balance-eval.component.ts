import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { EfficiencyBalance } from '../../models/efficiency-balance';

@Component({
    selector: 'app-efficiency-balance-eval',
    templateUrl: './efficiency-balance-eval.component.html',
    styleUrls: ['./efficiency-balance-eval.component.scss']
})
export class EfficiencyBalanceEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: EfficiencyBalance,
        private dialog: MatDialogRef<EfficiencyBalance, EfficiencyBalance>,
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
            has_irrigated_agriculturearea: [{
                value: ev?.has_irrigated_agriculturearea ?? false,
                disabled
            }],
            has_flow_meter: [{
                value: ev?.has_flow_meter ?? false,
                disabled
            }],
            meter_transmits_telemetric_data: [{
                value: ev?.meter_transmits_telemetric_data ?? false,
                disabled
            }],
            use_of_irrigation_systems: [{
                value: ev?.use_of_irrigation_systems ?? false,
                disabled
            }],
            total_area_of_irrigation_systems: [{
                value: ev?.total_area_of_irrigation_systems ?? false,
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
