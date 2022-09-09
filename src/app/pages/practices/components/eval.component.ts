import { Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { AuthorizationService, Role } from "src/app/configurations/security/authorization.service";
import { SessionStorageService } from "src/app/configurations/security/storages/session-storage.service";
import { PracticeBase } from "../models/practice.model";

export abstract class EvalComponent<T extends PracticeBase> {
    private readonly RESERVED_FIELDS = [
        '_id',
        'created_at',
        'updated_at',
        'farm_id',
        'evaluation',
        'owner_doc',
        'practice_type'
    ]

    readonly form: FormGroup
    readonly canSave: boolean

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: T,
        private dialog: MatDialogRef<T, T>,
        private session: SessionStorageService,
        auth: AuthorizationService
    ) {
        if (practice == null) {
            throw new Error('Missing "practice" argument')
        }

        this.canSave = auth.hasRole(Role.MANAGE_PROPERTIES)
        this.form = this.setUpForm()
    }

    private setUpForm(): FormGroup {
        const user = this.session.usuarioLogado
        const disabled = !this.canSave
        const evaluation = this.practice.evaluation
        const form = new FormGroup({})

        form.addControl('resp_id', new FormControl(user.id))
        form.addControl('resp_name', new FormControl(user.firstName))
        form.addControl('notes', new FormControl({ value: evaluation?.notes, disabled }))

        Object.keys(this.practice)
            .filter(key => !this.RESERVED_FIELDS.includes(key))
            .forEach(key => {
                const control = new FormControl({ value: evaluation?.[key] ?? false, disabled })
                form.addControl(key, control)
            })

        return form
    }

    save() {
        if (!this.canSave) {
            console.warn('Attempt to save evaluation without permission')
            return
        }

        if (this.form.invalid) return

        this.practice.evaluation = this.form.value
        this.dialog.close(this.practice)
    }

}