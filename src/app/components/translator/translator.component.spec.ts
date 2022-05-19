import { FormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { MockComponents, MockProvider, ngMocks } from 'ng-mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorComponent } from './translator.component';
import { TranslateApiService } from '../../services/translate-api.service';
import { runOnPushChangeDetection } from '../../../testing/change-detection-helpers';
import { TranslatorSourceComponent } from './translator-source/translator-source.component';
import { TranslatorTargetComponent } from './translator-target/translator-target.component';


describe('TranslatorComponent', () => {

  const translation = 'Some translation';
  let componentInstance: TranslatorComponent;
  let fixture: ComponentFixture<TranslatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TranslatorComponent,
        ...MockComponents(TranslatorTargetComponent, TranslatorSourceComponent),
      ],
      imports: [
        FormsModule,
        TuiButtonModule,
      ],
      providers: [
        MockProvider(TranslateApiService, {
          translate: () => cold('-x|', {x: {text: translation}})
        })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorComponent);
    componentInstance = fixture.componentInstance;
  });

  it('should create', () => {
    expect(componentInstance).toBeDefined();
  });

  it('loading should toggle when requesting translation', () => {
    componentInstance.sourceForm = {language: 'test', source: 'test'};
    componentInstance.translate();
    expect(componentInstance.loading)
      .withContext('before request translate')
      .toBeTrue();
    getTestScheduler().flush();
    expect(componentInstance.loading)
      .withContext('after request translate')
      .toBeFalse();
  });

  it('translate button should be disabled when form invalid', async () => {
    fixture.detectChanges();
    const buttonDe = ngMocks.find('.translator-btn button');
    const translateBtn: HTMLButtonElement = buttonDe.nativeElement;
    expect(translateBtn.disabled)
      .withContext('button should be disabled on initialization')
      .toBeTrue();
    componentInstance.sourceForm = {language: 'test', source: 'test'};
    await runOnPushChangeDetection(fixture);
    expect(translateBtn.disabled)
      .withContext('button should be enable when all fields are filled in')
      .toBeFalse();
  });

  it('translation text should be received after request', () => {
    componentInstance.sourceForm = {language: 'test', source: 'test'};
    componentInstance.translate();
    expect(componentInstance.translation).toBe('');
    getTestScheduler().flush();
    expect(componentInstance.translation).toEqual(translation);
  });

  it('form should be correct validate', () => {
    expect(componentInstance.sourceForm)
      .withContext('sourceForm should be null on initialization')
      .toEqual(null);
    expect(componentInstance.sourceFormIsValid)
      .withContext('form should be invalid when empty')
      .toBeFalse();
    componentInstance.sourceForm = {source: 'text', language: null};
    expect(componentInstance.sourceFormIsValid)
      .withContext('form should be invalid when at least one field is empty')
      .toBeFalse();
    componentInstance.sourceForm = {source: null, language: 'en'};
    expect(componentInstance.sourceFormIsValid)
      .withContext('form should be invalid when at least one field is empty')
      .toBeFalse();
    componentInstance.sourceForm = {source: 'text', language: 'en'};
    expect(componentInstance.sourceFormIsValid)
      .withContext('form should be valid when all fields are filled in')
      .toBeTruthy();
  });

});
