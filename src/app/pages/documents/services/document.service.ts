import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DocumentQuery } from '../models/document-query.model';
import { Document } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
    private readonly PATH = '/ordinances/'
    private query$ = new BehaviorSubject<DocumentQuery>({})
    readonly documents$: Observable<Document[]>

    constructor(private client: HttpClient) {
        this.documents$ = this.query$.pipe(
            switchMap(this.getDocuments)
        )
    }

    search(query: DocumentQuery) {
        this.query$.next(query)
    }

    private getDocuments = (query: DocumentQuery): Observable<Document[]> => {
        const params = {}

        if (query.publishYear !== undefined) {
            params['publish_start'] = new Date(query.publishYear, 0).toISOString()
            params['publish_end'] = new Date(query.publishYear, 11, 31, 11, 59, 59).toISOString()
        }

        if (query.publishType !== undefined) {
            params['ordinance_type'] = query.publishType
        }

        return this.client.get<Document[]>(this.PATH, { params })
    }

}
