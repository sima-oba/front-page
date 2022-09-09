import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from "../../configurations/commons/common.service";
import {ClimateRisk} from "./climate-risk";


@Injectable({providedIn: 'root'})
export class ClimateRiskService extends CommonService<ClimateRisk> {

    constructor(protected http: HttpClient) { super(http,) }

    getServerPath(): string {
        return 'producer/calculator'
    }
}
