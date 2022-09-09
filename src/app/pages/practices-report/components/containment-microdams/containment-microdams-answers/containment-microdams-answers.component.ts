import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { ContainmentMicrodamsReport } from '../../../models/containment-microdams';
import { PracticeReportService } from '../../../services/practice-report.service';
import { PracticeReportComponent } from '../../practice-report.component';

@Component({
    selector: 'app-containment-microdams-answers',
    templateUrl: './containment-microdams-answers.component.html',
    styleUrls: [
        '../../practice-report.component.scss',
        './containment-microdams-answers.component.scss'
    ]
})
export class ContainmentMicrodamsAnswersComponent extends PracticeReportComponent<ContainmentMicrodamsReport> {

    constructor(service: PracticeReportService) {
        super('WATER_RUNOFF_CONTAINMENT', service)
    }

    protected getChartData(report: ContainmentMicrodamsReport): ChartData<'bar'> {
        const categoryPercentage = 0.5
        const barPercentage = 1

        return {
            labels: [
                ['Possui', 'microbarragens', 'em margens das', 'estradas internas', 'da propriedade'],
                ['Possui curvas de', 'nível ou terraço'],
                ['As curvas de nível', 'ou terraço são', 'convergentes com', 'as propriedades', 'vizinhas'],
            ],
            datasets: [
                {
                    label: 'Sim',
                    backgroundColor: '#99ccff',
                    hoverBackgroundColor: '#4da6ff',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.has_micro_dams.yes,
                        report.has_level_curves.yes,
                        report.level_curves_convergent_with_neighbors.yes
                    ]
                },
                {
                    label: 'Não',
                    backgroundColor: '#ff9999',
                    hoverBackgroundColor: '#ff4d4d',
                    barPercentage,
                    categoryPercentage,
                    data: [
                        report.has_micro_dams.no,
                        report.has_level_curves.no,
                        report.level_curves_convergent_with_neighbors.no
                    ]
                }
            ]
        }
    }
}
