import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AppUtils} from '../../helpers/app-utils';
import {AuthenticationRequest} from './authentication-request';
import {AuthenticationResponse} from './authentication-response';
import {CommonService} from '../commons/common.service';
import {CommonResponse} from '../commons/common-response';
import {SessionStorageService} from "../security/storages/session-storage.service";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  constructor(private http: HttpClient,
              private storage: SessionStorageService) { }

  private authenticate(bean: AuthenticationRequest): Observable<AuthenticationResponse> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/auth/session/login`;
    return this.http.post<any>(baseUrl, bean).pipe(
      tap((response: any) => { if(response) {
         this.loggedIn = true;
          this.storage.registerAuthentication(response); } }),
      map((response: any) => {
        if(response) {
            return response as AuthenticationResponse; }
        else {
          console.log('Usuário e senha inválidos, por favor verifique suas crendenciais e tente novamente.', `${response.error.message}`);
          return null;
        }
      }),
      catchError((response: HttpErrorResponse) => AppUtils.handlerHttpError(response) )
    );
  }

  private unauthenticate(bean: AuthenticationRequest): Observable<AuthenticationResponse> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/authentication/logoff`;
    return this.http.post<CommonResponse>(baseUrl, bean).pipe(
      map((response: CommonResponse) => {
        if(response.success) { return response.content as AuthenticationResponse; }
        else {
            console.log('Usuário e senha inválidos, por favor verifique suas crendenciais e tente novamente.', `${response.error.message}`);
            return null;
        }
      }),
      catchError((response: HttpErrorResponse) =>  AppUtils.handlerHttpError(response) )
    );
  }

    public loggedIn: boolean = false;
  public async doAuthentication(loginFormValue: AuthenticationRequest): Promise<AuthenticationResponse> {
    return await this.authenticate(loginFormValue).toPromise();
  }

  public async doLogoff(bean: AuthenticationRequest): Promise<AuthenticationResponse> {
    return await this.unauthenticate(bean).toPromise();
  }
}
