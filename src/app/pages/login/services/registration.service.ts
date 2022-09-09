import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { OwnerRegistration, OwnerActivation } from '../models/owner-registration.model';
import { PublicActivation, PublicRegistration } from '../models/public-registration.model';
import { UserEmail } from '../models/registration-result';

const PATH = '/auth/registration'

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(private client: HttpClient) { }

    registerOwner(registration: OwnerRegistration): Observable<UserEmail> {
        return this.client.post<UserEmail>(`${PATH}/owners`, registration)
    }

    activateOwner(activation: OwnerActivation): Observable<any> {
        return this.client.post(`${PATH}/owners/activation`, activation)
    }

    registerPublicUser(registration: PublicRegistration): Observable<UserEmail> {
        delete registration.confirmPassword
        return this.client.post<UserEmail>(`${PATH}/public`, registration)
    }

    activatePublicUser(activation: PublicActivation): Observable<any> {
        return this.client.post(`${PATH}/public/activation`, activation)
    }
}
