import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import ResponseCode from '../../common/constants/responseCodes';
import {ErrorService} from '../../common/services/error-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(error);

        this.errorService.emitError(errorMessage);

        return throwError(() => errorMessage);
      }),
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const responseCode = Object.values(ResponseCode).find(response => response.code == error.status);

    if(responseCode)
      return responseCode.message;

    return 'Please try again later.'
  }
}
