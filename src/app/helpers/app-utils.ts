import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export class AppUtils {
  public static handlerHttpError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${errorResponse.error?.message}`;

    } else {
      switch (errorResponse.status) {

        case 404: {
          errorMessage = 'Recurso não encontrado.';
          console.log(`${errorResponse.error?.errors?.status} - ${errorResponse.error?.errors?.message}`);
          errorResponse.error?.errors?.errors?.forEach((e, i) => console.log(`Stack [${i}] -> ${e}`));
          break;
        }

        case 500: {
          errorMessage = 'Ocorreu um erro interno no servidor.';
          console.log(`${errorResponse.error?.errors?.status} - ${errorResponse.error?.errors?.message}`);
          errorResponse.error?.errors?.errors?.forEach((e, i) => console.log(`Stack [${i}] -> ${e}`));
          break;
        }

        default: {
          errorMessage = errorResponse.error?.error;
          break;
        }
      }
    }
    return throwError(errorMessage);
  }
}
