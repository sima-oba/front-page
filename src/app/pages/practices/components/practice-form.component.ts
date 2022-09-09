import { Inject } from '@angular/core';
import { FormGroup, ValidationErrors } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { Evaluation } from '../models/evaluation.model';
import { PracticeBase } from '../models/practice.model';

export abstract class PracticeFormComponent<T extends PracticeBase> {
    private readonly RESERVED_FIELDS = [
        '_id',
        'created_at',
        'updated_at',
        'farm_id',
        'evaluation',
        'owner_doc',
        'practice_type'
    ]

    abstract readonly form: FormGroup

    constructor(
        @Inject(MAT_DIALOG_DATA) private farm: Farm,
        private dialog: MatDialogRef<Farm, T>,
        private auth: AuthorizationService,
        private session: SessionStorageService
    ) {
        if (farm == null) {
            throw new Error('Missing "farm" argument')
        }
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

        const practice = this.form.value as T
        practice.farm_id = this.farm._id

        if (this.auth.hasRole(Role.MANAGE_PROPERTIES)) {
            practice.evaluation = this.createEvaluation(practice)
        }

        this.dialog.close(practice)
    }

    private createEvaluation(practice: T): Evaluation {
        const user = this.session.usuarioLogado
        const fields = {}

        Object.keys(practice)
            .filter(key => !this.RESERVED_FIELDS.includes(key))
            .forEach(key => fields[key] = true)

        return {
            resp_id: user.id,
            resp_name: user.firstName,
            notes: null,
            ...fields
        }
    }

}
