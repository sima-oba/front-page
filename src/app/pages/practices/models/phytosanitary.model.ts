import { Evaluation } from "./evaluation.model"
import { PracticeBase } from "./practice.model"

export interface PhytosanitaryEval extends Evaluation {
    plague_management: boolean
    soybean_rust_management: boolean
    biotechnology_employed: boolean
    pesticides: boolean
    uses_agronomic_management: boolean
    uses_refuge: boolean
    uses_precision_systems: boolean
    uses_mip: boolean
    uses_mid: boolean
}

export interface Phytosanitary extends PracticeBase {
    plague_management: string[]
    soybean_rust_management: string[]
    biotechnology_employed: string[]
    pesticides: string[]
    uses_agronomic_management: boolean
    uses_refuge: boolean
    uses_precision_systems: boolean
    uses_mip: boolean
    uses_mid: boolean
    evaluation?: PhytosanitaryEval
}
