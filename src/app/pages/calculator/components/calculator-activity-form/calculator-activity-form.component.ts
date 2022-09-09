import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatDrawerContent } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxSmartModalService } from 'ngx-smart-modal';
import Swal from 'sweetalert2';

import { ProducerService } from 'src/app/core/services/producer.service';
import { CommonForm } from "../../../../configurations/commons/common-form";
import { CalculatorActivity } from "../../models/calculator-activity.model";
import { ActivityService } from "../../services/calculator-activity.service";

@UntilDestroy()
@Component({
    selector: 'app-activity-form',
    templateUrl: './calculator-activity-form.component.html',
    styleUrls: ['./calculator-activity-form.component.scss']
})
export class ActivityFormComponent extends CommonForm<CalculatorActivity> implements OnInit {
    biomes$ = this.activityService.biomes$
    cultivationSystems$ = this.activityService.cultivationSystems$
    landOccupation$ = this.activityService.landOccupation$

    @ViewChild('container')
    container: ElementRef

    @ViewChild('drawerContent')
    drawerContent: MatDrawerContent

    private _viewMode = 0;
    showSecondHarvest = false
    farms$ = this.farmService.getAllFarms()

    constructor(
        protected activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        public modalService: NgxSmartModalService,
        public router: Router,
        protected activityService: ActivityService,
        private farmService: ProducerService
    ) {
        super(activatedRoute, activityService);
    }

    get viewMode(): number {
        return this._viewMode
    }

    set viewMode(value: number) {
        this._viewMode = value
        this.scrollToTop()
    }

    next() {
        if (this._viewMode < 9) {
            this._viewMode++
            this.scrollToTop()
        }
    }

    previous() {
        if (this._viewMode > 0) {
            this._viewMode--
            this.scrollToTop()
        }
    }

    private scrollToTop() {
        document.querySelector('main').scrollTo(0, 0)
    }

    ngOnInit() {
        this.builderForm();
    }

    builderForm() {
        this.formDefault = this.formBuilder.group({
            general_info: this.formBuilder.group({
                farm_id: ['', Validators.required],
                resp_name: [null, [Validators.required, Validators.minLength(4)]],
                organization: [null, [Validators.required, Validators.minLength(2)]],
                date: [null, Validators.required]
            }),
            farm_info: this.formBuilder.group({
                cultivated_area: [null, [Validators.required, Validators.min(5)]],
                coverage_use: [0, [Validators.required, Validators.min(0)]],
                crop_year: ['', Validators.required],
                crop_year_second: [false, Validators.required],
                cultivated_area_second_crop: [0, [Validators.required, Validators.min(0)]],
                culture_type_second_crop: [null],
                biome_1: ['', Validators.required],
                biome_1_coverage: [false],
                biome_2: [0],
                biome_2_coverage: [false],
                biome_3: [0],
                biome_3_coverage: [false]
            }),
            cultivation_system: this.formBuilder.group({
                cultivation_system: ['', Validators.required],
                planting_date: [null],
                harvest_date: [null],
                average_productivity: [0, [Validators.required, Validators.min(0)]],
                planting_date_second_crop: [null],
                harvest_date_second_crop: [null],
                average_productivity_second_crop: [0, [Validators.required, Validators.min(0)]],
                average_production_second_crop: [0, [Validators.required, Validators.min(0)]]
            }),
            soil_characteristics: this.formBuilder.group({
                texture_class: [null, Validators.required],
                clay_content: [null, Validators.required],
                adoption_years: [0, [Validators.required, Validators.min(0)]],
                area_organic_soils: [0, [Validators.required, Validators.min(0)]],
                land_usage: ['None']
            }),
            nitrogen_fertilization: this.formBuilder.group({
                synthetic_n_fertilizer_type1_kg: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_type2_kg: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_type3_kg: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_teor_type1: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_teor_type2: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_teor_type3: [0, [Validators.required, Validators.min(0)]],
                urea_type1: [0, [Validators.required, Validators.min(0)]],
                organic_n_fertilizer_type1_kg: [0, [Validators.required, Validators.min(0)]],
                green_adubation: [0, [Validators.required, Validators.min(0)]],
                grassy_type1_kg: [0, [Validators.required, Validators.min(0)]],
                others_type1_kg: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_type1_kg_second_crop: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_type2_kg_second_crop: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_type3_kg_second_crop: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_teor_type1_second_crop: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_teor_type2_second_crop: [0, [Validators.required, Validators.min(0)]],
                synthetic_n_fertilizer_teor_type3_second_crop: [0, [Validators.required, Validators.min(0)]],
                urea_type1_second_crop: [0, [Validators.required, Validators.min(0)]],
                organic_n_fertilizer_type1_kg_second_crop: [0, [Validators.required, Validators.min(0)]],
                green_adubation_second_crop: [0, [Validators.required, Validators.min(0)]],
                grassy_type1_kg_second_crop: [0, [Validators.required, Validators.min(0)]],
                others_type1_kg_second_crop: [0, [Validators.required, Validators.min(0)]]
            }),
            correction: this.formBuilder.group({
                calcitic_limestone: [0, [Validators.required, Validators.min(0)]],
                dolomitic_limestone: [0, [Validators.required, Validators.min(0)]],
                agricultural_plaster: [0, [Validators.required, Validators.min(0)]],
                calcitic_limestone_second_crop: [0, [Validators.required, Validators.min(0)]],
                dolomitic_limestone_second_crop: [0, [Validators.required, Validators.min(0)]],
                agricultural_plaster_second_crop: [0, [Validators.required, Validators.min(0)]],
            }),
            decomposition: this.formBuilder.group({
                waste_field: [0, [Validators.required, Validators.min(0)]],
                productivity_second_crop: [0, [Validators.required, Validators.min(0)]],
                cultivated_area_second_crop: [0, [Validators.required, Validators.min(0)]],
                waste_field_second_crop: [0, [Validators.required, Validators.min(0)]]
            }),
            fuel_consumption: this.formBuilder.group({
                gasoline_mechanical_operation: [0, [Validators.required, Validators.min(0)]],
                diesel_b10_mechanical_operation: [0, [Validators.required, Validators.min(0)]],
                hydrous_ethanol_mechanical_operation: [0, [Validators.required, Validators.min(0)]],
                gasoline_stationary_operation: [0, [Validators.required, Validators.min(0)]],
                diesel_b10_stationary_operation: [0, [Validators.required, Validators.min(0)]],
                hydrous_ethanol_stationary_operation: [0, [Validators.required, Validators.min(0)]],
                transport_production_diesel_b10: [0],
            }),
            energy_consumption: [0, [Validators.required, Validators.min(0)]],
            stock: this.formBuilder.group({
                rl: [0, [Validators.required, Validators.min(0)]],
                app: [0, [Validators.required, Validators.min(0)]],
                forest_surplus: [0, [Validators.required, Validators.min(0)]]
            })
        });

        this.formDefault.get('farm_info.biome_1')
            .valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(value => {
                const control = this.formDefault.get('farm_info.biome_1_coverage')
                control.setValue(value !== 0)
                console.log(this.formDefault.value)
            })

        this.formDefault.get('farm_info.biome_2')
            .valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(value => {
                const control = this.formDefault.get('farm_info.biome_2_coverage')
                control.setValue(value !== 0)
            })

        this.formDefault.get('farm_info.biome_3')
            .valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(value => {
                const control = this.formDefault.get('farm_info.biome_3_coverage')
                control.setValue(value !== 0)
            })

        this.formDefault.get('farm_info.crop_year_second')
            .valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(value => this.showSecondHarvest = value)
    }

    getError(controlName: string): ValidationErrors {
        const control = this.formDefault.get(controlName)
        return control.touched ? control.errors : {}
    }

    groupHasErrors(groupName: string): boolean {
        const group = this.formDefault.get(groupName) as FormGroup

        for (let childName of Object.keys(group.controls)) {
            const controlName = `${groupName}.${childName}`

            if (this.controlHasErrors(controlName)) {
                return true
            }
        }

        return false
    }

    controlHasErrors(controlName: string): boolean {
        const control = this.formDefault.get(controlName)

        if (control.untouched || control.errors === null) {
            return false
        }

        return Object.keys(control.errors).length > 0
    }

    async onSubmitFormDefault(event: any) {
        if (this.formDefault.invalid) {
            this.formDefault.markAllAsTouched()

            Swal.fire({
                title: 'Erro de preenchimento!',
                text: `
                Alguns campos estão inválidos e requerem sua atenção.
                Por favor, verifique todos os erros e tente novamente.
                `,
                confirmButtonColor: '#458985'
            })
        }

        const result = await super.onSubmitFormDefault(event)

        if (result) {
            this.router.navigate(['../result', result._id], { relativeTo: this.activatedRoute })
        }
    }
}
