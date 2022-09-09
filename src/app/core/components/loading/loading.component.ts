import { Component } from '@angular/core';

import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
    isLoading$ = this.service.isLoading$

    constructor(private service: LoadingService) { }
}
