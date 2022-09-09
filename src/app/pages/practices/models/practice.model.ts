import { Evaluation } from "./evaluation.model"

export type PracticeType =
    'CONTROLLED_TRAFFIC_SYSTEM' |
    'CORRECTIVE_QUALITY' |
    'CROP_ROTATION' |
    'IRRIGATION_USE_EFFICIENCY' |
    'PHYTOSANITARY' |
    'SOIL_RECHARGE_AND_MOISTURE' |
    'SOIL_TEMPERATURE' |
    'SUSTAINABLE' |
    'WATER_RUNOFF_CONTAINMENT'

export interface PracticeQuery {
    farmId?: string
    practiceType?: PracticeType
}

export interface PracticeBase {
    _id?: string
    created_at?: string
    updated_at?: string
    farm_id: string
    practice_type: PracticeType
    evaluation?: Evaluation
}
