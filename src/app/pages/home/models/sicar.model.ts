export type SicarSubject =
    'APP' |
    'AREA_CONSOLIDADA' |
    'RESERVA_LEGAL' |
    'VEGETACAO_NATIVA'

export interface Sicar {
    _id: string
    idf: number
    city_geoid: string
    city_name: string
    description: string
    subject: string
    area_number: number
}

export interface SicarFarm {
    _id: string
    farm_code: string
    city_geoid: string
    city_name: string
    state: string
    property_type: string
    status: string | null
    condition: string | null
}
