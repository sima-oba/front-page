import { Answer } from "./answer.model"

export interface SustainableReport {
	are_satisfied_with_planting: Answer
	perform_agricultural_operations: Answer
	has_terraces: Answer
	has_erosion: Answer
	has_soil_disturbance: Answer
	is_soil_compactated: Answer
	has_earthworms: Answer
	are_earthworms_good_for_crops: Answer
	follow_technical_guidelines: Answer
	uses_manure: Answer
	planting_assessment: {
		0: number
		1: number
		2: number
		3: number
	}
}