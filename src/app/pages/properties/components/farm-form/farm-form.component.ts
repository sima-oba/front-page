import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, first, map, switchMap, take, tap } from 'rxjs/operators';
import { Farm } from 'src/app/core/models/farm.model';

import { LoadingService } from 'src/app/core/services/loading.service';
import { filterNotNull } from 'src/app/core/utils/rxjs';
import { ProducerService } from '../../services/producer.service';


@Component({
    selector: 'app-farm-form',
    templateUrl: './farm-form.component.html',
    styleUrls: ['./farm-form.component.scss']
})
export class FarmFormComponent {
    form: FormGroup
    showSuccess = false
    private farm: Farm

    allCrops$ = this.service.fetchCrops()
    selectedCrops: string[] = []

    allVegetationTypes = []
    selectedVegetationTypes: string[] = []

    allIndustries = []
    selectedIndustries: string[] = []

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private loading: LoadingService,
        private service: ProducerService
    ) {
        this.setUpForm()
        this.setUpSubscriber()
    }

    getError(controlName: string): ValidationErrors {
        const control = this.form.get(controlName)
        return control.touched ? control.errors : {}
    }

    submit() {
        if (this.form.invalid) { return }

        this.farm.crops = this.selectedCrops
        this.farm.vegetation_types = this.selectedVegetationTypes
        this.farm.industries = this.selectedIndustries
        Object.assign(this.farm, this.form.value)

        this.loading.on()
        this.service.updateFarm(this.farm)
            .pipe(
                first(),
                finalize(() => this.loading.off())
            )
            .subscribe(() => this.showSuccess = true)
    }

    private setUpForm() {
        this.form = this.formBuilder.group({
            farm_name: { value: null, disabled: true },
            nucleos: [null],
            open_areas: [null],
            productive_areas: [null, Validators.min(0)],
            area: { value: null, disabled: true },
            aerodrome_lat: [null],
            aerodrome_lng: [null]
        })
    }

    private setUpSubscriber() {
        this.route.params
            .pipe(
                take(1),
                map(params => params.id),
                filterNotNull(),
                tap(() => this.loading.on()),
                switchMap(id => this.service.fetchFarmById(id)),
                finalize(() => this.loading.off())
            )
            .subscribe(farm => this.loadFarm(farm))
    }

    private loadFarm(farm: Farm) {
        this.farm = farm
        this.selectedCrops = farm.crops ?? []
        this.selectedVegetationTypes = farm.vegetation_types ?? []
        this.selectedIndustries = farm.industries ?? []

        this.form.patchValue({
            farm_name: farm.farm_name,
            nucleos: farm.nucleos,
            open_areas: farm.open_areas,
            productive_areas: farm.productive_areas,
            area: farm.area,
            aerodrome_lat: farm.aerodrome_lat,
            aerodrome_lng: farm.aerodrome_lng
        })
    }
}
