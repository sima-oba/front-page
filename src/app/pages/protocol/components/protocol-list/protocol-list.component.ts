import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { filterNotNull } from 'src/app/core/utils/rxjs';
import { ConfirmationDialog, ConfirmationOptions } from 'src/app/shared/components/confirmation/confirmation.component';
import { Protocol, ProtocolStatus } from '../../models/protocol.model';
import { ProtocolService } from '../../services/protocol.service';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { ResponseDialogComponent } from '../response-dialog/response-dialog.component';

@Component({
    selector: 'app-protocol-list',
    templateUrl: './protocol-list.component.html',
    styleUrls: ['./protocol-list.component.scss']
})
export class ProtocolListComponent {
    protocols$: Observable<Protocol[]>

    private sort$ = new BehaviorSubject<'creation' | 'status'>('creation')
    private statusWeight = {
        'PENDING': 4,
        'IN_PROGRESS': 3,
        'CANCELED': 2,
        'COMPLETED': 1
    }

    constructor(
        private dialog: MatDialog,
        private loading: LoadingService,
        public auth: AuthorizationService,
        private service: ProtocolService
    ) {
        this.protocols$ = loading.withObservable(
            combineLatest([this.service.protocols$, this.sort$]).pipe(
                map(([protocols, sort]) =>
                    sort === 'creation'
                        ? this.sortByCreationDate(protocols)
                        : this.sortByStatus(protocols)
                )
            )
        )
    }

    sortBy(criteria: 'creation' | 'status') {
        this.sort$.next(criteria)
    }

    private sortByCreationDate(protocols: Protocol[]): Protocol[] {
        return protocols.sort((first, second) => {
            const firstTime = new Date(first.created_at).getTime()
            const secondTime = new Date(second.created_at).getTime()

            return firstTime > secondTime ? 1 : -1
        })
    }

    private sortByStatus(protocols: Protocol[]): Protocol[] {
        return protocols.sort((first, second) => {
            const firstWeight = this.statusWeight[first.status]
            const secondWeight = this.statusWeight[second.status]

            return  secondWeight > firstWeight ? 1 : -1
        })
    }

    onAdd() {
        this.dialog.open(RequestDialogComponent)
            .afterClosed()
            .pipe(
                tap(console.log),
                filterNotNull(),
                switchMap(this.addProtocol),
                take(1)
            )
            .subscribe(() => this.showSuccess())
    }

    private addProtocol = (protocol: Protocol): Observable<any> => {
        return this.loading.withObservable(
            this.service.submitProtocol(protocol)
        )
    }

    private showSuccess() {
        const data: ConfirmationOptions = {
            title: 'Protocolo enviado',
            cancelButton: false
        }

        this.dialog.open(ConfirmationDialog, { data })
    }

    onRowClick(protocol: Protocol) {
        this.dialog.open(ResponseDialogComponent, { data: protocol })
    }

}
