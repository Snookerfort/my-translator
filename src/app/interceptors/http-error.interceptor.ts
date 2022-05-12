import { Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private readonly alertService: TuiAlertService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        const label = 'Error was occurred';
        const message = error.message ?? 'Something went wrong';
        this.alertService.open(message, {label, status: TuiNotification.Error}).subscribe();

        return throwError(() => error);
      })
    );
  }
}
