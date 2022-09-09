import { Evaluation } from "./evaluation.model";
import { PracticeBase } from "./practice.model";

export interface CropRotationEval extends Evaluation {
    practice_crop_rotation: boolean
    crops: boolean
}

export interface CropRotation extends PracticeBase {
    practice_crop_rotation: boolean
    crops: string[]
    evaluation?: CropRotationEval
}
