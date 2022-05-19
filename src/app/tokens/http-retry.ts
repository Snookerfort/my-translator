import { HttpContextToken } from '@angular/common/http';

export interface IHttpRetryStrategy {
  /** times to repeat */
  count: number;
  /** delay between requests */
  delay: number;
  /** if no condition is specified, the strategy is not applied */
  conditions: {
    /** after this time request will be retried */
    waitingTime?: number;
    /** when error has this status(es) request will be retried */
    statusCodes?: number[];
  };
}

export const HTTP_RETRY_STRATEGY = new HttpContextToken<IHttpRetryStrategy | null>(() => ({
    count: 3,
    delay: 1000,
    conditions: {
      waitingTime: 10000,
      statusCodes: [503],
    }
  }
));

