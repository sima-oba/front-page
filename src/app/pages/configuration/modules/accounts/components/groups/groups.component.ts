import { Component } from '@angular/core';

import { Group } from '../../models/group.model';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss']
})
export class GroupsComponent {
    selectedGroup?: Group
}
