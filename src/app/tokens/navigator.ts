import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const NAVIGATOR = new InjectionToken<Navigator>('NAVIGATOR', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).defaultView!.navigator,
})
