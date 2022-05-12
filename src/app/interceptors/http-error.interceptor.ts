import { Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, retry, throwError, timeout, TimeoutError, timer, UnaryFunction } from 'rxjs';

import { HTTP_RETRY_STRATEGY } from '../tokens/http-retry';
import { pipeFromArray } from '../utils/rxjs/pipeFromArray';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private readonly alertService: TuiAlertService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      this.configurablePipe(request),
      catchError(error => {
        const label = 'Error was occurred';
        this.alertService
          .open(this.createMessage(error), {label, status: TuiNotification.Error})
          .subscribe();

        return throwError(() => error);
      })
    );
  }

  private createMessage(error: any): string {
    if (error instanceof TimeoutError) {
      return 'Server unavailable. Try later.';
    }
    return error.message ?? 'Something went wrong';
  }

  private configurablePipe(request: HttpRequest<unknown>) {
    return <U>(source: Observable<U>) => {
      const operators: Array<UnaryFunction<any, any>> = [];
      const context = request.context.get(HTTP_RETRY_STRATEGY);
      if (context) {
        const {count, delay, conditions} = context;
        if (conditions.waitingTime) {
          operators.push(timeout(conditions.waitingTime));
        }
        const retryConfig = {
          count,
          delay: (error: any) => {
            const retryByTimeout = conditions.waitingTime ? error instanceof TimeoutError : false;
            const retryByStatusCode = (conditions.statusCodes ?? []).includes(error.status);

            /** retrying request */
            if (retryByTimeout || retryByStatusCode) {
              return timer(delay);
            }
            return throwError(() => error)
          }
        }
        operators.push(retry(retryConfig));
      }
      return source.pipe<U>(pipeFromArray(operators));
    };
  }
}
