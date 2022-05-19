import { EMPTY } from 'rxjs';
import createSpy = jasmine.createSpy;
import { cold } from 'jasmine-marbles';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';

import { AppModule } from '../../../app.module';
import { NAVIGATOR } from '../../../tokens/navigator';
import { ILanguage } from '../../../interfaces/language.interface';
import { TranslatorSourceComponent } from './translator-source.component';
import { TranslateApiService } from '../../../services/translate-api.service';


describe('TranslatorSourceComponent', () => {
  const languages: ILanguage[] = [{code: 'en', name: 'English'}];
  let componentInstance: TranslatorSourceComponent;
  let fixture: MockedComponentFixture<TranslatorSourceComponent>;

  beforeEach(() => {
    return MockBuilder(TranslatorSourceComponent, AppModule)
      .mock(TranslateApiService, {
        listLanguages: () => cold('-x|', {x: languages})
      })
      .mock(TuiAlertService, {
        open: createSpy('open').and.returnValue(EMPTY)
      })
      .provide({
        provide: NAVIGATOR,
        useValue: {
          clipboard: {
            readText: () => {},
          }
        }
      });
  });

  beforeEach(() => {
    fixture = MockRender(TranslatorSourceComponent);
    componentInstance = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(componentInstance).toBeDefined();
  });

  it('languages list should be configured correctly', () => {
    componentInstance.languages$.subscribe(languageList => {
      expect(languageList).toEqual(languages);
    });
  });

  it('after pasting form value should contain text', async () => {
    const clipBoardValue = 'Some text';
    const navigator = ngMocks.get(fixture.debugElement, NAVIGATOR);
    const clipBoardReadTextSpy = spyOn(navigator.clipboard, 'readText')
      .and
      .returnValue(Promise.resolve(clipBoardValue));
    await componentInstance.paste();
    expect(clipBoardReadTextSpy).toHaveBeenCalled();
    expect(componentInstance.form.value).toEqual(jasmine.objectContaining({
      source: clipBoardValue
    }));
  });

  it('after success pasting form tuiAlertService open method should be called', async () => {
    const clipBoardValue = 'Some text';
    const navigator = ngMocks.get(fixture.debugElement, NAVIGATOR);
    const alertService = ngMocks.get(fixture.debugElement, TuiAlertService);
    spyOn(navigator.clipboard, 'readText')
      .and
      .returnValue(Promise.resolve(clipBoardValue));
    await componentInstance.paste();
    expect(alertService.open).toHaveBeenCalled();
    expect(alertService.open).toHaveBeenCalledWith('Text has been pasted!', {status: TuiNotification.Success});
  });

  it('after error pasting form tuiAlertService open method should be called', async () => {
    const clipBoardValue = 'Some text';
    const navigator = ngMocks.get(fixture.debugElement, NAVIGATOR);
    const alertService = ngMocks.get(fixture.debugElement, TuiAlertService);
    spyOn(navigator.clipboard, 'readText')
      .and
      .returnValue(Promise.reject(clipBoardValue));
    await componentInstance.paste();
    expect(alertService.open).toHaveBeenCalled();
    expect(alertService.open).toHaveBeenCalledWith('Text hasn\'t been pasted!', {status: TuiNotification.Error});
  });

});
