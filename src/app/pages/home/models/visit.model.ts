import { Point } from "geojson";

export interface Visit {
    _id: string
    name: string
    address: string
    city: string
    classification: string
    nucleos: string
    owner: string
    cultivation_system: string
    irrigation_system: string
    dryland_area: string
    irrigated_area: string
    geometry: Point
}

export interface VisitDetails {
    _id: string
    crop_type: string
    visit_date: string
    seeding_date: string
    harvest_date: string
    plagues: string[]
    notes?: string
}
