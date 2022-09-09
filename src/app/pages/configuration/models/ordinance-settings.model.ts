import { CommonModel } from "src/app/configurations/commons/common-model";

export interface OrdinanceSettings extends CommonModel {
    alert_message: string
    alert_days_before: number
    template_id: string
    subject: string
}