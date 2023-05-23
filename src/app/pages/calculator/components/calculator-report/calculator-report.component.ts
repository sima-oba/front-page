import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading.service';

import { CalculatorBundle } from '../../models/calculator-bundle.model';
import { EmissionsPerHectareYear, RemovalPerHectareYear } from '../../models/calculator-report.model';
import { Item } from '../../models/item.model';
import { CalculatorResultService } from '../../services/calculator-result.service';

@Component({
    selector: 'app-calculator-report',
    templateUrl: './calculator-report.component.html',
    styleUrls: ['./calculator-report.component.scss']
})
export class CalculatorReportComponent {
    bundle: CalculatorBundle

    emissionChartOptions: ChartConfiguration['options']
    emissionChartData: ChartData<'bar'>
    emissionComparison: Item<number>[]
    farmEmission: number

    removalChartOptions: ChartConfiguration['options']
    removalChartData: ChartData<'bar'>
    farmRemoval: number
    baRemovalDiff: number
    matopibaRemovalDiff: number

    balanceChartOptions: ChartConfiguration['options']
    balanceChartData: ChartData<'bar'>

    sceneriesChartOptions: ChartConfiguration['options']
    sceneriesChartData: ChartData<'bar'>

    constructor(
        activatedRoute: ActivatedRoute,
        resultService: CalculatorResultService,
        loading: LoadingService
    ) {
        const id = activatedRoute.snapshot.params?.id

        Chart.register(ChartDataLabels)

        loading.withObservable(from(resultService.loadById(id)))        
            .pipe(first())
            .subscribe(bundle => {
                this.bundle = bundle
                this.setUpEmissionChart()
                this.setUpRemovalChart()
                this.setUpBalanceChart()
                this.setUpSceneriesChart()
            })
    }

    private setUpEmissionChart() {
        const { farm, bahia, matopiba } = new EmissionsPerHectareYear(this.bundle)
        const max = Math.max(farm.total, bahia.total, matopiba.total)

        this.farmEmission = farm.total
        this.emissionComparison = [
            {
                title: 'Óleo Diesel',
                icon: 'assets/icons/diesel.svg',
                description: `uso de óleo Diesel`,
                value: farm.diesel / farm.total * 100
            },
            {
                title: 'Restos Culturais',
                icon: 'assets/icons/remainder.svg',
                description: `decomposição dos restos culturais`,
                value: farm.cropRemains / farm.total * 100
            },
            {
                title: 'Calagem e Gesso',
                icon: 'assets/icons/liming.svg',
                description: `calagem e gesso`,
                value: farm.limingAndPlastering / farm.total * 100
            },
            {
                title: 'Energia Elétrica',
                icon: 'assets/icons/lamp.svg',
                description: `energia elétrica`,
                value: farm.electricPower / farm.total * 100
            },
            {
                title: 'Fertilização Nitrogenada',
                icon: 'assets/icons/fertilizer.svg',
                description: `fertilização nitrogenada`,
                value: farm.nitrogenFertilization / farm.total * 100
            }
        ].sort((a, b) => b.value - a.value)

        this.emissionChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: [
                            'Indicadores de Emissão de GEE',
                            'tCO₂e/hectare'
                        ],
                    },
                    grid: {
                        color: context => {
                            const tick = context.tick.value

                            if (tick >= max) return 'red'
                            if (tick === 0) return 'green'

                            return 'rgba(0, 0, 0, 0.05)'
                        },
                        lineWidth: context => {
                            const tick = context.tick.value

                            if (tick >= max || tick === 0) {
                                return 2
                            }

                            return 1
                        },
                        drawBorder: false
                    },
                    ticks: {
                        padding: 8
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        padding: 24
                    }
                },
                datalabels: {
                    anchor: 'end',
                    offset: 1,
                    align: 'top',
                    font: {
                        family: 'Roboto, "Helvetica Neue", sans-serif',
                        size: 10,
                        weight: 500
                    },
                    formatter: (value: number) => value.toFixed(2).replace('.', ',')
                }
            }
        }

        const borderWidth = 2

        this.emissionChartData = {
            labels: [
                ['Calagem', 'e Gesso'],
                ['Restos', 'Culturais'],
                'Óleo Diesel',
                'Energia Elétrica',
                ['Fertilização', 'Nitrogenada'],
                'Emissão Total'
            ],
            datasets: [
                {
                    label: 'Fazenda',
                    backgroundColor: 'rgba(75, 134, 145, 0.5)',
                    borderColor: 'rgb(75, 134, 145)',
                    borderWidth,
                    data: [
                        farm.limingAndPlastering,
                        farm.cropRemains,
                        farm.diesel,
                        farm.electricPower,
                        farm.nitrogenFertilization,
                        farm.total
                    ]
                },
                {
                    label: 'Bahia',
                    backgroundColor: 'rgba(201, 118, 183, 0.5)',
                    borderColor: 'rgb(201, 118, 183)',
                    borderWidth,
                    data: [
                        bahia.limingAndPlastering,
                        bahia.cropRemains,
                        bahia.diesel,
                        bahia.electricPower,
                        bahia.nitrogenFertilization,
                        bahia.total
                    ],
                },
                {
                    label: 'Matopiba',
                    backgroundColor: 'rgba(212, 172, 125, 0.5)',
                    borderColor: 'rgba(212, 172, 125)',
                    borderWidth,
                    data: [
                        matopiba.limingAndPlastering,
                        matopiba.cropRemains,
                        matopiba.diesel,
                        matopiba.electricPower,
                        matopiba.nitrogenFertilization,
                        matopiba.total
                    ]
                }
            ]
        }
    }

    private setUpRemovalChart() {
        const { farm, bahia, matopiba } = new RemovalPerHectareYear(this.bundle)
        const min = Math.min(farm, bahia, matopiba)

        this.farmRemoval = farm
        this.baRemovalDiff = (-farm) / (-bahia) * 100 - 100
        this.matopibaRemovalDiff = (-farm) / (-matopiba) * 100 - 100

        this.removalChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ['Sequestro de GEE', 'tCO₂e/hectare']
                    },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 0.5,
                        padding: 8
                    },
                    grid: {
                        color: context => {
                            const tick = context.tick.value

                            if (tick === 0) return 'red'
                            if (tick <= min) return 'green'

                            return 'rgba(0, 0, 0, 0.05)'
                        },
                        lineWidth: context => {
                            const tick = context.tick.value

                            if (tick <= min || tick === 0) {
                                return 2
                            }

                            return 1
                        },
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        padding: 24
                    }
                },
                datalabels: {
                    anchor: 'start',
                    offset: 4,
                    align: 'bottom',
                    font: {
                        family: 'Roboto, "Helvetica Neue", sans-serif',
                        size: 16,
                        weight: 500
                    },
                    formatter: (value: number) => value.toFixed(2).replace('.', ',')
                }
            }
        }

        const barPercentage = 0.3
        const borderWidth = 2

        this.removalChartData = {
            labels: [''],
            datasets: [
                {
                    label: 'Fazenda',
                    backgroundColor: 'rgba(75, 134, 145, 0.5)',
                    borderColor: 'rgb(75, 134, 145)',
                    borderWidth,
                    barPercentage,
                    data: [farm]
                },
                {
                    label: 'Bahia',
                    backgroundColor: 'rgba(201, 118, 183, 0.5)',
                    borderColor: 'rgb(201, 118, 183)',
                    borderWidth,
                    barPercentage,
                    data: [bahia]
                },
                {
                    label: 'Matopiba',
                    backgroundColor: 'rgba(212, 172, 125, 0.5)',
                    borderColor: 'rgba(212, 172, 125)',
                    borderWidth,
                    barPercentage,
                    data: [matopiba]
                }
            ]
        }
    }

    private setUpBalanceChart() {
        const axisLimit = Math.max(
            Math.abs(this.farmEmission),
            Math.abs(this.farmRemoval),
            Math.abs(this.bundle.result.baseline_per_area)
        ) + 0.5

        this.balanceChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: context => {
                            const tick = context.tick.value

                            if (tick === 0) return '#bfbfbf'
                            if (tick >= axisLimit) return 'red'
                            if (tick <= -axisLimit) return 'green'

                            return 'rgba(0, 0, 0, 0.05)'
                        },
                        lineWidth: context => {
                            const tick = context.tick.value

                            if (tick === 0) return 3
                            if (tick >= axisLimit || tick <= -axisLimit) return 2

                            return 1
                        },
                        borderColor: 'rgba(0, 0, 0, 0.05)'
                    },
                    max: axisLimit,
                    min: -axisLimit
                }
            },
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        padding: 24
                    }
                },
                datalabels: {
                    anchor: 'center',
                    offset: 8,
                    font: {
                        family: 'Roboto, "Helvetica Neue", sans-serif',
                        size: 16,
                        weight: 500
                    },
                    formatter: (value: number) => value.toFixed(2).replace('.', ',')
                }
            }
        }

        const borderWidth = 2

        this.balanceChartData = {
            labels: [''],
            datasets: [
                {
                    label: 'Emissão total',
                    backgroundColor: 'rgba(201, 118, 183, 0.5)',
                    borderColor: 'rgb(201, 118, 183)',
                    borderWidth,
                    data: [this.bundle.result.gee_emission_per_area],
                },
                {
                    label: 'Sequestro',
                    backgroundColor: 'rgba(75, 134, 145, 0.5)',
                    borderColor: 'rgb(75, 134, 145)',
                    borderWidth,
                    data: [this.farmRemoval]
                },
                {
                    label: 'Balanço de carbono',
                    backgroundColor: 'rgba(212, 172, 125, 0.5)',
                    borderColor: 'rgba(212, 172, 125)',
                    borderWidth,
                    data: [this.bundle.result.baseline_per_area]
                }
            ]
        }
    }

    private setUpSceneriesChart() {
        const { baseline_per_area, gee_scenery_4_per_area } = this.bundle.result
        const min = Math.min(baseline_per_area, gee_scenery_4_per_area)

        this.sceneriesChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        padding: 8,
                        stepSize: 0.5
                    },
                    grid: {
                        color: context => {
                            const tick = context.tick.value

                            if (tick === 0) return 'red'
                            if (tick <= min) return 'green'

                            return 'rgba(0, 0, 0, 0.05)'
                        },
                        lineWidth: context => {
                            const tick = context.tick.value

                            if (tick <= min || tick === 0) {
                                return 2
                            }

                            return 1
                        },
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        padding: 24
                    }
                },
                datalabels: {
                    anchor: 'start',
                    offset: 8,
                    align: 'bottom',
                    font: {
                        family: 'Roboto, "Helvetica Neue", sans-serif',
                        size: 16,
                        weight: 500
                    },
                    formatter: (value: number) => value.toFixed(2).replace('.', ',')
                }
            }
        }

        const barPercentage = 0.3
        const borderWidth = 2

        this.sceneriesChartData = {
            labels: [''],
            datasets: [
                {
                    label: 'Cenário atual',
                    backgroundColor: 'rgba(75, 134, 145, 0.5)',
                    borderColor: 'rgb(75, 134, 145)',
                    borderWidth,
                    barPercentage,
                    data: [baseline_per_area]
                },
                {
                    label: 'Cenário de Balanço de Carbono em Sistema Plantio Direto com Braquiária',
                    backgroundColor: 'rgba(212, 172, 125, 0.5)',
                    borderColor: 'rgba(212, 172, 125)',
                    borderWidth,
                    barPercentage,
                    data: [gee_scenery_4_per_area]
                }
            ]
        }
    }

}
