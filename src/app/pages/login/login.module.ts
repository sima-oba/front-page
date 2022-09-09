import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { OwnerActivationComponent } from './components/owner-activation/owner-activation.component';
import { PublicActivationComponent } from './components/public-activation/public-activation.component';

@NgModule({
    declarations: [
        SignInComponent,
        SignUpComponent,
        ForgotPasswordComponent,
        PasswordChangeComponent,
        LoginComponent,
        OwnerActivationComponent,
        PublicActivationComponent
    ],
    imports: [
        SharedModule,
        LoginRoutingModule,
        NgxMaskModule.forChild()
    ]
})
export class LoginModule { }
