import { Component } from '@angular/core';

@Component({
    selector: 'body[sima-root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'sima';
    isOpen: boolean;
}
