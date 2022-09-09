import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Phytosanitary } from '../models/phytosanitary.model';

const PHYTOSANITARY_PATH = '/phytosanitary/practices'
const PRODUCER_PATH = '/producer/practices'

@Injectable({
    providedIn: 'root'
})
export class PhytosanitaryPracticeService {

    constructor(private client: HttpClient) { }

    getPlagues(): Observable<string[]> {
        return this.fetchList('/plagues')
    }

    getPractices(): Observable<string[]> {
        return this.fetchList('/practices')
    }

    getBiotechnologies(): Observable<string[]> {
        return this.fetchList('/biotechnologies')
    }

    getPesticides(): Observable<string[]> {
        return this.fetchList('/pesticides')
    }

    getAllPractices(): Observable<Phytosanitary[]> {
        return this.client.get<Phytosanitary[]>(`${PRODUCER_PATH}?practice_type=PHYTOSANITARY`)
    }

    getPracticeById(id: string): Observable<Phytosanitary> {
        return this.client.get<Phytosanitary>(`${PRODUCER_PATH}/${id}`)
    }

    savePractice(practice: Phytosanitary): Observable<Phytosanitary> {
        if (practice._id === undefined) {
            return this.client.post<Phytosanitary>(PRODUCER_PATH, practice)
        }

        const id = practice._id
        delete practice._id

        return this.client.put<Phytosanitary>(`${PRODUCER_PATH}/${id}`, practice)
    }

    removePractice(id: string): Observable<null> {
        return this.client.delete<null>(`${PRODUCER_PATH}/${id}`)
    }

    private fetchList(suffix: string): Observable<string[]> {
        return this.client.get<string[]>(PHYTOSANITARY_PATH + suffix)
    }
}
