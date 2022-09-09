import { Evaluation } from "./evaluation.model"
import { PracticeBase } from "./practice.model"

export interface CorrectiveEval extends Evaluation {
    product: boolean
    is_density_adequate: boolean
    is_conditioning_adequate: boolean
    has_declared_elements: boolean
    is_contaminated: boolean
    has_logistical_problems: boolean
}

export interface Corrective extends PracticeBase {
    product: string
    is_density_adequate: boolean
    is_conditioning_adequate: boolean
    has_declared_elements: boolean
    is_contaminated: boolean
    has_logistical_problems: boolean
    evaluation?: CorrectiveEval
}