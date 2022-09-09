import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { SoilTemperature } from '../../models/soil-temperature';
import { PracticeFormComponent } from '../practice-form.component';

@Component({
    selector: 'app-controlled-traffic-form',
    templateUrl: './soil-temperature-form.component.html',
    styleUrls: ['./soil-temperature-form.component.scss']
})
export class SoilTemperatureFormComponent extends PracticeFormComponent<SoilTemperature> {
    form = this.formBuilder.group({
        practice_type: ['SOIL_TEMPERATURE'],
        temperature_measurement: [null, Validators.required]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, SoilTemperature>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)
    }

}
