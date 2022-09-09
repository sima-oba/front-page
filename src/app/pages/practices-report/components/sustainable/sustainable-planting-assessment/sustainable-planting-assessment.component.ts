import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { SustainableReport } from '../../../models/sustainable-report';
import { PracticeReportService } from '../../../services/practice-report.service';
import { PracticeReportComponent } from '../../practice-report.component';

@Component({
    selector: 'app-sustainable-planting-assessment',
    templateUrl: './sustainable-planting-assessment.component.html',
    styleUrls: [
        '../../practice-report.component.scss',
        './sustainable-planting-assessment.component.scss'
    ]
})
export class SustainablePlantingAssessmentComponent extends PracticeReportComponent<SustainableReport> {

    constructor(service: PracticeReportService) {
        super('SUSTAINABLE', service, false)
    }

    protected getChartData(report: SustainableReport): ChartData<'bar'> {
        return {
            labels: [
                'Ruim',
                'Razoável',
                'Bom',
                'Excelente'
            ],
            datasets: [{
                backgroundColor: '#689c99',
                hoverBackgroundColor: '#055632',
                barPercentage: 0.5,
                data: [
                    report.planting_assessment['0'],
                    report.planting_assessment['1'],
                    report.planting_assessment['2'],
                    report.planting_assessment['3']
                ]
            }]
        }
    }
}
