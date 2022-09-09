import { Component, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading.service';
import { DocumentQuery } from '../../models/document-query.model';

import { Document, DOCUMENT_TYPES } from "../../models/document.model";
import { DocumentsService } from "../../services/document.service";

@Component({
    selector: 'app-documents-grid',
    templateUrl: './documents-grid.component.html',
    styleUrls: ['./documents-grid.component.scss']
})
export class DocumentsGridComponent implements OnInit {
    readonly columns = ['publish_date', 'process', 'issuer', 'term', 'link']

    readonly documentTypes: { type: string, title: string }[]
    selectedDocumentType = ''

    private readonly START_YEAR = 2018
    readonly years: { value: number, title: string }[] = []
    selectedYear = 0

    private criteria$ = new BehaviorSubject<string>('publish_date')
    private sort$ = new BehaviorSubject(false)
    documents$: Observable<Document[]>

    @ViewChild('table')
    table: MatTable<any>

    constructor(
        private loading: LoadingService,
        private service: DocumentsService
    ) {
        const currentYear = new Date().getFullYear()

        this.years.push({
            value: 0,
            title: 'Todos'
        })

        for (let year = currentYear; year >= this.START_YEAR; year--) {
            this.years.push({
                value: year,
                title: year.toString()
            })
        }

        this.documentTypes = DOCUMENT_TYPES.sort((a, b) =>
            a.title.localeCompare(b.title)
        )
    }

    ngOnInit() {
        this.documents$ = this.loading.withObservable(
            combineLatest([
                this.service.documents$,
                this.criteria$, this.sort$
            ]).pipe(
                map(([docs, criteria, sort]) => criteria === 'publish_date'
                    ? this.sortByPublication(docs, sort)
                    : this.sortByIssuer(docs, sort)
                ),
                tap(() => this.table.renderRows())
            )
        )
    }

    updateQuery() {
        const query: DocumentQuery = {}

        if (this.selectedYear > 0) {
            query.publishYear = this.selectedYear
        }

        if (this.selectedDocumentType.length > 0) {
            query.publishType = this.selectedDocumentType
        }

        this.loading.on()
        this.service.search(query)
    }

    onSort(sort: Sort) {
        if (this.criteria$.value === sort.active) {
            this.sort$.next(!this.sort$.value)
        } else {
            this.criteria$.next(sort.active)
        }
    }

    private sortByPublication(documents: Document[], asc: boolean): Document[] {
        const sorted = documents.sort((first, second) => {
            const firstTime = new Date(first.publish_date).getTime()
            const secondTime = new Date(second.publish_date).getTime()

            return firstTime > secondTime ? 1 : -1
        })

        return asc ? sorted : sorted.reverse()
    }

    private sortByIssuer(documents: Document[], asc: boolean): Document[] {
        const sorted = documents.sort((first, second) =>
            first.issuer_name.localeCompare(second.issuer_name)
        )

        return asc ? sorted : sorted.reverse()
    }

}
