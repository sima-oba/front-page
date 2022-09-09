import { Component, Input } from '@angular/core';

import { Protocol } from '../../models/protocol.model';

@Component({
    selector: 'app-planting-anticipating-content',
    templateUrl: './planting-anticipating-content.component.html',
    styleUrls: ['./planting-anticipating-content.component.scss']
})
export class PlantingAnticipatingContentComponent {
    @Input()
    protocol: Protocol
}
