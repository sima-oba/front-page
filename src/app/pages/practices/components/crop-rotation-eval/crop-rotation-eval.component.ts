import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { CropRotation } from '../../models/crop-rotation';

@Component({
    selector: 'app-crop-rotation-eval',
    templateUrl: './crop-rotation-eval.component.html',
    styleUrls: ['./crop-rotation-eval.component.scss']
})
export class CropRotationEvalComponent {
    form: FormGroup
    canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: CropRotation,
        private dialog: MatDialogRef<CropRotation, CropRotation>,
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
            practice_crop_rotation: [{
                value: ev?.practice_crop_rotation ?? false,
                disabled
            }],
            crops: [{
                value: ev?.crops ?? false,
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
