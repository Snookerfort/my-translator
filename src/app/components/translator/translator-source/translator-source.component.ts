import { FormControl, FormGroup } from '@angular/forms';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { NAVIGATOR } from '../../../tokens/navigator';
import { ILanguage } from '../../../interfaces/language.interface';
import { TranslateApiService } from '../../../services/translate-api.service';


@Component({
  selector: 'mt-translator-source',
  templateUrl: './translator-source.component.html',
  styleUrls: ['./translator-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatorSourceComponent implements OnInit {

  public languages$ = this.translateApiService.listLanguages();
  public form = new FormGroup({
    source: new FormControl(null),
    language: new FormControl(null),
  })

  constructor(
    @Inject(NAVIGATOR)
    private readonly navigator: Navigator,
    private readonly alertService: TuiAlertService,
    private readonly translateApiService: TranslateApiService,
  ) { }

  ngOnInit(): void {
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

}
