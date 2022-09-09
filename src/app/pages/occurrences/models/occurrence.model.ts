import { Point } from "geojson";

export interface Occurrence {
    _id: string
    occurrence_type: string
    occurrence_date: string
    occurrence_photo_href: string
    resolved_date?: string
    resolved_photo_href?: string
    area: number
    location: string
    position: Point
    notes: string
}
