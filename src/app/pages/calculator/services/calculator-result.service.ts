import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { CommonService } from "../../../configurations/commons/common.service";
import { CalculatorResult } from "../models/calculator-result.model";
import { CalculatorBundle } from '../models/calculator-bundle.model';

@Injectable({ providedIn: 'root' })
export class CalculatorResultService extends CommonService<CalculatorBundle> {

    constructor(protected http: HttpClient) { super(http,) }

    getServerPath(): string {
        return 'producer/calculator'
    }
}
