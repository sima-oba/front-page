import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { BaseUrlInterceptor } from './base-url.interceptor';

export const interceptors = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: BaseUrlInterceptor,
        multi: true
    }
];
