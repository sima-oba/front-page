import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { CommonResponse } from 'src/app/configurations/commons/common-response';
import { AppUtils } from 'src/app/helpers/app-utils';
import { CommonService } from "../../../configurations/commons/common.service";
import { ControlledTraffic } from '../models/controlled-traffic';
import { CropRotation } from "../models/crop-rotation";

@Injectable({providedIn: 'root'})
export class CultureRotationService extends CommonService<CropRotation> {

    constructor(protected http: HttpClient) { super(http,) }

    getServerPath(): string {
        return 'producer/practices'
    }

    protected findAll(): any {
        const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}?practice_type=CROP_ROTATION`;
        return this.http.get<CommonResponse>(baseUrl).pipe(
            map((response: any) => {
                if (response) { return response as Array<ControlledTraffic>; }
                return null;
            }),
            catchError((response: HttpErrorResponse) => {
                return AppUtils.handlerHttpError(response);
            })
        );
    }
}