import { By } from '@angular/platform-browser';
import { TuiButtonModule } from '@taiga-ui/core';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Component, forwardRef, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TranslatorComponent } from './translator.component';
import { TranslateApiService } from '../../services/translate-api.service';
import { runOnPushChangeDetection } from '../../../testing/change-detection-helpers';

@Component({selector: 'mt-translator-source', template: ''})
class TranslatorSourceStubComponent implements ControlValueAccessor {
  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }
}

@Component({selector: 'mt-translator-target', template: ''})
class TranslatorTargetStubComponent {
  @Input()
  translation = '';
}

describe('TranslatorComponent', () => {
  let component: TranslatorComponent;
  let fixture: ComponentFixture<TranslatorComponent>;
  let translateSpy: jasmine.Spy;
  let translation: string;

  beforeEach(async () => {
    translation = 'some translation';
    const translateApiService = jasmine.createSpyObj('TranslateApiService', ['translate']);
    const response = cold('-x|', {x: {text: translation}});
    translateSpy = translateApiService.translate.and.returnValue(response);

    await TestBed.configureTestingModule({
      declarations: [
        TranslatorComponent,
        TranslatorSourceStubComponent,
        TranslatorTargetStubComponent,
      ],
      imports: [FormsModule, TuiButtonModule],
      providers: [
        {provide: TranslateApiService, useValue: translateApiService},
      ]
    })
      .overrideComponent(
        TranslatorSourceStubComponent,
        {
          set: {
            providers: [{
              provide: NG_VALUE_ACCESSOR,
              useExisting: forwardRef(() => TranslatorSourceStubComponent),
              multi: true
            }]
          }
        }
      )
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loading should toggle when requesting translation', () => {
    fixture.detectChanges();
    component.sourceForm = {language: 'test', source: 'test'};
    component.translate();
    expect(component.loading)
      .withContext('before request translate')
      .toBeTruthy();
    getTestScheduler().flush();
    expect(component.loading)
      .withContext('after request translate')
      .toBeFalse();
  });

  it('translate button should be disabled when form invalid', () => {
    fixture.detectChanges();
    const buttonDe = fixture.debugElement.query(By.css('button'));
    const translateBtn: HTMLButtonElement = buttonDe.nativeElement;
    expect(translateBtn.disabled)
      .withContext('button should be disabled on initialization')
      .toBeTrue();
    component.sourceForm = {language: 'test', source: 'test'};
    runOnPushChangeDetection(fixture);
    expect(translateBtn.disabled)
      .withContext('button should be enable when all fields are filled in')
      .toBeFalse();
  });

  it('translation text should be received after request', () => {
    fixture.detectChanges();
    component.sourceForm = {language: 'test', source: 'test'};
    component.translate();
    expect(component.translation).toBe('');
    getTestScheduler().flush();
    expect(component.translation).toEqual(translation);
  });

  it('form should be correct validate', () => {
    fixture.detectChanges();
    expect(component.sourceForm)
      .withContext('sourceForm should be null on initialization')
      .toEqual(null);
    expect(component.sourceFormIsValid)
      .withContext('form should be invalid when empty')
      .toBeFalse();
    component.sourceForm = {source: 'text', language: null};
    expect(component.sourceFormIsValid)
      .withContext('form should be invalid when at least one field is empty')
      .toBeFalse();
    component.sourceForm = {source: null, language: 'en'};
    expect(component.sourceFormIsValid)
      .withContext('form should be invalid when at least one field is empty')
      .toBeFalse();
    component.sourceForm = {source: 'text', language: 'en'};
    expect(component.sourceFormIsValid)
      .withContext('form should be valid when all fields are filled in')
      .toBeTruthy();
  });

});
