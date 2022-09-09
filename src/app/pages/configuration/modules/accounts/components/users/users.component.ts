import { Component } from '@angular/core';

import { User } from '../../../../../../core/models/user.model';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    selectedUser?: User
}
