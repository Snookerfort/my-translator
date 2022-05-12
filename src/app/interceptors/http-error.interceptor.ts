import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { HTTP_RETRY_CONTEXT } from '../tokens/http-retry';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private readonly alertService: TuiAlertService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const {count, delay} = request.context.get(HTTP_RETRY_CONTEXT);

    return next.handle(request).pipe(
      retry({count, delay}),
      catchError(error => {
        const label = 'Error was occurred';
        const message = error.message ?? 'Something went wrong';
        this.alertService.open(message, {label, status: TuiNotification.Error}).subscribe();

        return throwError(() => error);
      })
    );
  }
}
