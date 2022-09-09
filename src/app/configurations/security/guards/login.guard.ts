import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionStorageService} from '../storages/session-storage.service';
import {AuthenticationResponse} from "../../authentication/authentication-response";

@Injectable({providedIn: 'root'})
export class LoginGuard implements CanActivate {

  constructor(private storage: SessionStorageService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.storage.isLogged) {
      const is = JSON.parse(localStorage.getItem('credentials')) as boolean;
      return true;
    }

    const nav = this.router.navigate(['/']);
    return false;
  }

}
