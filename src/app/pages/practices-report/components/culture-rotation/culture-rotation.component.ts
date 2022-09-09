import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { CropRotationReport } from '../../models/crop-rotation.model';
import { PracticeReportService } from '../../services/practice-report.service';
import { PracticeReportComponent } from '../practice-report.component';

@Component({
    selector: 'app-culture-rotation',
    templateUrl: './culture-rotation.component.html',
    styleUrls: [
        '../practice-report.component.scss',
        './culture-rotation.component.scss'
    ]
})
export class CultureRotationComponent extends PracticeReportComponent<CropRotationReport> {

    constructor(service: PracticeReportService) {
        super('CROP_ROTATION', service, false)
    }

    protected getChartData(report: CropRotationReport): ChartData<'bar', number[], unknown> {
        return {
            labels: [
                'Algodão',
                'Milho',
                'Soja',
                'Café',
                'Sorgo',
                'Milheto',
                'Feijão',
                'Trigo',
                'Outras'
            ],
            datasets: [{
                backgroundColor: '#689c99',
                hoverBackgroundColor: '#055632',
                barPercentage: 0.55,
                data: [
                    report.algodao,
                    report.milho,
                    report.soja,
                    report.cafe,
                    report.sorgo,
                    report.milheto,
                    report.feijao,
                    report.trigo,
                    report.outras
                ]
            }]
        }
    }
}
