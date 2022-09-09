import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { SoilHumidity } from '../../models/soil-humidity.model';
import { PracticeFormComponent } from '../practice-form.component';

@Component({
    selector: 'app-controlled-traffic-form',
    templateUrl: './soil-humidity-form.component.html',
    styleUrls: ['./soil-humidity-form.component.scss']
})
export class SoilHumidityFormComponent extends PracticeFormComponent<SoilHumidity> {
    form = this.formBuilder.group({
        practice_type: ['SOIL_RECHARGE_AND_MOISTURE'],
        soil_moisture_management: [null, Validators.required],
        has_agricultural_practices_relationship: [null, Validators.required]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, SoilHumidity>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)
    }

}
