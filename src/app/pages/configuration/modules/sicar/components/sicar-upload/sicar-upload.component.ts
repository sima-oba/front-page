import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { LoadingService } from 'src/app/core/services/loading.service';
import { filterNotNull } from 'src/app/core/utils/rxjs';
import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';
import { SicarService } from '../../../sicar/services/sicar.service';
import { City } from '../../models/city.model';
import { SicarUploadDialogComponent } from '../sicar-upload-dialog/sicar-upload-dialog.component';

@Component({
    selector: 'app-sicar-upload',
    templateUrl: './sicar-upload.component.html',
    styleUrls: ['./sicar-upload.component.scss']
})
export class SicarUploadComponent {
    private refresh$ = new BehaviorSubject(true)

    cities$ = this.refresh$.pipe(
        switchMap(() => this.sicarService.getCities())
    )

    constructor(
        private dialog: MatDialog,
        private loading: LoadingService,
        private sicarService: SicarService
    ) { }

    openUploadDialog(cityId: string) {
        const config = {
            data: cityId,
            panelClass: 'full-bleed-dialog'
        }

        this.dialog
            .open(SicarUploadDialogComponent, config)
            .afterClosed()
            .pipe(
                filterNotNull(),
                switchMap(file => this.uploadSicar(cityId, file)),
                catchError(this.handleError)
            )
            .subscribe(() => this.refresh$.next(true))
    }

    private uploadSicar(cityId: string, file: File): Observable<City> {
        return this.loading.withObservable(
            this.sicarService.updateSicar(cityId, file)
        )
    }

    private handleError = (_: any): Observable<any> => {
        const data: ConfirmationOptions = {
            title: 'Ocorreu um erro durante o upload',
            cancelButton: false
        }

        this.dialog.open(ConfirmationDialog, { data })
        return of()
    }

}
