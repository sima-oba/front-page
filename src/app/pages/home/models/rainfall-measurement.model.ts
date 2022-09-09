export interface AtmosphericPressure {
    at_station_level: number
    maximum: number
    minimum: number
}

export interface Temperature {
    dry_bulb: number
    maximum: number
    minimum: number
    dew_point: number
    dew_maximum: number
    dew_minimum: number
}

export interface Humidity {
    air: number
    maximum: number
    minimum: number
}

export interface Wind {
    clockwise_direction: number
    speed: number | null
    gust_maximum: number
}

export interface RainfallMeasurement {
    station_id: string
    date_time: string
    total_rainfall: number | null
    atmospheric_pressure: AtmosphericPressure
    global_radiation: number | null
    temperature: Temperature
    humidity: Humidity
    wind: Wind
}
