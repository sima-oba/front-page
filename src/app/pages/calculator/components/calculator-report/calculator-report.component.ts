import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

import { LoadingService } from 'src/app/core/services/loading.service';
import { bgColor } from 'src/app/core/utils/chart/plugins';
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

    private containerEl: HTMLElement

    constructor(
        activatedRoute: ActivatedRoute,
        resultService: CalculatorResultService,
        private loading: LoadingService
    ) {
        const id = activatedRoute.snapshot.params?.id
        Chart.register(ChartDataLabels, bgColor)

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

    @ViewChild('container')
    set container(value: ElementRef<HTMLElement>) {
        this.containerEl = value?.nativeElement
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

    async exportAsPDF() {
        this.loading.on()

        try {
            const pdf = new jsPDF('portrait', 'pt', 'a4')
            pdf.addFont('assets/fonts/Roboto-Regular.ttf', 'Roboto', 'normal')
            pdf.addFont('assets/fonts/Roboto-Medium.ttf', 'Roboto', 'bold')

            const width = pdf.internal.pageSize.getWidth()
            const height = pdf.internal.pageSize.getHeight()
            const content = document.createElement('div')

            const page1 = this.createPage(width, height, 1,
                this.createTitle(),
                this.createPresentation(),
                this.createEmissionComparisonPart1()
            )
            content.append(page1)

            const page2 = this.createPage(width, height, 2,
                this.createEmissionComparisonPart2(),
                this.createCarbonSequestration(),
                this.createFarmCarbonBalancePart1(),
            )
            content.append(page2)

            const page3 = this.createPage(width, height, 3,
                this.createFarmCarbonBalancePart2(),
                this.createCarbonBalanceScenarios(),
                this.createCarbonStockInNativeVegetation()
            )
            content.append(page3)

            const page4 = this.createPage(width, height, 4,
                this.createConclusion()
            )
            content.append(page4)

            await pdf.html(content, { autoPaging: 'slice' })
            pdf.deletePage(pdf.getNumberOfPages())

            const now = new Date()
            const filename = `Relatório Emissões e Sequestro de Carbono - ${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}.pdf`
            pdf.save(filename)
        } finally {
            this.loading.off()
        }
    }

    private createTitle(): HTMLElement {
        const h3 = document.createElement('h3')
        h3.style.margin = '0'
        h3.style.paddingBottom = '4px'
        h3.style.textAlign = 'center'
        h3.style.fontSize = '12pt'
        h3.style.fontStyle = 'bold'
        h3.style.color = '#458985'
        h3.style.borderBottom = 'solid 3px #cbd862'
        h3.textContent = this.containerEl
            .querySelector<HTMLElement>('h3.title')
            .innerText
            .trim()
            .toUpperCase()

        return h3
    }

    private createPresentation(): HTMLElement {
        const titleText = this.containerEl
            .querySelector<HTMLElement>('#presentation h2')
            .innerText
            .trim()

        const paragraphs = Array
            .from(this.containerEl.querySelectorAll<HTMLElement>('#presentation p'))
            .map(element => {
                const p = element.cloneNode(true) as HTMLElement
                p.style.fontSize = '10pt'
                return p
            })

        const section = this.createSection(titleText)
        section.append(...paragraphs)

        return section
    }

    private createEmissionComparisonPart1(): HTMLElement {
        const title = this.containerEl
            .querySelector<HTMLElement>('#emisison-comparison h2')
            .innerText
            .trim()

        const chartDataUrl = this.containerEl
            .querySelector<HTMLCanvasElement>('canvas')
            .toDataURL('image/jpg')

        const chartImg = document.createElement('img')
        chartImg.style.width = '100%'
        chartImg.src = chartDataUrl

        const note = document
            .querySelector('#emisison-comparison .legend')
            .cloneNode(true) as HTMLElement
        note.className = ''
        note.style.margin = '0'
        note.style.padding = '0'
        note.style.background = 'none'
        note.style.fontSize = '8pt'

        const section = this.createSection(title)
        section.append(chartImg, note)

        return section
    }

    private createEmissionComparisonPart2(): HTMLElement {
        const paragraph = this.containerEl
            .querySelector('#emisison-comparison .text p')
            .cloneNode(true) as HTMLElement
        paragraph.style.fontSize = '10pt'
        paragraph.style.color = '#4f4f4f'

        const legends = Array
            .from(this.containerEl.querySelectorAll<HTMLElement>('#emisison-comparison .box-legend'))
            .map(element => {
                const li = document.createElement('li')
                li.style.paddingLeft = '8px'
                li.style.fontSize = '10pt'
                li.style.color = '#4f4f4f'
                li.textContent = element.innerText
                return li
            })
        const legendsUl = document.createElement('ul')
        legendsUl.append(...legends)

        const section = this.createSection()
        section.append(paragraph, legendsUl)

        return section
    }

    private createCarbonSequestration(): HTMLElement {
        const title = this.containerEl
            .querySelector<HTMLElement>('#carbon-sequestration h2')
            .innerText
            .trim()

        const chart = this.canvasToImage('#carbon-sequestration canvas')

        const paragraph = this.containerEl
            .querySelector('#carbon-sequestration p')
            .cloneNode(true) as HTMLElement
        paragraph.style.fontSize = '10pt'
        paragraph.style.color = '#4f4f4f'

        const section = this.createSection(title)
        section.append(chart, paragraph)

        return section
    }

    private createFarmCarbonBalancePart1(): HTMLElement {
        const title = this.containerEl
            .querySelector<HTMLElement>('#farm-carbon-balance h2')
            .innerText
            .trim()

        const chart = this.canvasToImage('#farm-carbon-balance canvas')

        const paragraph = this.containerEl
            .querySelector('#farm-carbon-balance p')
            .cloneNode(true) as HTMLElement
        paragraph.style.fontSize = '10pt'
        paragraph.style.color = '#4f4f4f'

        const section = this.createSection(title)
        section.append(chart)

        return section
    }

    private createFarmCarbonBalancePart2(): HTMLElement {
        const paragraph = this.containerEl
            .querySelector('#farm-carbon-balance p')
            .cloneNode(true) as HTMLElement
        paragraph.style.fontSize = '10pt'
        paragraph.style.color = '#4f4f4f'

        const section = this.createSection()
        section.append(paragraph)

        return section
    }

    private createCarbonBalanceScenarios(): HTMLElement {
        const title = this.containerEl
            .querySelector<HTMLElement>('#carbon-balance-scenarios h2')
            .innerText
            .trim()

        const chart = this.canvasToImage('#carbon-balance-scenarios canvas')

        const paragraph = this.containerEl
            .querySelector('#carbon-balance-scenarios p')
            .cloneNode(true) as HTMLElement
        paragraph.style.fontSize = '10pt'
        paragraph.style.color = '#4f4f4f'

        const section = this.createSection(title)
        section.append(chart, paragraph)

        return section
    }

    private createCarbonStockInNativeVegetation(): HTMLElement {
        const title = this.containerEl
            .querySelector<HTMLElement>('#carbon-stock-in-native-vegetation h2')
            .innerText
            .trim()

        const items = Array
            .from(this.containerEl.querySelectorAll('#carbon-stock-in-native-vegetation .carbon-box-content'))
            .map(element => {
                const value = element.querySelector<HTMLElement>('.carbon-box-value').innerText
                const legend = element.querySelector<HTMLElement>('.carbon-box-legend').innerText
                const li = document.createElement('li')
                li.textContent = `${legend}: ${value}`
                li.style.paddingLeft = '8px'
                li.style.fontSize = '10pt'
                li.style.color = '#4f4f4f'
                return li
            })

        const ul = document.createElement('ul')
        ul.append(...items)

        const paragraph = this.containerEl
            .querySelector('#carbon-stock-in-native-vegetation p')
            .cloneNode(true) as HTMLElement
        paragraph.style.fontSize = '10pt'
        paragraph.style.color = '#4f4f4f'
        paragraph.className = ''

        const section = this.createSection(title)
        section.append(ul, paragraph)

        return section
    }

    private createConclusion(): HTMLElement {
        const title = this.containerEl
            .querySelector<HTMLElement>('#conclusion h1')
            .innerText
            .trim()

        const paragraphs = Array
            .from(this.containerEl.querySelectorAll('#conclusion p'))
            .map(element => {
                const p = element.cloneNode(true) as HTMLElement
                p.style.fontSize = '10pt'
                return p
            })

        const section = this.createSection(title)
        section.append(...paragraphs)


        return section
    }

    private createPage(width: number, height: number, pageNumber: number, ...contents: HTMLElement[]): HTMLElement {
        const page = document.createElement('div')
        page.style.boxSizing = 'border-box'
        page.style.width = width + 'px'
        page.style.height = height + 'px'
        page.style.display = 'flex'
        page.style.flexDirection = 'column'
        page.style.padding = '40px'
        page.style.fontFamily = 'Roboto'
        page.style.letterSpacing = '0.01px'

        const logo = document.createElement('img')
        logo.style.display = 'block'
        logo.style.width = '100px'
        logo.style.margin = '0 auto'
        logo.style.marginBottom = '16px'
        logo.src = '/assets/img/logos/logo-normal.png'

        const header = document.createElement('header')
        header.append(logo)
        page.append(header)

        const body = document.createElement('div')
        body.style.flexGrow = '1'
        body.append(...contents)
        page.append(body)

        const footer = document.createElement('footer')
        footer.style.display = 'flex'
        footer.style.justifyContent = 'end'
        footer.style.alignItems = 'end'
        footer.style.fontFamily = 'Roboto'
        footer.style.fontSize = '8pt'
        footer.textContent = pageNumber.toString()
        page.append(footer)

        return page
    }

    private createSection(title?: string): HTMLElement {
        const section = document.createElement('section')

        if (title) {
            const h4 = document.createElement('h4')
            h4.style.fontSize = '12pt'
            h4.style.color = '#458985'
            h4.style.marginBottom = '16px'
            h4.textContent = title
            section.append(h4)
        }

        return section
    }

    private canvasToImage(canvasSelector: string): HTMLImageElement {
        const dataUrl = this.containerEl
            .querySelector<HTMLCanvasElement>(canvasSelector)
            .toDataURL('image/jpg')

        const img = document.createElement('img')
        img.style.width = '100%'
        img.src = dataUrl

        return img
    }
}
