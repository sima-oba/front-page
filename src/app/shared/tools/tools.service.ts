import {Injectable, OnDestroy} from '@angular/core';
import {SessionStorageService} from '../../configurations/security/storages/session-storage.service';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {AuthenticationResponse} from '../../configurations/authentication/authentication-response';
import { Subject, Subscription} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ToolsService implements OnDestroy {

    private _isLogged: boolean;
    private _loginResponse: AuthenticationResponse;

    private stopPolling = new Subject();
    private subscription: Subscription = new Subscription();

    constructor(public storageService: SessionStorageService,
                public router: Router,
                public fb: FormBuilder) {
        this.updateSessionDetails();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public get isLogged(): boolean { return this._isLogged; }
    public get loginResponse(): AuthenticationResponse { return this._loginResponse; }
    public get usuarioLogado(): any { return this.storageService ? JSON.parse(this.storageService.authentication) : undefined }

    public updateSessionDetails() {
        this._isLogged = this.storageService.isLogged;
        this._loginResponse = this.storageService.authentication;
    }

    public getControlGroupByForm(form: FormGroup, name: string): FormGroup {
        return form.get(name) as FormGroup;
    }

    public getControlArrayByForm(form: FormGroup, name: string): FormArray {
        return form.get(name) as FormArray;
    }

    public handlerFormValidatorError(form: FormGroup): void {
        if(form) {
            for(const ctrl of Object.keys(form.controls)) {
                if(form.get(ctrl) instanceof FormGroup) {
                    this.handlerFormValidatorError(this.getControlGroupByForm(form, ctrl));

                } else {
                    if(form.get(ctrl).invalid) {
                       // this.toastr.warning(`O campo ${ctrl} esta inválido.`, 'Atenção');
                    }
                }
            }
        }
    }

    public captalizeLetter(word: string, type?: string): string {
        if(type) {
            switch(type) {
                case 'first': return word.charAt(0).toUpperCase() + word.slice(1);

                case 'full': {
                    let newWord = '';
                    for(const w of word.split(' ')) {
                        newWord += this.captalizeLetter(w);
                    }

                    return word;
                }
            }
        }

        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}
