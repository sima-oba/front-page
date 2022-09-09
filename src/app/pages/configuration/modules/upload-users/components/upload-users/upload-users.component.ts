import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading.service';
import { filterNotNull } from 'src/app/core/utils/rxjs';
import Swal from 'sweetalert2';

import { ImportedInfo } from '../../models/import-info.model';
import { UploadService } from '../../services/upload.service';
import { UploadUsersDialog } from '../upload-users-dialog/upload-users-dialog.component';


@Component({
    selector: 'app-upload-users',
    templateUrl: './upload-users.component.html',
    styleUrls: ['./upload-users.component.scss']
})
export class UploadUsersComponent {
    private refresh$ = new BehaviorSubject(true)
    importInfo$: Observable<ImportedInfo[]>

    constructor(
        private dialog: MatDialog,
        private loading: LoadingService,
        private uploadService: UploadService
    ) {        
        this.importInfo$ = this.refresh$.pipe(
            switchMap(() => uploadService.getImportedInfo())
        )
    }

    openUploadDialog() {
        const config = {
            panelClass: 'full-bleed-dialog'
        }

        this.dialog
            .open(UploadUsersDialog, config)
            .afterClosed()
            .pipe(
                filterNotNull(),
                tap(() => this.loading.on()),
                switchMap(file => this.uploadService.sendFile(file)),
                catchError(error => this.showError(error)),
                finalize(() => this.loading.off())
            )
            .subscribe(() => this.refresh$.next(true))
    }

    private showError(error: any): Observable<any> {
        Swal.fire({
            title: 'Falha ao enviar arquivo',
            text: 'Por favor, verifique se o formato do arquivo está correto e tente novamente'
        })

        return throwError(error)
    }
}
