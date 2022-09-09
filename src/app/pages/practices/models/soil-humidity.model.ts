import { Evaluation } from "./evaluation.model";
import { PracticeBase } from "./practice.model";

export interface SoilHumidityEval extends Evaluation {
    soil_moisture_management: boolean
    has_agricultural_practices_relationship: boolean
}

export interface SoilHumidity extends PracticeBase {
    soil_moisture_management: boolean
    has_agricultural_practices_relationship: boolean
    evaluation?: SoilHumidityEval
}
