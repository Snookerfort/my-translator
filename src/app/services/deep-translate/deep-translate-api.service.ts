import { map, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TranslateApiService } from '../translate-api.service';
import { ILanguage } from '../../interfaces/language.interface';
import { ITranslation } from '../../interfaces/translation.interface';
import { IDeepTranslateTranslationResponse } from './interfaces/deep-translate-translation-response.interface';
import { IDeepTranslateLanguagesResponse } from './interfaces/deep-translate-languages-response.interface';

/** https://rapidapi.com/gatzuma/api/deep-translate1/ */
export class DEEP_TRANSLATE_API_ROUTES {
  public static readonly BASE = 'https://deep-translate1.p.rapidapi.com';
  /**
   * To translate text, make a POST request and provide JSON in the
   * request body that identifies the language to translate to (target)
   * and the text to translate (q).
   * You can provide multiple segments of text to translate by including
   * multiple q fields or a list of values for the q field.
   * Specify target languages by using their ISO-639-1 codes.
   */
  public static readonly TRANSLATE = `${this.BASE}/language/translate/v2`
  /**
   * To detect the language of some text,
   * make a POST request and provide the appropriate request body.
   */
  public static readonly DETECT = `${this.TRANSLATE}/detect`;
  /**
   * You can discover the supported languages of this API by
   * sending an HTTP request using a URL of the following format
   */
  public static readonly LANGUAGES = `${this.TRANSLATE}/languages`
}


@Injectable({
  providedIn: 'root'
})
export class DeepTranslateApiService extends TranslateApiService {

  private commonHeaders: HttpHeaders = new HttpHeaders({
    'content-type': 'application/json',
    'X-RapidAPI-Host': '',
    'X-RapidAPI-Key': '',
  });

  constructor(
    private httpClient: HttpClient,
  ) {
    super();
  }

  public detectLanguage(language: string): Observable<string> {
    return of('');
  }

  public listLanguages(): Observable<ILanguage[]> {
    return this.httpClient.get<IDeepTranslateLanguagesResponse>(
      DEEP_TRANSLATE_API_ROUTES.LANGUAGES,
      {
        headers: this.commonHeaders,
      },
    ).pipe(
      map(response => response.languages.map(lang => ({code: lang.language, name: lang.name}))),
    );
  }

  public translate(text: string, target: string, source?: string): Observable<ITranslation> {
    const body = {q: text, source, target};

    return this.httpClient.post<IDeepTranslateTranslationResponse>(
      DEEP_TRANSLATE_API_ROUTES.TRANSLATE,
      body,
      {
        headers: this.commonHeaders,
      },
    ).pipe(
      map(response => ({text: response.data.translations.translatedText})),
    );
  }

}
