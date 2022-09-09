import { Answer } from "./answer.model"

export interface ContainmentMicrodamsReport {
	has_micro_dams: Answer
	has_level_curves: Answer
	level_curves_convergent_with_neighbors: Answer
	micro_dams_quality: {
		0: number
		1: number
		2: number
		3: number
	},
	level_curves_quality: {
		0: number
		1: number
		2: number
		3: number
	}
}