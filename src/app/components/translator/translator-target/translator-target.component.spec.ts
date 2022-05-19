import { EMPTY } from 'rxjs';
import createSpy = jasmine.createSpy;
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';

import { AppModule } from '../../../app.module';
import { NAVIGATOR } from '../../../tokens/navigator';
import { TranslatorTargetComponent } from './translator-target.component';


describe('TranslatorTargetComponent', () => {
  let fixture: MockedComponentFixture<TranslatorTargetComponent>;
  let componentInstance: TranslatorTargetComponent;

  beforeEach(() => {
    return MockBuilder(TranslatorTargetComponent, AppModule)
      .mock(TuiAlertService, {
        open: createSpy('open').and.returnValue(EMPTY)
      })
      .provide({
        provide: NAVIGATOR,
        useValue: {
          clipboard: {
            writeText: () => {
            },
          }
        }
      });
  });

  beforeEach(() => {
    fixture = MockRender(TranslatorTargetComponent);
    componentInstance = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(componentInstance).toBeDefined();
  });

  it('should display translation', () => {
    const translation = 'Some translation';
    fixture.componentInstance.translation = translation;
    fixture.detectChanges();
    const translateOutlet: HTMLParagraphElement = ngMocks.find('.tui-island__paragraph').nativeElement;
    expect(translateOutlet.textContent).toEqual(translation);
  });

  describe('copy method', () => {
    let navigator: Navigator;
    let alertService: TuiAlertService;

    beforeEach(() => {
      componentInstance.translation = 'Some translation';
      navigator = ngMocks.get(fixture.debugElement, NAVIGATOR);
      alertService = ngMocks.get(fixture.debugElement, TuiAlertService);
    });

    it('after success copying to clipboard tuiAlertService open method should be called', async () => {
      spyOn(navigator.clipboard, 'writeText')
        .and
        .returnValue(Promise.resolve(undefined));
      await componentInstance.copy();
      expect(alertService.open).toHaveBeenCalled();
      expect(alertService.open).toHaveBeenCalledWith('Text has been copied!', {status: TuiNotification.Success});
    });

    it('after fail copying to clipboard tuiAlertService open method should be called', async () => {
      spyOn(navigator.clipboard, 'writeText')
        .and
        .returnValue(Promise.reject());
      await componentInstance.copy();
      expect(alertService.open).toHaveBeenCalled();
      expect(alertService.open).toHaveBeenCalledWith('Text hasn\'t been copied!', {status: TuiNotification.Error});
    });

  });

  it('should display translation', () => {
    const translation = 'Some translation';
    ngMocks.flushTestBed();
    MockRender(
      '<mt-translator-target [translation]="outerTranslation"></mt-translator-target>',
      {outerTranslation: translation},
    );
    const translateOutlet: HTMLParagraphElement = ngMocks.find('.tui-island__paragraph').nativeElement;
    expect(translateOutlet.textContent).toEqual(translation);
  });

});
