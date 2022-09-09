import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

import { City } from 'src/app/core/models/city.model';
import { Forecast } from 'src/app/core/models/forecast.model';
import { filterNotNull } from '../utils/rxjs';

const PATH = '/weather'

@Injectable({
    providedIn: 'root',
})
export class ForecastService {
    private date$ = new BehaviorSubject(new Date())
    private cityId$: BehaviorSubject<string | null>

    readonly currentForecast$: Observable<Forecast>
    readonly currentWeekForecast$: Observable<Forecast[]>

    constructor(private client: HttpClient) {
        const cityId = this.loadSelectedCity()

        this.cityId$ = new BehaviorSubject(cityId)

        this.currentForecast$ = combineLatest([
            this.date$,
            this.cityId$.pipe(filterNotNull())
        ]).pipe(
            switchMap(([date, city]) => this.getForecast(date, city, 1)),
            map(this.pickClosest)
        )

        this.currentWeekForecast$ = this.cityId$.pipe(
            filterNotNull(),
            switchMap(city => this.getForecast(new Date(), city, 7)),
            map(this.groupForecastByDate),
            map(this.flattenForecast),
            shareReplay()
        )
    }

    set date(date: Date) {
        this.date$.next(date)
    }

    set cityId(id: string) {
        this.saveSelectedCity(id)
        this.cityId$.next(id)
    }

    get cityId(): string {
        return this.cityId$.value ?? ''
    }

    private loadSelectedCity(): string | null {
        return localStorage.getItem('forecast.cityId')
    }

    private saveSelectedCity(cityId: string) {
        localStorage.setItem('forecast.cityId', cityId)
    }

    getCities(): Observable<City[]> {
        return this.client.get<City[]>(`${PATH}/cities`)
            .pipe(map(this.sortCitiesByName))
    }

    private sortCitiesByName = (cities: City[]): City[] => {
        return cities.sort((prev, next) =>
            prev.name.localeCompare(next.name)
        )
    }

    private getForecast(date: Date, cityId: string, days: number): Observable<Forecast[]> {
        const path = `${PATH}/forecast`
        const params = {
            city_id: cityId,
            date: date.toISOString(),
            days: days.toString(),
        };

        return this.client.get<Forecast[]>(path, { params })
    }

    private pickClosest = (forecast: Forecast[]): Forecast | null => {
        if (forecast.length === 0) {
            return null
        }

        const now = new Date().getTime()

        return forecast.reduce((prev, curr) => {
            const prevDelta = Math.abs(now - new Date(prev.date_time).getTime())
            const currDelta = Math.abs(now - new Date(curr.date_time).getTime())

            return prevDelta < currDelta ? prev : curr
        })
    }

    private groupForecastByDate = (forecast: Forecast[]): Forecast[][] => {
        const groupMap = new Map<string, Forecast[] | undefined>()

        forecast.forEach(item => {
            const key = item.date_time.split('T')[0]
            const group = groupMap.get(key) ?? []

            group.push(item)
            groupMap.set(key, group)
        })

        return Array.from(groupMap.values())
    }

    private flattenForecast = (groups: Forecast[][]): Forecast[] => {
        return groups.map(group => {
            return group.reduce((prev, curr) => {
                return {
                    date_time: prev.date_time,
                    max_humidity: Math.max(prev.max_humidity, curr.max_humidity),
                    min_humidity: Math.min(prev.min_humidity, curr.min_humidity),
                    max_temp: Math.max(prev.max_temp, curr.max_temp),
                    min_temp: Math.min(prev.min_temp, curr.min_temp),
                    max_temp_trend: prev.max_temp_trend,
                    min_temp_trend: prev.min_temp_trend,
                    season: prev.season,
                    source: prev.source,
                    summary: prev.summary,
                    sunrise: prev.sunrise,
                    sunset: prev.sunset,
                    weather: prev.weather,
                    wind_direction: prev.wind_direction,
                    wind_speed: prev.wind_speed
                }
            })
        })
    }
}
