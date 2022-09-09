import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';

import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from "./configurations/security/interceptors/jwt.interceptor";
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';
import { LoadingComponent } from './core/components/loading/loading.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { NoticeComponent } from './core/components/notice/notice.component';
import { interceptors } from './core/interceptors';

registerLocaleData(ptBr)

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoadingComponent,
        NotFoundComponent,
        NoticeComponent
    ],
    imports: [
        BrowserModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxMaskModule.forRoot(),
        NgChartsModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: LOCALE_ID,
            useValue: 'pt-BR'
        },
        interceptors
    ],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
