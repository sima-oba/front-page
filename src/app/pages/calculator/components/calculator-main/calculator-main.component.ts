import { Component } from '@angular/core';
import { AuthorizationService } from 'src/app/configurations/security/authorization.service';

@Component({
    selector: 'app-calculator-main',
    templateUrl: './calculator-main.component.html',
    styleUrls: ['./calculator-main.component.scss']
})

export class CalculatorMainComponent {

    constructor(public auth: AuthorizationService) { }
}