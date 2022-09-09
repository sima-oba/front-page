import { Answer } from "./answer.model"

export interface IrrigationUseEfficiencyReport {
	has_irrigated_agriculturearea: Answer
	has_flow_meter: Answer
	meter_transmits_telemetric_data: Answer
	use_of_irrigation_systems: Answer
}