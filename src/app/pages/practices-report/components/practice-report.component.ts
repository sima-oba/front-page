import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { Observable } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { first, map } from 'rxjs/operators';
import { PracticeReportService, ReportType } from '../services/practice-report.service';

export abstract class PracticeReportComponent<T> {
    chartOptions: ChartConfiguration['options']
    data$: Observable<ChartData<'bar'>>

    constructor(
        reportType: ReportType,
        protected service: PracticeReportService,
        showLegend = true
    ) {
        this.registerChartPlugins()
        this.setUpChartOptions(showLegend)
        this.setUpCharData(reportType)
    }

    protected abstract getChartData(report: T): ChartData<'bar'>

    protected registerChartPlugins() {
        Chart.register(ChartDataLabels)
    }

    protected setUpChartOptions(showLegend: boolean) {
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    grid: { display: false },
                    display: false
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: '#a3aad2',
                        font: {
                            family: 'Roboto, "Helvetica Neue", sans-serif',
                            size: 14
                        }
                    }
                },
            },
            layout: {
                padding: {
                    left: 16,
                    right: 48
                }
            },
            plugins: {
                legend: {
                    display: showLegend,
                    labels: {
                        usePointStyle: true,
                        padding: 24,
                        font: { size: 14 },
                    }
                },
                datalabels: {
                    anchor: 'end',
                    offset: 8,
                    align: 'right',
                    color: '#a3aad2',
                    font: {
                        family: 'Roboto, "Helvetica Neue", sans-serif',
                        size: 16,
                        weight: 500
                    }
                }
            }
        }
    }

    private setUpCharData(reportType: ReportType) {
        this.data$ = this.service.getReport<T>(reportType)
            .pipe(
                first(),
                map(report => this.getChartData(report))
            )
    }
}
