import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { Corrective } from '../../models/corrective.model';
import { PracticeFormComponent } from '../practice-form.component';

@Component({
    selector: 'app-corrective-form',
    templateUrl: './corrective-form.component.html',
    styleUrls: ['./corrective-form.component.scss']
})
export class CorrectivePracticeFormComponent extends PracticeFormComponent<Corrective> {
    form = this.formBuilder.group({
        practice_type: ['CORRECTIVE_QUALITY'],
        product: [null, Validators.required],
        is_density_adequate: [null, Validators.required],
        is_conditioning_adequate: [null, Validators.required],
        has_declared_elements: [null, Validators.required],
        is_contaminated: [null, Validators.required],
        has_logistical_problems: [null, Validators.required]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, Corrective>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)
    }

}
