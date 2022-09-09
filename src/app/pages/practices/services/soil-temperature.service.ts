import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { CommonResponse } from 'src/app/configurations/commons/common-response';
import { AppUtils } from 'src/app/helpers/app-utils';
import { CommonService } from "../../../configurations/commons/common.service";
import { SoilTemperature } from "../models/soil-temperature";

@Injectable({providedIn: 'root'})
export class SoilTemperatureService extends CommonService<SoilTemperature> {

    constructor(protected http: HttpClient) { super(http,) }

    getServerPath(): string {
        return 'producer/practices'
    }

    protected findAll(): any {
        const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}?practice_type=SOIL_TEMPERATURE`;
        return this.http.get<CommonResponse>(baseUrl).pipe(
            map((response: any) => {
                if (response) { return response as Array<SoilTemperature>; }
                return null;
            }),
            catchError((response: HttpErrorResponse) => {
                return AppUtils.handlerHttpError(response);
            })
        );
    }
}