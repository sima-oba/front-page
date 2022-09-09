import { Answer } from "./answer.model"

export interface CorrectiveReport {
	is_density_adequate: Answer
	is_conditioning_adequate: Answer
	has_declared_elements: Answer
	is_contaminated: Answer
	has_logistical_problems: Answer
}