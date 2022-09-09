import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
    @Input()
    opacity = 0.1

    @Input()
    backgroundColor = '#000'
}
