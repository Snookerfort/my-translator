import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { NAVIGATOR } from '../../../tokens/navigator';


@Component({
  selector: 'mt-translator-target',
  templateUrl: './translator-target.component.html',
  styleUrls: ['./translator-target.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatorTargetComponent implements OnInit {

  public translation = 'Some text';

  constructor(
    private readonly alertService: TuiAlertService,
    @Inject(NAVIGATOR)
    private readonly navigator: Navigator,
  ) { }

  ngOnInit(): void {
  }

  public async copy(): Promise<void> {
    if (!this.translation) {
      return;
    }
    try {
      await this.navigator.clipboard.writeText(this.translation);
      this.alertService.open('Text has been copied!', {status: TuiNotification.Success}).subscribe();
    } catch (e) {
      this.alertService.open('Text hasn\'t been copied!', {status: TuiNotification.Error}).subscribe()
    }
  }

}
