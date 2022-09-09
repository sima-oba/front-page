import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TotalReport } from '../models/total-report.model';

const PATH = '/producer/practices/report'

export type ReportType =
	'TOTAL' |
	'CONTROLLED_TRAFFIC_SYSTEM' |
	'CORRECTIVE_QUALITY' |
	'CROP_ROTATION' |
	'IRRIGATION_USE_EFFICIENCY' |
	'PHYTOSANITARY' |
	'SOIL_RECHARGE_AND_MOISTURE' |
	'SOIL_TEMPERATURE' |
	'SUSTAINABLE' |
	'WATER_RUNOFF_CONTAINMENT'

@Injectable({
	providedIn: 'root'
})
export class PracticeReportService {

	constructor(private client: HttpClient) { }

	getReport<T>(reportType: ReportType): Observable<T> {
		if (reportType === 'TOTAL') {
			return this.getTotalReport() as Observable<any>
		}

		const params = { practice_type: reportType }
		return this.client.get<T>(PATH, { params })
	}

	private getTotalReport(): Observable<TotalReport> {
		return this.client.get<TotalReport>(PATH + '/total')
	}
}
