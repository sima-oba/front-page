import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Sustainable } from '../models/sustainable.model';

const PATH = '/producer/practices'

@Injectable({
    providedIn: 'root'
})
export class SustainablePracticeService {

    constructor(private client: HttpClient) { }

    // getAll(): Observable<Sustainable[]> {
    //     return this.client.get<[]>(`${PATH}?practice_type=SUSTAINABLE`)
    //         .pipe(
    //             map(data => data.map(this.toModel)),
    //             map(this.sortByLastUpdate)
    //         )
    // }

    getById(id: string): Observable<Sustainable> {
        return this.client.get<any>(`${PATH}/${id}`)
            .pipe(map(this.toModel))
    }

    save(practice: Sustainable): Observable<any> {
        if (practice._id) {
            const path = `${PATH}/${practice._id}`
            delete practice._id
            
            return this.client.put(path, practice)
        }

        return this.client.post(PATH, practice)
    }

    remove(id: string): Observable<any> {
        return this.client.delete(`${PATH}/${id}`)
    }

    // private sortByLastUpdate = (practices: Sustainable[]): Sustainable[] => {
    //     return practices.sort((first, second) => {
    //         const firstDate = first.updated_at.getTime()
    //         const secondDate = second.updated_at.getTime()

    //         return firstDate > secondDate ? -1 : 1
    //     })
    // }

    private toModel = (data: any): Sustainable => {
        const updated_at = new Date(data.updated_at)
        delete data.updated_at

        const no_soil_preparation_start = new Date(data.no_soil_preparation_start)
        delete data.no_soil_preparation_start

        const no_soil_preparation_end = new Date(data.no_soil_preparation_end)
        delete data.no_soil_preparation_end

        const soil_management_start = new Date(data.soil_management_start)
        delete data.soil_management_start

        const soil_management_end = new Date(data.soil_management_end)
        delete data.soil_management_end

        const dry_material_accumulation_start = new Date(data.dry_material_accumulation_start)
        delete data.dry_material_accumulation_start

        const dry_material_accumulation_end = new Date(data.dry_material_accumulation_end)
        delete data.dry_material_accumulation_end

        return {
            ...data,
            updated_at,
            no_soil_preparation_start,
            no_soil_preparation_end,
            soil_management_start,
            soil_management_end,
            dry_material_accumulation_start,
            dry_material_accumulation_end
        }
    }
}
