import { HttpContextToken } from '@angular/common/http';

export const HTTP_RETRY_CONTEXT = new HttpContextToken<{
  count: number;
  delay: number;
}>(() => ({count: 0, delay: 0}))
