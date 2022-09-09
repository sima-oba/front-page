import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgxSmartModalService } from 'ngx-smart-modal';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { CalculatorSettingsService } from "../../services/calculator-settings.service";

@Component({
    selector: 'calculator-settings-form',
    templateUrl: './calculator-settings-form.component.html',
    styleUrls: ['./calculator-settings-form.component.scss']
})
export class CalculatorSettingsFormComponent implements OnInit {
    viewMode = "tab1";
    form: FormGroup

    constructor(
        protected activatedRouter: ActivatedRoute,
        private formBuilder: FormBuilder,
        public modalService: NgxSmartModalService,
        protected baseService: CalculatorSettingsService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            nitrous_oxide: [null, Validators.required],
            diesel_n2o_mobile_source: [null, Validators.required],
            methane: [null, Validators.required],
            synthetic_n_volatilization: [null, Validators.required],
            volatilization_n_residue: [null, Validators.required],
            urea_n_volatilization: [null, Validators.required],
            leaching: [null, Validators.required],
            soy_slope: [null, Validators.required],
            soy_intercept: [null, Validators.required],
            soy_nag: [null, Validators.required],
            soy_nbg: [null, Validators.required],
            soy_rbg_bio: [null, Validators.required],
            soy_frac_dm: [null, Validators.required],
            corn_slope_second_crop: [null, Validators.required],
            corn_intercept_second_crop: [null, Validators.required],
            corn_nag_second_crop: [null, Validators.required],
            corn_nbg_second_crop: [null, Validators.required],
            corn_rbg_bio_second_crop: [null, Validators.required],
            corn_frac_dm_second_crop: [null, Validators.required],
            diesel_b10: [null, Validators.required],
            regular_gasoline: [null, Validators.required],
            synthetic_fertilization: [null, Validators.required],
            urea_co2: [null, Validators.required],
            urea_n2o: [null, Validators.required],
            organic_n_fertilizer: [null, Validators.required],
            green_fertilizer_1: [null, Validators.required],
            green_fertilizer_2: [null, Validators.required],
            green_fertilizer_3: [null, Validators.required],
            nitrogen_fertilization_green_fertilizer: [null, Validators.required],
            atmospheric_deposition: [null, Validators.required],
            leaching_n_fertilizer: [null, Validators.required],
            calcitic_limestone: [null, Validators.required],
            dolomitic_limestone: [null, Validators.required],
            agricultural_plaster: [null, Validators.required],
            diesel_c02_mobile_source: [null, Validators.required],
            diesel_ch4_mobile_source: [null, Validators.required],
            diesel_c02_stationary_source: [null, Validators.required],
            diesel_ch4_stationary_source: [null, Validators.required],
            diesel_n20_stationary_source: [null, Validators.required],
            organic_soils_cultivation: [null, Validators.required],
            nitrogen_loss: [null, Validators.required],
            purchase_of_electricity_2019: [null, Validators.required],
            purchase_of_electricity_2020: [null, Validators.required],
            consumption_gasoline: [null, Validators.required],
            consumption_biodiesel_co2_mobile_source: [null, Validators.required],
            consumption_biodiesel_ch4_mobile_source: [null, Validators.required],
            consumption_biodiesel_n20_mobile_source: [null, Validators.required],
            consumption_ethanol_co2_stationary_source: [null, Validators.required],
            consumption_ethanol_ch4_stationary_source: [null, Validators.required],
            consumption_ethanol_n20_stationary_source: [null, Validators.required],
            no_tillage_system_coverage: [null, Validators.required],
            no_tillage_system: [null, Validators.required],
            conventional_planting_system: [null, Validators.required],
            preserved_native_forest_soil_1: [null, Validators.required],
            preserved_native_forest_soil_2: [null, Validators.required],
            preserved_native_forest_soil_3: [null, Validators.required],
            preserved_native_forest_soil_4: [null, Validators.required],
            preserved_native_forest_soil_5: [null, Validators.required],
            preserved_native_forest_soil_6: [null, Validators.required],
            preserved_native_forest_soil_7: [null, Validators.required],
            preserved_native_forest_soil_8: [null, Validators.required],
            preserved_native_forest_soil_9: [null, Validators.required],
            preserved_native_forest_soil_10: [null, Validators.required],
            preserved_native_forest_soil_11: [null, Validators.required],
            preserved_native_forest_soil_12: [null, Validators.required],
            preserved_native_forest_soil_13: [null, Validators.required],
            preserved_native_forest_soil_14: [null, Validators.required],
            preserved_native_forest_soil_15: [null, Validators.required],
            preserved_native_forest_soil_16: [null, Validators.required],
            preserved_native_forest_soil_17: [null, Validators.required],
            preserved_native_forest_soil_18: [null, Validators.required],
            preserved_native_forest_soil_19: [null, Validators.required],
            preserved_native_forest_soil_20: [null, Validators.required],
            preserved_native_forest_soil_21: [null, Validators.required],
            preserved_native_forest_soil_22: [null, Validators.required],
            preserved_native_forest_soil_23: [null, Validators.required],
            preserved_native_forest_soil_24: [null, Validators.required],
            preserved_native_forest_soil_25: [null, Validators.required],
            preserved_native_forest_soil_26: [null, Validators.required],
            preserved_native_forest_soil_27: [null, Validators.required],
            preserved_native_forest_soil_28: [null, Validators.required],
            preserved_native_forest_soil_29: [null, Validators.required],
            preserved_native_forest_soil_30: [null, Validators.required],
            preserved_native_forest_soil_31: [null, Validators.required],
            land_occupation_1: [null, Validators.required],
            land_occupation_2: [null, Validators.required],
            land_occupation_3: [null, Validators.required],
            land_occupation_4: [null, Validators.required],
            land_occupation_5: [null, Validators.required],
            land_occupation_6: [null, Validators.required],
            land_occupation_7: [null, Validators.required],
            land_occupation_8: [null, Validators.required],
            land_occupation_9: [null, Validators.required],
            land_occupation_10: [null, Validators.required],
            land_occupation_11: [null, Validators.required],
            land_occupation_12: [null, Validators.required],
            land_occupation_13: [null, Validators.required],
            land_occupation_14: [null, Validators.required],
            land_occupation_15: [null, Validators.required],
            land_occupation_16: [null, Validators.required],
            land_occupation_17: [null, Validators.required],
        });

        this.loadSettings()
    }

    submit() {
        if (this.form.invalid) return

        const settings = this.form.value
        this.baseService.saveSettings(settings)
            .pipe(first())
            .subscribe({
                next: () => Swal.fire('As Configurações foram atualizadas'),
                error: error => Swal.fire('Ocorreu um erro ao salvar as configurações')
            })
    }

    private loadSettings() {
        this.baseService.getSettings()
            .pipe(first())
            .subscribe(settings => this.form.patchValue(settings))
    }
}
