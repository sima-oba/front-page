import { Evaluation } from "./evaluation.model";
import { PracticeBase } from "./practice.model";

export interface SoilTemperatureEval extends Evaluation {
    temperature_measurement: boolean
}

export interface SoilTemperature extends PracticeBase {
    temperature_measurement: boolean
    evaluation?: SoilTemperatureEval
}