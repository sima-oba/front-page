import { Component, Input } from '@angular/core';

import { Protocol } from '../../models/protocol.model';

@Component({
    selector: 'app-simple-request-content',
    templateUrl: './simple-request-content.component.html',
    styleUrls: ['./simple-request-content.component.scss']
})
export class SimpleRequestContentComponent {
    @Input()
    protocol: Protocol
}
