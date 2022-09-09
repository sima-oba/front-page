import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { RainfallMeasurement } from '../models/rainfall-measurement.model';

import { RainfallStation } from '../models/rainfall-station.model';

const PATH = '/weather/rainfall'

@Injectable({
    providedIn: 'root'
})
export class RainfallService {
    private selectedStations$ = new BehaviorSubject<string[]>([])

    stationsSelection$ = this.getStations().pipe(
        shareReplay(),
        map(stations => this.mapSelectedStationsState(stations))
    )

    stations$ = this.getStationsGeoJson().pipe(
        switchMap(geoJson => this.filterSelectedStations(geoJson))
    )

    constructor(private client: HttpClient) { }

    selectStation(id: string) {
        const newSelection = this.selectedStations$.value.concat(id)
        this.selectedStations$.next(newSelection)
    }

    deselectStation(id: string) {
        const newSelection = this.selectedStations$.value
        newSelection.splice(newSelection.indexOf(id), 1)
        this.selectedStations$.next(newSelection)
    }

    getMeasurements(stationId: string, day: Date): Observable<RainfallMeasurement[]> {
        const params = { day: day.toISOString().split('T')[0] }
        const url = `${PATH}/${stationId}/measurements`

        return this.client.get<RainfallMeasurement[]>(url, { params })
    }

    private getStations(): Observable<RainfallStation[]> {
        return this.client.get<RainfallStation[]>(PATH)
    }

    private getStationsGeoJson(): Observable<FeatureCollection> {
        return this.client.get<FeatureCollection>(PATH + '/geojson')
    }

    private filterSelectedStations(geoJson: FeatureCollection): Observable<FeatureCollection> {
        const allFeatures = geoJson.features

        return this.selectedStations$.pipe(
            map(selection => {
                geoJson.features = allFeatures.filter(feature =>
                    selection.includes(feature.properties?._id)
                )

                return geoJson
            })
        )
    }

    private mapSelectedStationsState(stations: RainfallStation[]): RainfallStation[] {
        return stations.map(station => ({
            ...station,
            isSelected: this.selectedStations$.value.includes(station._id)
        }))
    }
}
