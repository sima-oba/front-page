import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { ContainmentMicrodamsReport } from '../../../models/containment-microdams';
import { PracticeReportService } from '../../../services/practice-report.service';
import { PracticeReportComponent } from '../../practice-report.component';

@Component({
    selector: 'app-containment-microdams-quality',
    templateUrl: './containment-microdams-quality.component.html',
    styleUrls: [
        '../../practice-report.component.scss',
        './containment-microdams-quality.component.scss'
    ]
})
export class ContainmentMicrodamsQualityComponent extends PracticeReportComponent<ContainmentMicrodamsReport> {

    constructor(service: PracticeReportService) {
        super('WATER_RUNOFF_CONTAINMENT', service, false)
    }

    protected getChartData(report: ContainmentMicrodamsReport): ChartData<'bar'> {
        return {
            labels: [
                'Ruim',
                'Razoável',
                'Bom',
                'Excelente'
            ],
            datasets: [
                {
                    backgroundColor: '#84aeac',
                    hoverBackgroundColor: '#5b8b89',
                    barPercentage: 0.5,
                    data: [
                        report.micro_dams_quality['0'],
                        report.micro_dams_quality['1'],
                        report.micro_dams_quality['2'],
                        report.micro_dams_quality['3'],
                    ]
                }
            ]
        }
    }
}
