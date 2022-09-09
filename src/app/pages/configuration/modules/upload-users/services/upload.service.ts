import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ImportedInfo } from '../models/import-info.model';

const PATH = '/producer/owners/import'

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(private client: HttpClient) { }

    getImportedInfo(): Observable<ImportedInfo[]> {
        return this.client.get<ImportedInfo[]>(PATH)
    }

    sendFile(file: File): Observable<ImportedInfo> {
        const form = new FormData()
        form.append('file', file)

        return this.client.post<ImportedInfo>(PATH, form)
    }
}
