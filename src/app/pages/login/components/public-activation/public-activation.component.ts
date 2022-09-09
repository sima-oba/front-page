import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { from } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { LoadingService } from 'src/app/core/services/loading.service';
import { RegistrationService } from '../../services/registration.service';
import { finalize, first } from 'rxjs/operators';


@Component({
    selector: 'app-public-activation',
    templateUrl: './public-activation.component.html',
    styleUrls: ['./public-activation.component.scss']
})
export class PublicActivationComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private loading: LoadingService,
        private service: RegistrationService
    ) { }
    
    ngOnInit() {
        const code = this.activatedRoute.snapshot.params?.code

        this.loading.on()
        this.service.activatePublicUser({ code })
            .pipe(
                first(),
                finalize(() => this.loading.off())
            ).subscribe({
                next: this.onSuccess,
                error: this.onError
            })
    }

    private onSuccess = () => {
        const result = Swal.fire({
            title: 'Cadastro concluído!',
            confirmButtonColor: '#458985'
        })

        from(result).subscribe(() =>
            this.router.navigate(['/login'])
        )
    }

    private onError = (error: any) => {
        if (!(error instanceof HttpErrorResponse)) return

        let result: Promise<SweetAlertResult<any>>

        if (error.status === 403) {
            result = Swal.fire({
                title: 'Link de ativação inválido.',
                text: 'Por favor, contate o administrador para mais informações.',
                confirmButtonColor: '#458985'
            })
        } else {
            result = Swal.fire({
                title: 'Erro',
                text: error.message,
                confirmButtonColor: '#458985'
            })
        }

        result.then(() => this.router.navigate(['/login']))
    }
}
