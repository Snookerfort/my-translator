import { takeUntil } from 'rxjs';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { AbstractTuiControl, TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Optional, Self } from '@angular/core';

import { NAVIGATOR } from '../../../tokens/navigator';
import { ILanguage } from '../../../interfaces/language.interface';
import { TranslateApiService } from '../../../services/translate-api.service';
import { ITranslatorSourceForm } from '../interfaces/translator-source-form.interface';


@Component({
  selector: 'mt-translator-source',
  templateUrl: './translator-source.component.html',
  styleUrls: ['./translator-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatorSourceComponent extends AbstractTuiControl<ITranslatorSourceForm> {

  public focused = true;
  public languages$ = this.translateApiService.listLanguages();
  public form = new FormGroup({
    source: new FormControl(null),
    language: new FormControl(null),
  });

  constructor(
    @Self()
    @Optional()
    @Inject(NgControl)
      control: NgControl,
    changeDetectorRef: ChangeDetectorRef,
    @Inject(NAVIGATOR)
    private readonly navigator: Navigator,
    private readonly alertService: TuiAlertService,
    private readonly translateApiService: TranslateApiService,
  ) {
    super(control, changeDetectorRef);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(changes => this.updateValue(changes));
  }

  public override writeValue(value: ITranslatorSourceForm | null) {
    super.writeValue(value);
    if (value?.language) {
      this.form.get('language')?.setValue(value.language, {emitEvent: false});
    }
    if (value?.source) {
      this.form.get('source')?.setValue(value.source, {emitEvent: false});
    }
  }

  @tuiPure
  public stringify(items: readonly ILanguage[]): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(items.map(({code, name}) => [code, name] as [string, string]));

    return ({$implicit}: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  public async paste(): Promise<void> {
    try {
      const text = await this.navigator.clipboard.readText();
      if (!text) {
        return;
      }
      this.form.get('source')!.setValue(text);
      this.alertService.open('Text has been pasted!', {status: TuiNotification.Success}).subscribe();
    } catch (e) {
      this.alertService.open('Text hasn\'t been pasted!', {status: TuiNotification.Error}).subscribe();
    }
  }

  protected getFallbackValue(): ITranslatorSourceForm {
    return {
      source: '',
      language: 'ru'
    };
  }

}
