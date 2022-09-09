import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { Protocol, ProtocolType } from '../../models/protocol.model';
import { ProtocolForm } from '../protocol-form';

@Component({
    selector: 'app-request-dialog',
    templateUrl: './request-dialog.component.html',
    styleUrls: ['./request-dialog.component.scss']
})
export class RequestDialogComponent {
    protocolType: ProtocolType = 'OTHER'

    @ViewChild('protocolEl')
    protocolEl: ProtocolForm

    constructor(
        private dialog: MatDialogRef<any, Protocol>,
        private session: SessionStorageService
    ) { }

    onSave() {
        const protocol = this.protocolEl.getValues()

        if (protocol === null) return

        protocol.protocol_type = this.protocolType
        protocol.priority = 'MEDIUM'
        protocol.requester = this.session.usuarioLogado.id

        this.dialog.close(protocol)
    }

}
