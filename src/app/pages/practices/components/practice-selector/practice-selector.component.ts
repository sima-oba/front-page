import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';
import { PracticeType } from '../../models/practice.model';
import { PracticeService } from '../../services/practice.service';

@Component({
    selector: 'app-practice-selector',
    templateUrl: './practice-selector.component.html',
    styleUrls: ['./practice-selector.component.scss']
})
export class PracticesGridComponent {

    constructor(
        private router: Router,
        private dialog: MatDialog,
        private service: PracticeService
    ) { }

    onPracticeChange(practiceType: PracticeType) {
        if (this.service.query.farmId === undefined) {
            this.showFarmNotSelected()
            return
        }

        this.service.updateQuery({ practiceType })
        this.router.navigate([`${this.router.url}/${practiceType}`])
    }

    private showFarmNotSelected() {
        const data: ConfirmationOptions = {
            title: 'Por favor, selecione uma propriedade da lista antes de continuar.',
            cancelButton: false
        }

        this.dialog.open(ConfirmationDialog, { data })
    }

}
