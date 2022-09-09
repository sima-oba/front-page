import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { TotalReport } from '../../models/total-report.model';
import { PracticeReportService } from '../../services/practice-report.service';
import { PracticeReportComponent } from '../practice-report.component';

@Component({
    selector: 'app-total',
    templateUrl: './total.component.html',
    styleUrls: [
        '../practice-report.component.scss',
        './total.component.scss'
    ]
})
export class TotalComponent extends PracticeReportComponent<TotalReport> {

    constructor(service: PracticeReportService) {
        super('TOTAL', service, false)
    }

    getChartData(report: TotalReport): ChartData<'bar'> {
        return {
            labels: [
                ['Contenção por', 'Microbarragens'],
                'Corretivas',
                'Fitossanitárias',
                'Rotação de Cultura',
                'Sustentáveis',
                ['Temperatura', 'do Solo'],
                'Tráfego Controlado',
                'Umidade do Solo',
                'Uso da Irrigação'
            ],
            datasets: [{
                barPercentage: 0.6,
                backgroundColor: '#84aeac',
                hoverBackgroundColor: '#5b8b89',
                data: [
                    report.WATER_RUNOFF_CONTAINMENT,
                    report.CORRECTIVE_QUALITY,
                    report.PHYTOSANITARY,
                    report.CROP_ROTATION,
                    report.SUSTAINABLE,
                    report.SOIL_TEMPERATURE,
                    report.CONTROLLED_TRAFFIC_SYSTEM,
                    report.SOIL_RECHARGE_AND_MOISTURE,
                    report.IRRIGATION_USE_EFFICIENCY
                ]
            }]
        }
    }
}
