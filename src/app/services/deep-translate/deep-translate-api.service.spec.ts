import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { DEEP_TRANSLATE_API_ROUTES, DeepTranslateApiService } from './deep-translate-api.service';
import { IDeepTranslateLanguagesResponse } from './interfaces/deep-translate-languages-response.interface';
import { IDeepTranslateTranslationResponse } from './interfaces/deep-translate-translation-response.interface';

const checkRequestHeaders = (req: TestRequest) => {
  expect(req.request.headers.has('X-RapidAPI-Host'))
    .withContext('"X-RapidAPI-Host" header should be passed').toBeTruthy();
  expect(req.request.headers.has('X-RapidAPI-Key'))
    .withContext('"X-RapidAPI-Key" header should be passed').toBeTruthy();
}

describe('DeepTranslateApiService', () => {
  let httpClient: HttpClient;
  let service: DeepTranslateApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DeepTranslateApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call listLanguages and return an array of languages', () => {
    const data: IDeepTranslateLanguagesResponse = {languages: [{language: 'en', name: 'English'}]};
    service.listLanguages().subscribe(response => {
      expect(response).toEqual([{code: 'en', name: 'English'}]);
    })
    const req = httpTestingController.expectOne(DEEP_TRANSLATE_API_ROUTES.LANGUAGES);
    checkRequestHeaders(req);
    req.flush(data);
  })

  it('should call translate and return translation', () => {
    const data: IDeepTranslateTranslationResponse = {
      data: {
        translations: {
          translatedText: 'Перевод',
        }
      }
    };
    service.translate('Test text', 'ru').subscribe(response => {
      expect(response).toEqual({text: 'Перевод'})
    });
    const req = httpTestingController.expectOne(DEEP_TRANSLATE_API_ROUTES.TRANSLATE);
    checkRequestHeaders(req);
    req.flush(data);
  })

});
