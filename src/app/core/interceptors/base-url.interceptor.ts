import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
    private BASE_URL = environment.baseUrl

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.url.startsWith('http')) {
            return next.handle(request);
        }

        const url = this.BASE_URL + request.url
        const newRequest = request.clone({ url })

        return next.handle(newRequest)
    }

}
