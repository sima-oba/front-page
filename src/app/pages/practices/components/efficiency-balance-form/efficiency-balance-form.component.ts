import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Farm } from 'src/app/core/models/farm.model';
import { EfficiencyBalance } from '../../models/efficiency-balance';
import { PracticeFormComponent } from '../practice-form.component';

@Component({
    selector: 'app-efficiency-balance-form',
    templateUrl: './efficiency-balance-form.component.html',
    styleUrls: ['./efficiency-balance-form.component.scss']
})
export class EfficiencyBalanceFormComponent extends PracticeFormComponent<EfficiencyBalance> {
    form = this.formBuilder.group({
        practice_type: ['IRRIGATION_USE_EFFICIENCY'],
        has_irrigated_agriculturearea: [null, Validators.required],
        has_flow_meter: [null, Validators.required],
        meter_transmits_telemetric_data: [null, Validators.required],
        use_of_irrigation_systems: [null, Validators.required],
        total_area_of_irrigation_systems: [null, Validators.required]
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) farm: Farm,
        dialog: MatDialogRef<Farm, EfficiencyBalance>,
        auth: AuthorizationService,
        session: SessionStorageService,
        private formBuilder: FormBuilder
    ) {
        super(farm, dialog, auth, session)
    }

}
