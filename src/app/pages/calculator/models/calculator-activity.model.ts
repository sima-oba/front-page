import { CommonModel } from "src/app/configurations/commons/common-model"
import { Item } from "./item.model"

export type Biome = Item<number>

export type CultivationSystem = Item<number>

export type LandOccupation = Item<number>

export interface CalculatorActivity extends CommonModel {
    farm_id: string
    farm_name: string
    resp_name: string
    organization: string
    date: string
    cultivated_area: number
    coverage_use: number
    crop_year: string
    crop_year_second: boolean
    cultivated_area_second_crop: number
    biome_1: number
    biome_1_coverage: boolean
    biome_2: number
    biome_2_coverage: boolean
    biome_3: number
    biome_3_coverage: boolean
    average_productivity: number
    average_productivity_second_crop: number
    cultivation_system: number
    area_organic_soils: number
    synthetic_n_fertilizer_type1_kg: number
    synthetic_n_fertilizer_type2_kg: number
    synthetic_n_fertilizer_type3_kg: number
    synthetic_n_fertilizer_type1_kg_second_crop: number
    synthetic_n_fertilizer_type2_kg_second_crop: number
    synthetic_n_fertilizer_type3_kg_second_crop: number
    synthetic_n_fertilizer_teor_type1: number
    synthetic_n_fertilizer_teor_type2: number
    synthetic_n_fertilizer_teor_type3: number
    synthetic_n_fertilizer_teor_type1_second_crop: number
    synthetic_n_fertilizer_teor_type2_second_crop: number
    synthetic_n_fertilizer_teor_type3_second_crop: number
    urea_type1: number
    urea_type1_second_crop: number
    organic_n_fertilizer_type1_kg: number
    organic_n_fertilizer_type1_kg_second_crop: number
    green_adubation: number
    green_adubation_second_crop: number
    grassy_type1_kg: number
    grassy_type1_kg_second_crop: number
    others_type1_kg: number
    others_type1_kg_second_crop: number
    calcitic_limestone: number
    calcitic_limestone_second_crop: number
    dolomitic_limestone: number
    dolomitic_limestone_second_crop: number
    agricultural_plaster: number
    agricultural_plaster_second_crop: number
    waste_field_second_crop: number
    waste_field: number
    gasoline_mechanical_operation: number
    diesel_b10_mechanical_operation: number
    hydrous_ethanol_mechanical_operation: number
    gasoline_stationary_operation: number
    diesel_b10_stationary_operation: number
    hydrous_ethanol_stationary_operation: number
    transport_production_diesel_b10: number
    energy_consumption: number
    rl: number
    app: number
    forest_surplus: number
}
