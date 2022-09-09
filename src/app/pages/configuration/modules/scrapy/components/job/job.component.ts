import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { filter, finalize, switchMap, tap } from 'rxjs/operators';

import { LoadingService } from 'src/app/core/services/loading.service';
import { filterNotNull } from 'src/app/core/utils/rxjs';
import { ConfirmationDialog } from 'src/app/shared/components/confirmation/confirmation.component';
import { Job } from '../../models/job.model';
import { ScrapyService } from '../../services/scrapy.service';
import { JobConfigDialog } from '../job-config-dialog/job-config-dialog.component';

const REFRESH_INTERVAL = 1000 * 60 * 10 // milliseconds
const CONFIRM_UPDATE_MSG = 'Deseja atualizar as configurações de importação?'
const SUCCESS_UPDATE_MSG = 'As configurações de importação foram atualizadas.'
const CONFIRM_EXEC_MSG = 'Deseja iniciar a importação agora?'

@UntilDestroy()
@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
    job: Job

    @Input()
    jobId: string

    @Input()
    params: string[]

    constructor(
        private dialog: MatDialog,
        private loading: LoadingService,
        private service: ScrapyService
    ) { }

    ngOnInit() {
        this.checkRequiredInputs()
        this.load()
    }

    private checkRequiredInputs() {
        if (this.jobId == null) {
            throw new Error('Missing "jobId" input')
        }
    }

    private load() {
        timer(0, REFRESH_INTERVAL)
            .pipe(
                untilDestroyed(this),
                switchMap(() => this.service.getJob(this.jobId)),
            )
            .subscribe(job => this.job = job)
    }

    configure() {
        const data = {
            job: this.job,
            params: this.params
        }

        this.dialog.open(JobConfigDialog, { data })
            .afterClosed()
            .pipe(filterNotNull())
            .subscribe(this.update)
    }

    private update = (job: Job) => {
        const data = {
            title: CONFIRM_UPDATE_MSG,
            confirmButton: 'Sim',
            cancelButton: 'Nao'
        }

        this.dialog.open(ConfirmationDialog, { data })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.loading.on()),
                switchMap(() => this.service.updateJob(job)),
                switchMap(() => this.service.getJob(this.jobId)),
                finalize(() => this.loading.off())
            )
            .subscribe(job => {
                this.job = job
                this.showSuccess(SUCCESS_UPDATE_MSG)
            })
    }

    execute() {
        const data = {
            title: CONFIRM_EXEC_MSG,
            confirmButton: 'Sim',
            cancelButton: 'Nao'
        }

        this.dialog.open(ConfirmationDialog, { data })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.loading.on()),
                switchMap(() => this.service.executeJob(this.jobId)),
                switchMap(() => this.service.getJob(this.jobId)),
                finalize(() => this.loading.off())
            )
            .subscribe(job => this.job = job)
    }

    private showSuccess(title: string) {
        const data = { title, cancelButton: false }
        this.dialog.open(ConfirmationDialog, { data })
    }
}
