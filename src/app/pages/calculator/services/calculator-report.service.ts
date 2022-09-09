import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable({ providedIn: 'root' })
export class CalculatorReportService {

    constructor(protected http: HttpClient) { }

    getServerPath(): string {
        return 'producer/calculator'
    }
}
