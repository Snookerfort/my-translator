import { Observable } from 'rxjs';

import { ILanguage } from '../interfaces/language.interface';
import { ITranslation } from '../interfaces/translation.interface';


export abstract class TranslateApiService {

  /**
   * should return the language code (ISO 639-1)
   */
  public abstract detectLanguage(language: string): Observable<string>;

  public abstract listLanguages(): Observable<ILanguage[]>;

  public abstract translate(text: string, target: string, source?: string): Observable<ITranslation>;

}
