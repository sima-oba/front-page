import { Evaluation } from "./evaluation.model"
import { PracticeBase } from "./practice.model"

export interface SustainableEval extends Evaluation {
    are_satisfied_with_planting: boolean
    planting_assessment: boolean
    planting_difficulties?: boolean
    planting_years: boolean
    planting_importance?: boolean
    perform_agricultural_operations: boolean
    has_terraces: boolean
    has_erosion: boolean
    has_soil_disturbance: boolean
    is_soil_compactated: boolean
    soil_preparation_frequency?: boolean
    bare_soil_months: boolean
    summer_crops?: boolean
    winter_crops?: boolean
    animals_on_plating_area?: boolean
    has_earthworms: boolean
    are_earthworms_different?: boolean
    are_earthworms_good_for_crops?: boolean
    earthworms_consequence_for_crops?: boolean
    fertilizing_type: boolean
    follow_technical_guidelines: boolean
    uses_manure: boolean
    manure_per_year: boolean
    no_soil_preparation_start: boolean
    no_soil_preparation_end: boolean
    soil_management_start: boolean
    soil_management_end: boolean
    dry_material_accumulation_start: boolean
    dry_material_accumulation_end: boolean
    dry_material_accumulation_tons: boolean
}

export interface Sustainable extends PracticeBase {
    are_satisfied_with_planting: boolean
    planting_assessment: number
    planting_difficulties?: string
    planting_years: number
    planting_importance?: string
    perform_agricultural_operations: boolean
    has_terraces: boolean
    has_erosion: boolean
    has_soil_disturbance: boolean
    is_soil_compactated: boolean
    soil_preparation_frequency?: string
    bare_soil_months: number
    summer_crops?: string[]
    winter_crops?: string[]
    animals_on_plating_area?: string
    has_earthworms: boolean
    are_earthworms_different?: number
    are_earthworms_good_for_crops?: boolean
    earthworms_consequence_for_crops?: string
    fertilizing_type: string
    follow_technical_guidelines: boolean
    uses_manure: boolean
    manure_per_year: number
    no_soil_preparation_start: Date
    no_soil_preparation_end: Date
    soil_management_start: Date
    soil_management_end: Date
    dry_material_accumulation_start: Date
    dry_material_accumulation_end: Date
    dry_material_accumulation_tons: number
    evaluation?: SustainableEval
}
