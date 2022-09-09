import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CalculatorSettings } from "../models/calculator-settings.model";

const PATH = '/producer/calculator/settings'

@Injectable({ providedIn: 'root' })
export class CalculatorSettingsService {

    constructor(protected http: HttpClient) { }

    getSettings(): Observable<CalculatorSettings> {
        return this.http.get<CalculatorSettings>(PATH)
    }

    saveSettings(settings: CalculatorSettings): Observable<CalculatorSettings> {
        return this.http.put<CalculatorSettings>(PATH, settings)
    }
}
