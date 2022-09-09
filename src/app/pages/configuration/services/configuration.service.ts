import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonService} from "../../../configurations/commons/common.service";
import {Configuration} from "../models/configuration.";
import {EmailTemplate} from "../models/email-template.model";
import {Observable} from "rxjs";
import {OrdinanceSettings} from "../models/ordinance-settings.model";

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService extends CommonService<Configuration>  {

    constructor(protected http: HttpClient) { super(http,) }

    getServerPath(): string {
        return '/configuration'
    }

    getEmailTemplates(): Observable<EmailTemplate[]> {
        return this.http.get<EmailTemplate[]>('/notification/templates')
    }

    getOrdinanceSettings(): Observable<OrdinanceSettings> {
        return this.http.get<OrdinanceSettings>('/ordinances/settings')
    }

    saveOrdinanceSettings(settings: OrdinanceSettings): Observable<any> {
        return this.http.post('/ordinances/settings', settings)
    }

}
