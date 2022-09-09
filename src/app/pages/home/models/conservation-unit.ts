export interface ConservationQuery {
    sphere: string
    category: string
}

export interface ConservationUnit {
    _id: string
    name: string
    category: string
    group: string
    sphere: string
    creation_year: string
    quality: string
    legal_act: string
    original_name: string
}