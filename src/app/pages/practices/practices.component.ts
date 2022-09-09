import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { Farm } from 'src/app/core/models/farm.model';

import { PracticeService } from './services/practice.service';

@UntilDestroy()
@Component({
    selector: 'app-practices',
    templateUrl: './practices.component.html',
    styleUrls: ['./practices.component.scss']
})
export class PracticesComponent {
    allFarms$ = this.service.allFarms$
    private _currentFarm: Farm

    constructor(
        private service: PracticeService,
        public auth: AuthorizationService
    ) { }

    get currentFarm(): Farm | undefined {
        return this._currentFarm
    }

    set currentFarm(farm: Farm) {
        this._currentFarm = farm
        this.service.updateQuery({ farmId: farm._id })
    }

}
