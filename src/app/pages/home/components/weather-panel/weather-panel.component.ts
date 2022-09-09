import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { Forecast } from 'src/app/core/models/forecast.model';
import { ForecastService } from 'src/app/core/services/forecast.service';
import { DrawerService } from '../../services/drawer.service';

@Component({
    selector: 'app-weather-panel',
    templateUrl: './weather-panel.component.html',
    styleUrls: ['./weather-panel.component.scss']
})
export class WeatherPanelComponent {
    readonly currentWeekForecast$ = this.forecastService
        .currentWeekForecast$
        .pipe(map(forecast => this.mapWeather(forecast)))

    constructor(
        private drawerService: DrawerService,
        private forecastService: ForecastService
    ) { }

    close() {
        this.drawerService.closeDrawer()
    }

    private mapWeather(forecast: Forecast[]): Forecast[] {
        return forecast.map(item => {
            switch(item.summary) {
                case 'Tempestade':
                    item.weather = '1'
                    break

                case 'Chuvoso':
                case 'Nublado':
                    item.weather = '2'
                    break

                default:
                    item.weather = '3'
            }

            return item
        })
    }
}
