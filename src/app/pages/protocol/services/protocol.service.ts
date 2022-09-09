import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthorizationService, Role } from 'src/app/configurations/security/authorization.service';
import { SessionStorageService } from 'src/app/configurations/security/storages/session-storage.service';

import { Farm } from 'src/app/core/models/farm.model';
import { Protocol } from '../models/protocol.model';
import { ProtocolQuery } from '../models/query.model';

@Injectable({
    providedIn: 'root'
})
export class ProtocolService {
    private readonly PATH = '/protocol/protocols'

    private query$: BehaviorSubject<ProtocolQuery>
    protocols$: Observable<Protocol[]>

    constructor(
        private client: HttpClient,
        auth: AuthorizationService,
        session: SessionStorageService
    ) {
        this.query$ = new BehaviorSubject(
            auth.hasRole(Role.ADMIN) ? {} : { requester: session.usuarioLogado.id }
        )

        this.protocols$ = this.query$.pipe(
            switchMap(this.getProtocols)
        )
    }

    getAllFarms(): Observable<Farm[]> {
        return this.client.get<Farm[]>('/producer/farms')
    }

    refreshProtocols() {
        this.query$.next(this.query$.value)
    }

    private getProtocols = (query: ProtocolQuery): Observable<Protocol[]> => {
        const params = { ...query }
        return this.client.get<Protocol[]>(this.PATH, { params })
    }

    submitProtocol(protocol: Protocol): Observable<any> {
        const form = new FormData()

        if (protocol.attachments !== undefined) {
            const attachments = protocol.attachments as object
            delete protocol.attachments

            Object.entries(attachments).forEach(([key, file]) =>
                form.set(key, file)
            )
        }

        form.set('protocol', JSON.stringify(protocol))

        return this.client.post(this.PATH, form).pipe(
            tap(() => this.refreshProtocols())
        )
    }

    acceptProtocol(protocolId: string): Observable<any> {
        const url = `${this.PATH}/${protocolId}/accept`

        return this.client.put(url, null).pipe(
            tap(() => this.refreshProtocols())
        )
    }

    cancelProtocol(protocolId: string, message: string): Observable<any> {
        const url = `${this.PATH}/${protocolId}/cancel`
        const form = new FormData()

        form.set('message', message)

        return this.client.put(url, form).pipe(
            tap(() => this.refreshProtocols())
        )
    }

    completeProtocol(protocolId: string, message: string): Observable<any> {
        const url = `${this.PATH}/${protocolId}/complete`
        const form = new FormData()

        form.set('message', message)

        return this.client.put(url, form).pipe(
            tap(() => this.refreshProtocols())
        )
    }

}
