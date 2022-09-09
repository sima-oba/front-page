import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

import { IrrigationUseEfficiencyReport } from '../../models/irrigation-efficiency.model';
import { PracticeReportService } from '../../services/practice-report.service';
import { PracticeReportComponent } from '../practice-report.component';

@Component({
    selector: 'app-efficiency-balance',
    templateUrl: './efficiency-balance.component.html',
    styleUrls: [
        '../practice-report.component.scss',
        './efficiency-balance.component.scss'
    ]
})
export class EfficiencyBalanceComponent extends PracticeReportComponent<IrrigationUseEfficiencyReport> {

    constructor(service: PracticeReportService) {
        super('IRRIGATION_USE_EFFICIENCY', service)
    }

    protected getChartData(report: IrrigationUseEfficiencyReport): ChartData<'bar'> {
        const categoryPercentage = 0.55
        const barPercentage = 1

        return {
            labels: [
                ['Possui área', 'irrigada'],
                ['Possui medidor', 'de vazão'],
                ['Medidor transmite', 'dados telemétricos'],
                ['Uso de sistemas', 'de irrigação']
            ],
            datasets: [
                {
                    label: 'Sim',
                    backgroundColor: '#99ccff',
                    hoverBackgroundColor: '#4da6ff',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.has_irrigated_agriculturearea.yes,
                        report.has_flow_meter.yes,
                        report.meter_transmits_telemetric_data.yes,
                        report.use_of_irrigation_systems.yes
                    ]
                },
                {
                    label: 'Não',
                    backgroundColor: '#ff9999',
                    hoverBackgroundColor: '#ff4d4d',
                    categoryPercentage,
                    barPercentage,
                    data: [
                        report.has_irrigated_agriculturearea.yes,
                        report.has_flow_meter.yes,
                        report.meter_transmits_telemetric_data.yes,
                        report.use_of_irrigation_systems.yes
                    ]
                }
            ]
        }
    }
}
