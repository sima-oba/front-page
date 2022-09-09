import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Job } from '../../models/job.model';

type Period = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

type Bundle = {
    job: Job,
    params: string[]
}

@Component({
    selector: 'app-job-config-dialog',
    templateUrl: './job-config-dialog.component.html',
    styleUrls: ['./job-config-dialog.component.scss']
})
export class JobConfigDialog implements OnInit {
    job: Job;
    params: string[]
    form: FormGroup
    selectedPeriod: Period

    constructor(
        @Inject(MAT_DIALOG_DATA) public bundle: Bundle,
        private dialog: MatDialogRef<Bundle, Job>,
        private formBuilder: FormBuilder
    ) {
        this.job = bundle.job
        this.params = bundle.params
    }

    ngOnInit() {
        if (this.bundle == null) {
            throw new Error('Missing job argument')
        }

        this.setUpPeriodType()
        this.setUpForm()
    }

    private setUpPeriodType() {
        if (this.job.month != null) {
            this.selectedPeriod = 'YEARLY'
        } else if (this.job.day != null) {
            this.selectedPeriod = 'MONTHLY'
        } else if (this.job.day_of_week != null) {
            this.selectedPeriod = 'WEEKLY'
        } else if (this.job.hour !== null) {
            this.selectedPeriod = 'DAILY'
        } else {
            throw new Error(`Unable to infer period type`)
        }
    }

    private setUpForm() {
        const argControls = this.job.args.map(arg =>
            this.formBuilder.control(arg, Validators.required)
        )

        this.form = this.formBuilder.group({
            id: [this.job.id],
            name: [this.job.name, Validators.required],
            args: this.formBuilder.array(argControls)
        })

        switch (this.selectedPeriod) {
            case 'YEARLY':
                this.setUpYearly()
                break;

            case 'MONTHLY':
                this.setUpMonthly()
                break

            case 'WEEKLY':
                this.setUpWeekly()
                break

            case 'DAILY':
                this.setUpDaily()
        }
    }

    private setUpYearly() {
        const monthControl = this.formBuilder.control(
            this.job.month ?? '',
            [
                Validators.required,
                Validators.min(1),
                Validators.max(12)
            ]
        )

        const dayControl = this.formBuilder.control(
            this.job.day,
            [
                Validators.required,
                Validators.min(1),
                Validators.max(31)
            ]
        )

        const hourControl = this.formBuilder.control(
            this.job.hour?.[0] ?? null,
            [
                Validators.required,
                Validators.min(0),
                Validators.max(23)
            ]
        )

        this.form.addControl('month', monthControl)
        this.form.addControl('day', dayControl)
        this.form.addControl('hour', hourControl)
    }

    private setUpMonthly() {
        const dayControl = this.formBuilder.control(
            this.job.day,
            [
                Validators.required,
                Validators.min(1),
                Validators.max(31)
            ]
        )

        const hourControl = this.formBuilder.control(
            this.job.hour?.[0] ?? null,
            [
                Validators.required,
                Validators.min(0),
                Validators.max(23)
            ]
        )

        this.form.addControl('day', dayControl)
        this.form.addControl('hour', hourControl)
    }

    private setUpWeekly() {
        const dayControl = this.formBuilder.control(
            this.job.day_of_week ?? '',
            [
                Validators.required,
                Validators.min(1),
                Validators.max(7)
            ]
        )

        const hourControl = this.formBuilder.control(
            this.job.hour?.[0] ?? null,
            [
                Validators.required,
                Validators.min(0),
                Validators.max(23)
            ]
        )

        this.form.addControl('day_of_week', dayControl)
        this.form.addControl('hour', hourControl)
    }

    private setUpDaily() {
        const control = this.formBuilder.control(this.job.hour, Validators.required)
        this.form.addControl('hour', control)
    }

    getParam(index: number): string {
        return this.params?.[index] ?? `Parâmetro ${index + 1}`
    }

    getError(controlName: string): ValidationErrors {
        const control = this.form.get(controlName)
        return control.touched ? control.errors : {}
    }

    onPeriodTypeChange(period: Period) {
        this.selectedPeriod = period
        this.setUpForm()
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        const newJob: Job = {
            args: [],
            month: null,
            day: null,
            day_of_week: null,
            hour: null,
            ...this.form.value
        }

        this.dialog.close(newJob)
    }
}
