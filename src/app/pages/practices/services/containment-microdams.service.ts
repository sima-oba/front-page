import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from "../../../configurations/commons/common.service";
import {ContainmentMicrodams} from "../models/containment-microdams";


@Injectable({providedIn: 'root'})
export class ContainmentMicrodamsService extends CommonService<ContainmentMicrodams> {

    constructor(protected http: HttpClient) { super(http,) }

    getServerPath(): string {
        return 'producer/practices'
    }
}
