import { Point } from "geojson";

export interface RainfallStation {
    _id: string
    code: string
    city: string
    state: string
    altitude: number
    geometry: Point
    isSelected?: boolean
}