import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { JobEvent } from '../models/event.model';
import { Job } from '../models/job.model';

interface JobEventQuery {
    before?: Date
    after?: Date
}

const PATH = '/scrapy'
const REFRESH_INTERVAL = 30 * 1000

@Injectable({
    providedIn: 'root'
})
export class ScrapyService {
    private lastEventUpdate = 0
    private cachedEvents: JobEvent[] = []
    private eventQuery: BehaviorSubject<JobEventQuery>
    private canRefresh = false
    jobEvents$: Observable<JobEvent[]>

    constructor(private client: HttpClient) {
        this.eventQuery = new BehaviorSubject<JobEventQuery>({
            before: new Date()
        })

        this.jobEvents$ = this.eventQuery.pipe(
            switchMap(this.getJobEvents),
            shareReplay(1)
        )

        setInterval(() => this.refreshJobEvents(), REFRESH_INTERVAL)
    }

    getJob(jobId: string): Observable<Job> {
        return this.client.get<Job>(`${PATH}/jobs/${jobId}`)
            .pipe(map(this.toJob))
    }

    private toJob = (value: any): Job => {
        return {
            id: value.id,
            name: value.name,
            args: value.args,
            month: this.parseExpr(value.month),
            day: this.parseExpr(value.day),
            day_of_week: this.parseExpr(value.day_of_week),
            hour: value.hour?.split(',')?.map(Number),
            next_run_time: value.next_run_time
        }
    }

    private parseExpr = (expr: string): number | null => {
        const value = Number.parseInt(expr)
        return Number.isInteger(value) ? value : null
    }

    updateJob(job: Job): Observable<void> {
        const payload = {
            args: job.args,
            name: job.name,
            year: '*',
            month: this.createExpr(job.month),
            week: '*',
            day: this.createExpr(job.day),
            day_of_week: this.createExpr(job.day_of_week),
            hour: this.createExpr(job.hour),
            minute: '0',
            second: '0'
        }

        return this.client
            .put<void>(`${PATH}/jobs/${job.id}`, payload)
            .pipe(tap(() => this.refreshJobEvents()))
    }

    private createExpr(value: number | number[] | null): string {
        if (value == null) {
            return '*'
        }

        if (Array.isArray(value)) {
            return value
                .map(item => item.toString())
                .join(',')
        }

        return value.toString()
    }

    executeJob(jobId: string): Observable<any> {
        return this.client
            .post(`${PATH}/jobs/${jobId}/execute`, null)
            .pipe(tap(() => this.refreshJobEvents()))
    }

    private refreshJobEvents() {
        if (!this.canRefresh) {
            return
        }

        const after = new Date(this.lastEventUpdate + 1)
        this.eventQuery.next({ after })
    }

    private getJobEvents = (query: JobEventQuery): Observable<JobEvent[]> => {
        let params = {}
        let insertionMethod: (events: JobEvent[]) => JobEvent[]

        if (query.before) {
            params['before'] = query.before.toISOString()
            insertionMethod = this.insertEventsAtBeginning
        }

        if (query.after) {
            params['after'] = query.after.toISOString()
            insertionMethod = this.insertEventsAtEnd
        }

        return this.client.get<JobEvent[]>(`${PATH}/events`, { params })
            .pipe(
                catchError(this.handleError),
                filter(events => events.length > 0),
                map(insertionMethod),
                tap(this.saveLatestEventTime)
            )
    }

    private insertEventsAtBeginning = (events: JobEvent[]): JobEvent[] => {
        this.cachedEvents.splice(0, 0, ...events)
        this.canRefresh = true
        return this.cachedEvents
    }

    private insertEventsAtEnd = (events: JobEvent[]): JobEvent[] => {
        this.cachedEvents.push(...events)
        return this.cachedEvents
    }

    private saveLatestEventTime = (events: JobEvent[]) => {
        events.forEach(event => {
            const time = Date.parse(event.time)

            if (time > this.lastEventUpdate) {
                this.lastEventUpdate = time
            }
        })
    }

    private handleError = (error: any): Observable<JobEvent[]> => {
        console.error(error)
        return of([])
    }
}
