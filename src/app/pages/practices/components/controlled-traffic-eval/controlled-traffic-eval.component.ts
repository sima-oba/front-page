import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';

import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { ControlledTraffic } from '../../models/controlled-traffic';

@Component({
    selector: 'app-controlled-traffic-eval',
    templateUrl: './controlled-traffic-eval.component.html',
    styleUrls: ['./controlled-traffic-eval.component.scss']
})
export class ControlledTrafficEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: ControlledTraffic,
        private dialog: MatDialogRef<ControlledTraffic, ControlledTraffic>,
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
            use_stc: [{
                value: ev?.use_stc ?? false,
                disabled
            }],
            total_area_stc: [{
                value: ev?.total_area_stc ?? false,
                disabled
            }],
            stc_usage_months: [{
                value: ev?.stc_usage_months ?? false,
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
