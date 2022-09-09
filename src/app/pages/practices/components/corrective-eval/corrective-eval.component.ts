import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Corrective } from '../../models/corrective.model';

@Component({
    selector: 'app-corrective-eval',
    templateUrl: './corrective-eval.component.html',
    styleUrls: ['./corrective-eval.component.scss']
})
export class CorrectiveEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: Corrective,
        private dialog: MatDialogRef<Corrective, Corrective>,
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
            product: [{
                value: ev?.product ?? false,
                disabled
            }],
            is_density_adequate: [{
                value: ev?.is_density_adequate ?? false,
                disabled
            }],
            is_conditioning_adequate: [{
                value: ev?.is_conditioning_adequate ?? false,
                disabled
            }],
            has_declared_elements: [{
                value: ev?.has_declared_elements ?? false,
                disabled
            }],
            is_contaminated: [{
                value: ev?.is_contaminated ?? false,
                disabled
            }],
            has_logistical_problems: [{
                value: ev?.has_logistical_problems ?? false,
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
