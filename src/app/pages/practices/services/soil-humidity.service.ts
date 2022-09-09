import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CommonService} from "../../../configurations/commons/common.service";
import {SoilHumidity} from "../models/soil-humidity.model";
import { CommonResponse } from 'src/app/configurations/commons/common-response';
import { catchError, map } from 'rxjs/operators';
import { AppUtils } from 'src/app/helpers/app-utils';


@Injectable({providedIn: 'root'})
export class SoilHumidityService extends CommonService<SoilHumidity> {

    constructor(protected http: HttpClient) { super(http,) }

    getServerPath(): string {
        return 'producer/practices'
    }

    protected findAll(): any {
        const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}?practice_type=SOIL_RECHARGE_AND_MOISTURE`;
        return this.http.get<CommonResponse>(baseUrl).pipe(
            map((response: any) => {
                if (response) { return response as Array<SoilHumidity>; }
                return null;
            }),
            catchError((response: HttpErrorResponse) => {
                return AppUtils.handlerHttpError(response);
            })
        );
    }
}
