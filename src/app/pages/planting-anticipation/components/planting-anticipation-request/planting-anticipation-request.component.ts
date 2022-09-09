import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, first, switchMap, tap } from 'rxjs/operators';

import { CityIBGE } from 'src/app/core/models/city.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LocationService } from 'src/app/core/services/location.service';
import { PlantingAnticipationService } from '../../services/planting-anticipation.service';

@UntilDestroy()
@Component({
    selector: 'app-planting-anticipation-request',
    templateUrl: './planting-anticipation-request.component.html',
    styleUrls: ['./planting-anticipation-request.component.scss']
})
export class PlantingAnticipationRequestComponent {
    readonly MAX_FILE_SIZE = 2097152 /* 2MB */
    readonly PERSONAL_INFO_STEP = 0
    readonly FARM_STEP = 1
    readonly ATTACHMENTS_STEP = 2

    personalInfoForm: FormGroup
    farmForm: FormGroup
    attachmentsForm: FormGroup

    states$ = this.locationService.getStateCodes()
    cities: CityIBGE[] = []

    @ViewChild('stepper')
    stepper: MatHorizontalStepper

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private loading: LoadingService,
        private locationService: LocationService,
        private plantingService: PlantingAnticipationService
    ) {
        this.setUpPersonalInfoForm()
        this.setUpFarmForm()
        this.setUpAttachmentsForm()
    }

    get step(): number {
        return this.stepper?.selectedIndex ?? 0
    }

    getError(form: FormGroup, controlName: string): any {
        const control = form.get(controlName)
        return control?.touched && control?.errors ? control.errors : {}
    }

    previous() {
        this.stepper.previous()
    }

    next() {
        // Improve this logic
        switch (this.stepper.selectedIndex) {
            case this.PERSONAL_INFO_STEP:
                this.personalInfoForm.markAllAsTouched()
                break

            case this.FARM_STEP:
                this.farmForm.markAllAsTouched()
                break

            case this.ATTACHMENTS_STEP:
                this.attachmentsForm.markAllAsTouched()
                this.submit()
        }

        this.stepper.next()
    }

    private setUpPersonalInfoForm() {
        this.personalInfoForm = this.formBuilder.group({
            owner_name: [null, Validators.required],
            cpf_cnpj: [null, Validators.required],
            address: [null, Validators.required],
            cep: [null, Validators.required],
            nucleos: [null, Validators.required],
            state: ['', Validators.required],
            city: [{ value: '', disabled: true }, Validators.required],
            phone: [null, Validators.required],
            cellphone: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]]
        })

        this.personalInfoForm.get('state').valueChanges
            .pipe(
                untilDestroyed(this),
                tap(() => this.resetCityControl()),
                switchMap(state => this.locationService.getCitiesByState(state))
            )
            .subscribe(cities => this.cities = cities)
    }

    private setUpFarmForm() {
        this.farmForm = this.formBuilder.group({
            farm_name: [null, Validators.required],
            latitude: [null,
                [
                    Validators.required,
                    Validators.min(-90),
                    Validators.max(90)
                ]
            ],
            longitude: [null,
                [
                    Validators.required,
                    Validators.min(-180),
                    Validators.max(180)
                ]
            ]
        })

        this.locationService.currentLocation$
            .pipe(first())
            .subscribe(location => {
                const { latitude, longitude } = location.coords
                this.fillCoordinatesControl(latitude, longitude)
            })
    }

    fillCoordinatesControl(lat: number, lng: number, overwrite = false) {
        const latControl = this.farmForm.get('latitude')
        const lngControl = this.farmForm.get('longitude')
        const latText = lat.toFixed(6)
        const lngText = lng.toFixed(6)

        if (overwrite) {
            latControl.setValue(latText)
            lngControl.setValue(lngText)
        } else {
            if (latControl.value === null) {
                latControl.setValue(latText)
            }

            if (lngControl.value === null) {
                lngControl.setValue(lngText)
            }
        }
    }

    private setUpAttachmentsForm() {
        this.attachmentsForm = this.formBuilder.group({
            sketch: [null, this.pdfValidator()],
            rg_cnpj: [null, this.pdfValidator()],
            art: [null, this.pdfValidator()],
            attorney_letter: [null, this.pdfValidator(false)],
            commitment: [null, this.pdfValidator()],
            soy_planting: [null, this.pdfValidator()],
            work_plan: [null, this.pdfValidator()]
        })
    }

    private resetCityControl() {
        const control = this.personalInfoForm.get('city')
        control.setValue('')
        control.enable()
        this.cities = []
    }

    private pdfValidator(required = true): ValidatorFn[] {
        const validators = [
            MaxSizeValidator(this.MAX_FILE_SIZE),
            AcceptValidator('application/pdf')
        ]

        if (required) {
            validators.push(Validators.required)
        }

        return validators
    }

    private submit() {
        const isInvalid = this.personalInfoForm.invalid
            || this.farmForm.invalid
            || this.attachmentsForm.invalid

        if (isInvalid) { return }

        const data = {
            ...this.personalInfoForm.value,
            ...this.farmForm.value,
            ...this.attachmentsForm.value
        }

        this.loading.on()
        this.plantingService.requestPlantingAnticipation(data)
            .pipe(
                first(),
                finalize(() => this.loading.off())
            )
            .subscribe(() => this.navigateUp())
    }

    private navigateUp() {
        this.router.navigate(['../list'], { relativeTo: this.route })
    }
}
