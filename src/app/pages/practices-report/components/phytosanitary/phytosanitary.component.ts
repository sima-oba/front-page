import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { PracticeReportService } from '../../services/practice-report.service';
import { PhytosanitaryReport } from '../../models/phytosanitary-report';
import { PracticeReportComponent } from '../practice-report.component';

@Component({
    selector: 'app-phytosanitary',
    templateUrl: './phytosanitary.component.html',
    styleUrls: [
        '../practice-report.component.scss',
        './phytosanitary.component.scss'
    ]
})
export class PhytosanitaryComponent extends PracticeReportComponent<PhytosanitaryReport> {

    constructor(service: PracticeReportService) {
        super('PHYTOSANITARY', service)
    }

    getChartData(report: PhytosanitaryReport): ChartData<'bar'> {
        const categoryPercentage = 0.68
        const barPercentage = 1

        return {
            labels: [
                ['Utiliza técnica', 'de refúgio'],
                ['Faz controle', 'agronômico'],
                ['Utiliza sistemas', 'de precisão'],
                'Adoção de MIP',
                'Adoção de MID',
            ],
            datasets: [
                {
                    label: 'Sim',
                    backgroundColor: '#99ccff',
                    hoverBackgroundColor: '#4da6ff',
                    barPercentage,
                    categoryPercentage,
                    data: [
                        report.uses_refuge.yes,
                        report.uses_agronomic_management.yes,
                        report.uses_precision_systems.yes,
                        report.uses_mip.yes,
                        report.uses_mid.yes
                    ]
                },
                {
                    label: 'Não',
                    backgroundColor: '#ff9999',
                    hoverBackgroundColor: '#ff4d4d',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.uses_refuge.no,
                        report.uses_agronomic_management.no,
                        report.uses_precision_systems.no,
                        report.uses_mip.no,
                        report.uses_mid.no
                    ]
                }
            ]
        }
    }
}
