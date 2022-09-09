import { Evaluation } from "./evaluation.model";
import { PracticeBase } from "./practice.model";

export interface ContainmentMicrodamsEval extends Evaluation {
    has_micro_dams: boolean
    micro_dams_quality: boolean
    has_level_curves: boolean
    level_curves_convergent_with_neighbors: boolean
    level_curves_quality: number
}

export interface ContainmentMicrodams extends PracticeBase {
    has_micro_dams: boolean
    micro_dams_quality: number
    has_level_curves: boolean
    level_curves_convergent_with_neighbors: boolean
    level_curves_quality: number
    evaluation?: ContainmentMicrodamsEval
}
