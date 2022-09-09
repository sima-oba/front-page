import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { ControlledTraffic } from '../../models/controlled-traffic';
import { PracticeFormComponent } from '../practice-form.component';

@Component({
    selector: 'app-controlled-traffic-form',
    templateUrl: './controlled-traffic-form.component.html',
    styleUrls: ['./controlled-traffic-form.component.scss']
})
export class ControlledTrafficFormComponent extends PracticeFormComponent<ControlledTraffic> {
    form = this.formBuilder.group({
        practice_type: ['CONTROLLED_TRAFFIC_SYSTEM'],
        use_stc: [null, Validators.required],
        total_area_stc: [null, Validators.required],
        stc_usage_months: [null, Validators.required]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, ControlledTraffic>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)
    }

}
