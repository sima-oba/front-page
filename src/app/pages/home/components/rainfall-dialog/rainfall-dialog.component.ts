import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartConfiguration } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { RainfallMeasurement } from '../../models/rainfall-measurement.model';
import { RainfallStation } from '../../models/rainfall-station.model';
import { RainfallService } from '../../services/rainfall.service';

@UntilDestroy()
@Component({
    selector: 'app-rainfall-dialog',
    templateUrl: './rainfall-dialog.component.html',
    styleUrls: ['./rainfall-dialog.component.scss']
})
export class RainfallDialogComponent implements OnInit {
    selectedDate$ = new BehaviorSubject(new Date())

    private labels: string[]
    chartOptions: ChartConfiguration['options']
    isChartsVisible$: Observable<boolean>

    private measurements$: Observable<RainfallMeasurement[]>
    temperatures$: Observable<ChartConfiguration['data']>
    humidity$: Observable<ChartConfiguration['data']>
    pressure$: Observable<ChartConfiguration['data']>
    totalRainfall$: Observable<ChartConfiguration['data']>
    globalRadiation$: Observable<ChartConfiguration['data']>
    wind$: Observable<ChartConfiguration['data']>

    constructor(
        @Inject(MAT_DIALOG_DATA) public station: RainfallStation,
        private service: RainfallService
    ) { }

    ngOnInit() {
        this.setUpChartOptions()
        this.setUpObservables()
    }

    onDateChanged(date: Date) {
        this.selectedDate$.next(date)
    }

    private setUpChartOptions() {
        this.labels = [...Array(24)].map((_, index) =>
            index.toString().padStart(2, '0') + 'hs'
        )

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: { tension: 0.5 }
            },
            scales: {
                y: {
                    position: 'left',
                    grid: {
                        color: '#e6e6e6'
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            },
            plugins: {
                legend: { 
                    display: true,
                    labels: { usePointStyle: true } 
                }
            }
        }
    }

    private setUpObservables() {
        this.measurements$ = this.selectedDate$
            .pipe(
                untilDestroyed(this),
                switchMap(this.getMeasurements)
            )

        this.temperatures$ = this.measurements$
            .pipe(map(this.getTemperatures))

        this.humidity$ = this.measurements$
            .pipe(map(this.getHumidity))

        this.pressure$ = this.measurements$
            .pipe(map(this.getPressure))

        this.totalRainfall$ = this.measurements$
            .pipe(map(this.getTotalRainfall))

        this.globalRadiation$ = this.measurements$
            .pipe(map(this.getGlobalRadiation))

        this.wind$ = this.measurements$
            .pipe(map(this.getWind))

        this.isChartsVisible$ = this.measurements$
            .pipe(map(data => data.length > 0))
    }

    private getMeasurements = (date: Date): Observable<RainfallMeasurement[]> => {
        return this.service.getMeasurements(this.station._id, date)
    }

    private getTemperatures = (measurements: RainfallMeasurement[]): ChartConfiguration['data'] => {
        const temperatures = measurements.map(measurement => measurement.temperature)

        return {
            datasets: [
                {
                    data: temperatures.map(temp => temp.maximum),
                    label: 'Máxima'
                },
                {
                    data: temperatures.map(temp => temp.minimum),
                    label: 'Mínima'
                },
                {
                    data: temperatures.map(temp => temp.dry_bulb),
                    label: 'Temperatura do ar (bulbo seco)'
                },
                {
                    data: temperatures.map(temp => temp.dew_point),
                    label: 'Ponto de orvalho'
                },
                {
                    data: temperatures.map(temp => temp.dew_maximum),
                    label: 'Orvalho (máximo)'
                },
                {
                    data: temperatures.map(temp => temp.dew_minimum),
                    label: 'Orvalho (mínimo)'
                },
            ],
            labels: this.labels
        }
    }

    private getHumidity = (measurements: RainfallMeasurement[]): ChartConfiguration['data'] => {
        const humidities = measurements.map(measurement => measurement.humidity)

        return {
            datasets: [
                {
                    data: humidities.map(humidity => humidity.air),
                    label: 'Umidade relativa do ar'
                },
                {
                    data: humidities.map(humidity => humidity.maximum),
                    label: 'Umidade relativa máxima'
                },
                {
                    data: humidities.map(humidity => humidity.minimum),
                    label: 'Umidade relativa mínima'
                }
            ],
            labels: this.labels
        }
    }

    private getPressure = (measurements: RainfallMeasurement[]): ChartConfiguration['data'] => {
        const pressure = measurements.map(measurement => measurement.atmospheric_pressure)

        return {
            datasets: [
                {
                    data: pressure.map(pressure => pressure.at_station_level),
                    label: 'Nível da estação'
                },
                {
                    data: pressure.map(pressure => pressure.maximum),
                    label: 'Máxima'
                },
                {
                    data: pressure.map(humidity => humidity.minimum),
                    label: 'Mínima'
                }
            ],
            labels: this.labels
        }
    }

    private getTotalRainfall = (measurements: RainfallMeasurement[]): ChartConfiguration['data'] => {
        const totalRainfall = measurements.map(measurement => measurement.total_rainfall ?? 0)

        return {
            datasets: [
                {
                    data: totalRainfall,
                    label: 'Precipitação total'
                }
            ],
            labels: this.labels
        }
    }

    private getGlobalRadiation = (measurements: RainfallMeasurement[]): ChartConfiguration['data'] => {
        const globalRadiation = measurements.map(measurement => measurement.global_radiation ?? 0)

        return {
            datasets: [
                {
                    data: globalRadiation,
                    label: 'Radiação Global'
                }
            ],
            labels: this.labels
        }
    }

    private getWind = (measurements: RainfallMeasurement[]): ChartConfiguration['data'] => {
        const wind = measurements.map(measurement => measurement.wind)

        return {
            datasets: [
                {
                    data: wind.map(wind => wind.speed ?? 0),
                    label: 'Velocidade'
                },
                {
                    data: wind.map(wind => wind.gust_maximum),
                    label: 'Rajada máxima'
                }
            ],
            labels: this.labels
        }
    }
    
}
