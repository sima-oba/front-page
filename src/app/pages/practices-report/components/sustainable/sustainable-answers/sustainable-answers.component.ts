import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { SustainableReport } from '../../../models/sustainable-report';
import { PracticeReportService } from '../../../services/practice-report.service';
import { PracticeReportComponent } from '../../practice-report.component';

@Component({
    selector: 'app-sustainable-answers',
    templateUrl: './sustainable-answers.component.html',
    styleUrls: [
        '../../practice-report.component.scss',
        './sustainable-answer.component.scss'
    ]
})
export class SustainableAnswersComponent extends PracticeReportComponent<SustainableReport> {

    constructor(service: PracticeReportService) {
        super('SUSTAINABLE', service)
    }

    protected getChartData(report: SustainableReport): ChartData<'bar'> {
        const categoryPercentage = 0.6
        const barPercentage = 1

        return {
            labels: [
                ['Satisfeito com', 'o SPD'],
                ['Executa as', 'operações', 'agrícolas em nível'],
                'Possui terraços',
                ['Observa erosão', 'na lavoura'],
                ['Observa', 'revolvimento', 'do solo'],
                ['Solo está', 'compactado'],
                ['Possui minhocas', 'na lavoura'],
                ['Segue', 'critérios técnicos'],
                ['Utiliza esterco', 'bovino ou suíno', 'ou cama de frango', 'na lavoura']
            ],
            datasets: [
                {
                    label: 'Sim',
                    backgroundColor: '#99ccff',
                    hoverBackgroundColor: '#4da6ff',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.are_satisfied_with_planting.yes,
                        report.perform_agricultural_operations.yes,
                        report.has_terraces.yes,
                        report.has_erosion.yes,
                        report.has_soil_disturbance.yes,
                        report.is_soil_compactated.yes,
                        report.has_earthworms.yes,
                        report.follow_technical_guidelines.yes,
                        report.uses_manure.yes
                    ]
                },
                {
                    label: 'Não',
                    backgroundColor: '#ff9999',
                    hoverBackgroundColor: '#ff4d4d',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.are_satisfied_with_planting.no,
                        report.perform_agricultural_operations.no,
                        report.has_terraces.no,
                        report.has_erosion.no,
                        report.has_soil_disturbance.no,
                        report.is_soil_compactated.no,
                        report.has_earthworms.no,
                        report.follow_technical_guidelines.no,
                        report.uses_manure.no
                    ]
                }
            ]
        }
    }
}
