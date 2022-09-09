import { Evaluation } from "./evaluation.model";
import { PracticeBase } from "./practice.model";

export interface ControlledTrafficEval extends Evaluation {
    use_stc: boolean
    total_area_stc: boolean
    stc_usage_months: boolean
}

export interface ControlledTraffic extends PracticeBase {
    use_stc: boolean
    total_area_stc: number
    stc_usage_months: number
    evaluation?: ControlledTrafficEval
}
