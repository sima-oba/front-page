import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { CropRotation } from "../../models/crop-rotation";
import { PracticeFormComponent } from '../practice-form.component';

@Component({
    selector: 'app-crop-rotation-form',
    templateUrl: './crop-rotation-form.component.html',
    styleUrls: ['./crop-rotation-form.component.scss']
})
export class CropRotationFormComponent extends PracticeFormComponent<CropRotation> {
    form = this.formBuilder.group({
        practice_type: ['CROP_ROTATION'],
        practice_crop_rotation: [null, Validators.required],
        crops: [null]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, CropRotation>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)
    }

}
