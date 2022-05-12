import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TuiIslandModule } from '@taiga-ui/kit';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiAlertService, TuiNotification, TuiSvgModule } from '@taiga-ui/core';

import { NAVIGATOR } from '../../../tokens/navigator';
import { TranslatorTargetComponent } from './translator-target.component';
import { runOnPushChangeDetection } from '../../../../testing/change-detection-helpers';
import { AlertingStubService, NavigatorStub } from '../testing/translator-testing-helpers';


describe('TranslatorTargetComponent', () => {
  let component: TranslatorTargetComponent;
  let fixture: ComponentFixture<TranslatorTargetComponent>;
  let tuiAlertService: TuiAlertService;
  let navigator: NavigatorStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TuiSvgModule,
        TuiIslandModule,
      ],
      declarations: [TranslatorTargetComponent],
      providers: [
        {provide: NAVIGATOR, useClass: NavigatorStub},
        {provide: TuiAlertService, useClass: AlertingStubService},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorTargetComponent);
    component = fixture.componentInstance;
    tuiAlertService = fixture.debugElement.injector.get(TuiAlertService);
    navigator = fixture.debugElement.injector.get(NAVIGATOR);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display translation', () => {
    const translation = 'Some translation';
    component.translation = translation;
    runOnPushChangeDetection(fixture);
    const translateParagraphDe = fixture.debugElement.query(By.css('.tui-island__paragraph'));
    const translateParagraphEl: HTMLParagraphElement = translateParagraphDe.nativeElement;
    expect(translateParagraphEl.textContent).toEqual(translation);
  });

  it('after success copying to clipboard tuiAlertService open method should be called', async () => {
    component.translation = 'Some translation';
    spyOn(navigator.clipboard, 'writeText')
      .and
      .returnValue(Promise.resolve(undefined));
    await component.copy();
    expect(tuiAlertService.open).toHaveBeenCalled();
    expect(tuiAlertService.open).toHaveBeenCalledWith('Text has been copied!', {status: TuiNotification.Success});
  });

  it('after fail copying to clipboard tuiAlertService open method should be called', async () => {
    component.translation = 'Some translation';
    spyOn(navigator.clipboard, 'writeText')
      .and
      .returnValue(Promise.reject());
    await component.copy();
    expect(tuiAlertService.open).toHaveBeenCalled();
    expect(tuiAlertService.open).toHaveBeenCalledWith('Text hasn\'t been copied!', {status: TuiNotification.Error});
  });

});

describe('TranslatorTargetComponent inside a test host', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TuiSvgModule,
        TuiIslandModule,
      ],
      declarations: [
        TestHostComponent,
        TranslatorTargetComponent,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display translation', () => {
    const translateParagraphDe = fixture.debugElement.query(By.css('.tui-island__paragraph'));
    const translateParagraphEl: HTMLParagraphElement = translateParagraphDe.nativeElement;
    expect(translateParagraphEl.textContent).toEqual(testHost.translation);
  });

});


@Component({
  template: `
    <mt-translator-target [translation]="translation"></mt-translator-target>
  `
})
class TestHostComponent {
  translation = 'Some translation';
}
