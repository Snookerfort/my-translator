import { delay, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { ILanguage } from '../interfaces/language.interface';
import { TranslateApiService } from './translate-api.service';
import { ITranslation } from '../interfaces/translation.interface';


@Injectable({
  providedIn: 'root'
})
export class TranslateApiMockService extends TranslateApiService {

  constructor() {
    super();
  }

  public detectLanguage(language: string): Observable<string> {
    return of('ru').pipe(delay(2000));
  }

  public listLanguages(): Observable<ILanguage[]> {
    const languages = [
      {
        "code": "en",
        "name": "English"
      },
      {
        "code": "de",
        "name": "Deutsch"
      },
      {
        "code": "ru",
        "name": "русский"
      },
    ];
    return of(languages).pipe(delay(2000));
  }

  public translate(text: string, target: string, source?: string): Observable<ITranslation> {
    return of({
      text: 'some translation code'
    }).pipe(delay(2000));
  }


}
