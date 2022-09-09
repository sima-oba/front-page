import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import jwt_decode from "jwt-decode";

import { SessionStorageService } from '../storages/session-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private storegeService: SessionStorageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const token = this.storegeService.token;
      
      if (token) {
        if (!this.isTokenValid(token)) {
          this.logoff()
          return EMPTY
        }

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      return next.handle(request);
  }

  private isTokenValid(token: string): boolean {
    const jwt = jwt_decode(token) as any
    const now = new Date().getTime()
    const expireTime = jwt.exp * 1000    

    return now < expireTime
  }

  private logoff() {
    this.storegeService.refresh()
    this.router.navigate(['/login/sign-in'])
  }
}
