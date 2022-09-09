import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { PracticeService } from '../services/practice.service';


@Injectable({
    providedIn: 'root'
})
export class PracticeListGuard implements CanActivate {

    constructor(
        private router: Router,
        private service: PracticeService
    ) { }

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): boolean | UrlTree {
        const isFarmSelected = this.service.query?.farmId !== undefined

        return isFarmSelected || this.router.createUrlTree(['/practices'])
    }

}
