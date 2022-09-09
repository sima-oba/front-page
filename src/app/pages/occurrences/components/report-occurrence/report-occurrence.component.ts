import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { LoadingService } from 'src/app/core/services/loading.service';
import { OccurrenceService } from '../../services/occurrence.service';
import { LocationService } from 'src/app/core/services/location.service';

@Component({
    selector: 'report',
    templateUrl: './report-occurrence.component.html',
    styleUrls: ['./report-occurrence.component.css']
})
export class ReportOccurrenceComponent implements OnInit {
    form: FormGroup

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private loading: LoadingService,
        private locationService: LocationService,
        private occurrenceService: OccurrenceService
    ) { }

    ngOnInit(): void {
        this.setUpForm()
        this.setUpGeoLocation()
    }

    private setUpForm() {
        this.form = this.formBuilder.group({
            occurrence_date: [null, Validators.required],
            occurrence_type: ['', Validators.required],
            area: [null, [
                Validators.required,
                Validators.min(0)
            ]],
            location: [null, [
                Validators.required,
                Validators.minLength(2)
            ]],
            latitude: [null, [
                Validators.required,
                Validators.min(-90),
                Validators.max(90)
            ]],
            longitude: [null, [
                Validators.required,
                Validators.min(-180),
                Validators.max(180)
            ]],
            photo: [null, [
                Validators.required,
                MaxSizeValidator(2097152 /* 2MB */),
                AcceptValidator('image/jpeg')
            ]]
        })
    }

    private setUpGeoLocation() {
        this.locationService.currentLocation$
            .pipe(first())
            .subscribe(location => {
                const latControl = this.form.get('latitude')
                const lngControl = this.form.get('longitude')

                if (latControl.value === null) {
                    latControl.setValue(location.coords.latitude)
                }

                if (lngControl.value === null) {
                    lngControl.setValue(location.coords.longitude)
                }
            })
    }

    getError(controlName: string): ValidationErrors {
        const control = this.form.get(controlName)
        return control.touched ? control.errors : {}
    }

    submit() {
        this.form.markAllAsTouched()

        if (this.form.invalid) { return }

        const fallowing = { ...this.form.value }
        fallowing.occurrence_date = (fallowing.occurrence_date as Date).toISOString()

        this.loading.on()
        this.occurrenceService.reportOccurrence(fallowing)
            .pipe(
                first(),
                finalize(() => this.loading.off())
            )
            .subscribe({
                next: () => this.navigateUp(),
                error: err => console.log(err)
            })
    }

    private navigateUp() {
        const state = { menu: 'occurrences' }
        this.router.navigate(['/home'], { state })
    }
}
