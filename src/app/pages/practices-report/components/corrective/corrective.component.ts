import { Component } from '@angular/core';
import { ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { CorrectiveReport } from '../../models/corrective-report';
import { PracticeReportService } from '../../services/practice-report.service';
import { PracticeReportComponent } from '../practice-report.component';

@Component({
    selector: 'app-corrective',
    templateUrl: './corrective.component.html',
    styleUrls: [
        '../practice-report.component.scss',
        './corrective.component.scss'
    ]
})
export class CorrectiveQualityComponent extends PracticeReportComponent<CorrectiveReport> {
    constructor(service: PracticeReportService) {
        super('CORRECTIVE_QUALITY', service)
    }
    
    protected getChartData(report: CorrectiveReport): ChartData<'bar'> {
        const barPercentage = 1
        const categoryPercentage = 0.5

        return {
            labels: [
                ['Produto apresenta', 'densidade adequada'],
                ['Produto possui', 'acondicionamento', 'e embalagem', 'adequadas'],
                ['Produto possui', 'todos os', 'elementos', 'declarados pelo', 'fornecedor'],
                ['Há contaminação', 'entre materiais'],
                ['Há problema', 'com a entrega', 'do produto']
            ],
            datasets: [
                {
                    label: 'Sim',
                    backgroundColor: '#99ccff',
                    hoverBackgroundColor: '#4da6ff',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.is_density_adequate.yes,
                        report.is_conditioning_adequate.yes,
                        report.has_declared_elements.yes,
                        report.is_contaminated.yes,
                        report.has_logistical_problems.yes
                    ]
                },
                {
                    label: 'Não',
                    backgroundColor: '#ff9999',
                    hoverBackgroundColor: '#ff4d4d',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.is_density_adequate.no,
                        report.is_conditioning_adequate.no,
                        report.has_declared_elements.no,
                        report.is_contaminated.no,
                        report.has_logistical_problems.no
                    ]
                }
            ]
        }
    }
}
