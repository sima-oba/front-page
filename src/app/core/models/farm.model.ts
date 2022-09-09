export interface Farm {
    _id: string
    owner_id: string
    farm_code: string
    farm_name: string
    city: string
    state: string
    latitude: number
    longitude: number
    property_type: string
    area: number
    signature_date: Date
    nucleos?: string
    crops?: string[]
    open_areas?: number[]
    productive_areas?: number[]
    vegetation_types?: string[]
    industries?: string[]
    aerodrome_lat?: number[]
    aerodrome_lng?: number[]
}