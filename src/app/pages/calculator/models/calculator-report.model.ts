import { CalculatorBundle } from "./calculator-bundle.model"
export interface Measurements {
    limingAndPlastering: number
    nitrogenFertilization: number
    diesel: number
    electricPower: number
    cropRemains: number
    total: number
}

export class EmissionsPerHectareYear {
    farm: Measurements
    bahia: Measurements
    matopiba: Measurements

    constructor(private bundle: CalculatorBundle) {
        this.calcFarmEmissions()
        this.calcBahiaEmission()
        this.calcMatopibaEmissions()
    }

    private calcFarmEmissions() {
        const cultivated_area = this.bundle.data_collect.cultivated_area
        const {
            emission_liming_and_plastering,
            emission_waste_decomposition,
            emission_n_synthetic_fertilizer,
            emission_urea,
            emission_n_organic_fertilizer,
            emission_leaching,
            emission_volatilization,
            fuel_consumption,
            electricity_purchase
        } = this.bundle.result

        const limingAndPlastering = emission_liming_and_plastering / cultivated_area
        const diesel = fuel_consumption / cultivated_area
        const electricPower = electricity_purchase / cultivated_area
        const cropRemains = emission_waste_decomposition / cultivated_area
        const nitrogenFertilization = emission_n_synthetic_fertilizer / cultivated_area
            + emission_urea / cultivated_area
            + emission_n_organic_fertilizer / cultivated_area
            + emission_leaching / cultivated_area
            + emission_volatilization / cultivated_area

        const total = limingAndPlastering
            + nitrogenFertilization
            + diesel
            + electricPower
            + cropRemains

        this.farm = {
            limingAndPlastering,
            nitrogenFertilization,
            diesel,
            electricPower,
            cropRemains,
            total
        }
    }

    private calcBahiaEmission() {
        const limingAndPlastering = 0.652
        const nitrogenFertilization = 0.205
        const diesel = 0.143
        const electricPower = 0.007
        const cropRemains = 0.046
        const total = limingAndPlastering
            + nitrogenFertilization
            + diesel
            + electricPower
            + cropRemains

        this.bahia = {
            limingAndPlastering,
            nitrogenFertilization,
            diesel,
            electricPower,
            cropRemains,
            total
        }
    }

    private calcMatopibaEmissions() {
        const limingAndPlastering = 0.537
        const nitrogenFertilization = 0.208
        const diesel = 0.165
        const electricPower = 0.005
        const cropRemains = 0.054
        const total = limingAndPlastering
            + nitrogenFertilization
            + diesel
            + electricPower
            + cropRemains

        this.matopiba = {
            limingAndPlastering,
            nitrogenFertilization,
            diesel,
            electricPower,
            cropRemains,
            total
        }
    }

}

export class RemovalPerHectareYear {
    farm: number
    bahia = -1.445
    matopiba = -1.561

    constructor(bundle: CalculatorBundle) {
        this.farm = bundle.result.baseline_removal
            / bundle.data_collect.cultivated_area
    }

}
