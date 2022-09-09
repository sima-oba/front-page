import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthorizationService, Role } from '../authorization.service';

export abstract class AbstractRoleGuard implements CanActivate {
    abstract readonly requiredRole: Role

    constructor(
        private auth: AuthorizationService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return of(this.auth.hasRole(this.requiredRole) || this.router.createUrlTree(['/access-denied']))
    }

}
