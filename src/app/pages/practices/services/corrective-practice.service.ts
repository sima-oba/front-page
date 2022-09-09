import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Corrective } from '../models/corrective.model';

const PATH = '/producer/practices'

@Injectable({
    providedIn: 'root'
})
export class CorrectivePracticeService {

    constructor(private client: HttpClient) { }

    getAll(): Observable<Corrective[]> {
        return this.client
            .get<Corrective[]>(`${PATH}?practice_type=CORRECTIVE_QUALITY`)
            .pipe(map(this.orderByLastUpdate))
    }

    getById(id: string): Observable<Corrective> {
        return this.client.get<Corrective>(`${PATH}/${id}`)
    }

    save(practice: Corrective): Observable<any> {
        if (practice._id === undefined) {
            return this.client.post(PATH, practice)
        }

        const practiceId = practice._id
        delete practice._id

        return this.client.put(`${PATH}/${practiceId}`, practice)
    }

    remove(id: string): Observable<any> {
        return this.client.delete(`${PATH}/${id}`)
    }

    private orderByLastUpdate = (practices: Corrective[]): Corrective[] => {
        return practices.sort((first, second) => {
            const firstDate = new Date(first.updated_at).getTime()
            const secondDate = new Date(second.updated_at).getTime()

            return firstDate > secondDate ? -1 : 1
        })
    }
}
