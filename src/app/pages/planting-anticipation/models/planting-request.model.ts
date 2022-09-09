export interface PlantingRequest {
    owner_name: string
    cpf_cnpj: string
    address: string
    cep: string
    nucleos: string
    state: string
    city: string
    phone: string
    cellphone: string
    email: string
    farm_name: string
    latitude: number
    longitude: number
    
    // Attachments
    sketch: File
    rg_cnpj: File
    art: File
    attorney_letter: File
    commitment: File
    soy_planting: File
    work_plan: File
}