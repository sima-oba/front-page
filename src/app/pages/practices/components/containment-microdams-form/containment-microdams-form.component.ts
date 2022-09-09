import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { ContainmentMicrodams } from '../../models/containment-microdams';
import { PracticeFormComponent } from '../practice-form.component';

@Component({
    selector: 'app-containment-microdams-form',
    templateUrl: './containment-microdams-form.component.html',
    styleUrls: ['./containment-microdams-form.component.scss']
})
export class ContainmentMicrodamsFormComponent extends PracticeFormComponent<ContainmentMicrodams> {
    form = this.formBuilder.group({
        practice_type: ['WATER_RUNOFF_CONTAINMENT'],
        has_micro_dams: [null, Validators.required],
        micro_dams_quality: [null, Validators.required],
        has_level_curves: [null, Validators.required],
        level_curves_convergent_with_neighbors: [null, Validators.required],
        level_curves_quality: [null, Validators.required]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, ContainmentMicrodams>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)
    }

}
