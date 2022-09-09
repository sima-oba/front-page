
export interface Ordinance {
    _id: string
    ordinance_type: string
    title: string
    ordinance_number: string
    process: string
    publish_date: string
    owner_doc: string
    owner_name: string
    issuer: string
    issuer_name: string
    term: string
    link: string
    details: Details;
}

export interface Details {
    lat: number
    lon: number
}
