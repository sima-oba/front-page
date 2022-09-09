import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Phytosanitary } from '../../models/phytosanitary.model';
import { EvalComponent } from '../eval.component';

@Component({
    selector: 'app-phytosanitary-eval',
    templateUrl: './phytosanitary-eval.component.html',
    styleUrls: ['./phytosanitary-eval.component.scss']
})
export class PhytosanitaryEvalComponent extends EvalComponent<Phytosanitary> {

    constructor(
        @Inject(MAT_DIALOG_DATA) public practice: Phytosanitary,
        dialog: MatDialogRef<Phytosanitary, Phytosanitary>,
        session: SessionStorageService,
        auth: AuthorizationService
    ) {
        super(practice, dialog, session, auth)
    }

}
