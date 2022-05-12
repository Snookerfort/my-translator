import { TuiLetModule } from '@taiga-ui/cdk';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiSelectModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { TuiAlertService, TuiNotification, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';

import { NAVIGATOR } from '../../../tokens/navigator';
import { TranslatorSourceComponent } from './translator-source.component';
import { TranslateApiService } from '../../../services/translate-api.service';
import { AlertingStubService, NavigatorStub, TranslateApiStubService } from '../testing/translator-testing-helpers';


describe('TranslatorSourceComponent', () => {
  let component: TranslatorSourceComponent;
  let fixture: ComponentFixture<TranslatorSourceComponent>;
  let navigator: NavigatorStub;
  let translateApiService: TranslateApiService;
  let tuiAlertService: TuiAlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TuiSvgModule,
        TuiLetModule,
        TuiSelectModule,
        TuiTextAreaModule,
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
      ],
      declarations: [
        TranslatorSourceComponent,
      ],
      providers: [
        {provide: NAVIGATOR, useClass: NavigatorStub},
        {provide: TranslateApiService, useClass: TranslateApiStubService},
        {provide: TuiAlertService, useClass: AlertingStubService},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorSourceComponent);
    component = fixture.componentInstance;
    navigator = fixture.debugElement.injector.get(NAVIGATOR);
    translateApiService = fixture.debugElement.injector.get(TranslateApiService);
    tuiAlertService = fixture.debugElement.injector.get(TuiAlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('languages list should be configured correctly', () => {
    component.languages$.subscribe(languageList => {
      expect(languageList).toEqual(TranslateApiStubService.languages);
    });
  });

  it('after pasting form value should contain text', async () => {
    const clipBoardValue = 'Some text';
    const clipBoardReadTextSpy = spyOn(navigator.clipboard, 'readText')
      .and
      .returnValue(Promise.resolve(clipBoardValue));
    await component.paste();
    expect(clipBoardReadTextSpy).toHaveBeenCalled();
    expect(component.form.value).toEqual(jasmine.objectContaining({
      source: clipBoardValue
    }));
  });

  it('after success pasting form tuiAlertService open method should be called', async () => {
    const clipBoardValue = 'Some text';
    spyOn(navigator.clipboard, 'readText')
      .and
      .returnValue(Promise.resolve(clipBoardValue));
    await component.paste();
    expect(tuiAlertService.open).toHaveBeenCalled();
    expect(tuiAlertService.open).toHaveBeenCalledWith('Text has been pasted!', {status: TuiNotification.Success});
  });

  it('after error pasting form tuiAlertService open method should be called', async () => {
    const clipBoardValue = 'Some text';
    spyOn(navigator.clipboard, 'readText')
      .and
      .returnValue(Promise.reject(clipBoardValue));
    await component.paste();
    expect(tuiAlertService.open).toHaveBeenCalled();
    expect(tuiAlertService.open).toHaveBeenCalledWith('Text hasn\'t been pasted!', {status: TuiNotification.Error});
  });

});
