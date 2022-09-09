import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';

import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { ContainmentMicrodams } from '../../models/containment-microdams';

@Component({
    selector: 'app-containment-microdams-eval',
    templateUrl: './containment-microdams-eval.component.html',
    styleUrls: ['./containment-microdams-eval.component.scss']
})
export class ContainmentMicrodamsEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: ContainmentMicrodams,
        private dialog: MatDialogRef<ContainmentMicrodams, ContainmentMicrodams>,
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
            has_micro_dams: [{
                value: ev?.has_micro_dams ?? false,
                disabled
            }],
            micro_dams_quality: [{
                value: ev?.micro_dams_quality ?? false,
                disabled
            }],
            has_level_curves: [{
                value: ev?.has_level_curves ?? false,
                disabled
            }],
            level_curves_convergent_with_neighbors: [{
                value: ev?.level_curves_convergent_with_neighbors ?? false,
                disabled
            }],
            level_curves_quality: [{
                value: ev?.level_curves_quality ?? false,
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
