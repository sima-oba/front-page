import { Component } from '@angular/core';

import { ForecastService } from 'src/app/core/services/forecast.service';

@Component({
    selector: 'weather-bar',
    templateUrl: './weather-bar.component.html',
    styleUrls: ['./weather-bar.component.scss']
})
export class WeatherBarComponent {
    readonly today = new Date()
    readonly cities$ = this.service.getCities()
    readonly selectedCity = this.service.cityId
    readonly currentForecast$ = this.service.currentForecast$

    constructor(private service: ForecastService) { }

    onCityChanged(cityId: string) {
        this.service.cityId = cityId
    }

    onDateChanged(date: Date) {
        this.service.date = date
    }
}
