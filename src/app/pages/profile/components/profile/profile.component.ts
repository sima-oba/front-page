import { Component } from '@angular/core';

import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';
import { User } from 'src/app/core/models/user.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    public user: User;
    public info;

    constructor(private session: SessionStorageService) {
        this.user = this.session.usuarioLogado
    }
    
}
