import { CalculatorActivity } from "./calculator-activity.model";
import { CalculatorResult } from "./calculator-result.model";

export interface CalculatorBundle {
    _id: string
    created_at: string
    data_collect: CalculatorActivity
    result: CalculatorResult
}