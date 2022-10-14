import { Injectable } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthenticationResponse } from '../../authentication/authentication-response';

@Injectable({providedIn: 'root'})
export class SessionStorageService {

  public setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }


  public refresh(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

  public get authentication(): any {
    return JSON.parse(sessionStorage.getItem('authentication')) ;
  }


  public get isLogged(): boolean {
    return sessionStorage.getItem('isLogged') === 'true';
  }

  public get usuarioLogado(): User {
    return this.authentication ? this.authentication.user : undefined;
  }

  public registerAuthentication(authResponse: AuthenticationResponse) {
    if(authResponse) {
      this.setItem('authentication', JSON.stringify(authResponse));
      this.setItem('isLogged', 'true');
    }
  }

  public get token(): string {
    return this.authentication ? this.authentication.access_token : '';
  }

}
