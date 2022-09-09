import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionStorageService} from "../../configurations/security/storages/session-storage.service";

@Injectable({
    providedIn: 'root'
})
export class HomeGuard implements CanActivate {
    constructor(private storage: SessionStorageService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if(this.storage.isLogged ) {
           return true;
        }

        const nav = this.router.navigate([ '/login']);
        return false;
    }

}
