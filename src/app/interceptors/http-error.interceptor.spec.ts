import { TuiAlertService } from '@taiga-ui/core';
import { EMPTY, Observable, TimeoutError, timer } from 'rxjs';
import { MockBuilder, NG_MOCKS_INTERCEPTORS, ngMocks } from 'ng-mocks';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpBackend,
  HttpClient,
  HttpClientModule,
  HttpContext,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { TestScheduler } from 'rxjs/testing';

import { AppModule } from '../app.module';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HTTP_RETRY_STRATEGY, IHttpRetryStrategy } from '../tokens/http-retry';
import createSpy = jasmine.createSpy;

describe('HttpErrorInterceptor', () => {

  let interceptor: HttpErrorInterceptor;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    return MockBuilder(HttpErrorInterceptor, AppModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .replace(HttpClientModule, HttpClientTestingModule)
      .mock(TuiAlertService, {
        open: createSpy('open').and.returnValue(EMPTY)
      });
  });

  beforeEach(() => {
    interceptor = ngMocks.findInstance(HttpErrorInterceptor);
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should throw a timeout error when request timeout exceeds "waitingTime"', () => {
    const waitingTime = 100;
    const retryStrategyConfig: IHttpRetryStrategy = {count: 0, delay: 0, conditions: {waitingTime: 100}};
    const context = new HttpContext().set(HTTP_RETRY_STRATEGY, retryStrategyConfig);
    const request = new HttpRequest('GET', '/test', {context});
    const errorSpy = createSpy('error');
    /** to trigger timeout error, request delay must be greater than "waitingTime" */
    const handler = new TestHandler({requestDelay: waitingTime + 1});
    testScheduler.run(helpers => {
      interceptor.intercept(request, handler).subscribe({
        error: errorSpy,
      });
      helpers.flush();
      expect(errorSpy).toHaveBeenCalled();
      const [errorArgument] = errorSpy.calls.argsFor(0);
      expect(errorArgument).toBeInstanceOf(TimeoutError);
    });
  });

  it('should retry by status code', () => {
    const retryStrategyConfig: IHttpRetryStrategy = {count: 3, delay: 0, conditions: {statusCodes: [503]}};
    const request = new HttpRequest('GET', '/test', {
      context: new HttpContext().set(HTTP_RETRY_STRATEGY, retryStrategyConfig)
    });
    const errorSpy = createSpy('error');
    const handler = new TestHandler({status: 503, statusText: 'Service Unavailable'});
    testScheduler.run(helpers => {
      interceptor.intercept(request, handler).subscribe({error: errorSpy});
      helpers.flush();
      expect(errorSpy).toHaveBeenCalled();
      expect(handler.calls).toEqual(retryStrategyConfig.count + 1);
    });
  });

  it('should retry by timeout', () => {
    const waitingTime = 100;
    const retryStrategyConfig: IHttpRetryStrategy = {count: 2, delay: 0, conditions: {waitingTime}};
    const request = new HttpRequest('GET', '/test', {
      context: new HttpContext().set(HTTP_RETRY_STRATEGY, retryStrategyConfig),
    });
    const errorSpy = createSpy('error');
    const handler = new TestHandler({requestDelay: waitingTime + 1});
    testScheduler.run(helpers => {
      interceptor.intercept(request, handler).subscribe({error: errorSpy});
      helpers.flush();
      expect(errorSpy).toHaveBeenCalled();
      expect(handler.calls).toEqual(retryStrategyConfig.count + 1);
    });
  });

  it('should call "open" method of the alert service when httpError has occurred', () => {
    const retryStrategyConfig: IHttpRetryStrategy = {count: 0, delay: 0, conditions: {waitingTime: 100}};
    const context = new HttpContext().set(HTTP_RETRY_STRATEGY, retryStrategyConfig);
    const alertService = ngMocks.findInstance(TuiAlertService);
    const httpClient = ngMocks.findInstance(HttpClient);
    const httpTestingController = ngMocks.findInstance(HttpTestingController);
    httpClient.get('/test', {context}).subscribe({
      next: () => fail('should have failed with the 503 error'),
      error: error => {
        expect(error.status).withContext('status').toEqual(503);
        expect(error.error).withContext('message').toEqual('Error');
      }
    });
    const req = httpTestingController.expectOne('/test');
    req.flush('Error', {status: 503, statusText: 'Service Unavailable'});
    expect(alertService.open).toHaveBeenCalled();
  });

});

interface IHttpHandlerConfig {
  requestDelay: number;
  status: number;
  statusText: string;
}

class TestHandler implements HttpBackend {

  /** count retries */
  public calls = 0;
  public delay: number;
  public status: number;
  public statusText: string;

  constructor(config: Partial<IHttpHandlerConfig>) {
    this.delay = config.requestDelay ?? 1000;
    this.status = config.status ?? 200;
    this.statusText = config.statusText ?? 'OK';
  }

  public handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(subscriber => {
      this.calls++;
      let cb: any;
      if (this.status >= 200 && this.status < 300) {
        cb = () => {
          subscriber.next(new HttpResponse<any>({body: 'Test', status: this.status, statusText: this.statusText}));
          subscriber.complete();
        };
      } else {
        cb = () => subscriber.error(new HttpErrorResponse({
          error: 'Test',
          status: this.status,
          statusText: this.statusText
        }));
      }
      timer(this.delay).subscribe(cb);
    });
  }
}
