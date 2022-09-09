import { Evaluation } from "./evaluation.model";
import { PracticeBase } from "./practice.model";

export interface EfficiencyBalanceEval extends Evaluation {
    has_irrigated_agriculturearea: boolean
    has_flow_meter: boolean
    meter_transmits_telemetric_data: boolean
    use_of_irrigation_systems: boolean
    total_area_of_irrigation_systems: boolean
}

export interface EfficiencyBalance extends PracticeBase {
    has_irrigated_agriculturearea: boolean
    has_flow_meter: string
    meter_transmits_telemetric_data: string
    use_of_irrigation_systems: boolean
    total_area_of_irrigation_systems: number
    evaluation?: EfficiencyBalanceEval
}
