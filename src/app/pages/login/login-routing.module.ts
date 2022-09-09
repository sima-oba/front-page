import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './login.component';
import {LoginGuard} from "../../configurations/security/guards/login.guard";
import { OwnerActivationComponent } from './components/owner-activation/owner-activation.component';
import { PublicActivationComponent } from './components/public-activation/public-activation.component';



const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'owner-activation/:code',
                component: OwnerActivationComponent
            },
            {
                path: 'public-activation/:code',
                component: PublicActivationComponent
            },
            {
                path: '',
                redirectTo: 'sign-in',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
