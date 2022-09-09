export interface Forecast {
    date_time: string
    max_humidity: number;
    max_temp: number;
    max_temp_trend: string;
    min_humidity: number;
    min_temp: number;
    min_temp_trend: string;
    season: string;
    source: string;
    summary: string;
    sunrise: Date;
    sunset: Date;
    weather: string;
    wind_direction: string;
    wind_speed: string;
}
