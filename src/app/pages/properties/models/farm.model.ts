export interface Farm {
    _id?: string
    name: string
    nucleos?: string
    crops?: string[]
    open_areas?: number
    productive_areas?: number
    total_area?: number
    vegetation_types?: string[]
    industries?: string[]
    aerodrome_lat?: number
    aerodrome_lng?: number
}
