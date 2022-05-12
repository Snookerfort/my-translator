import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ITranslatorSourceForm } from './interfaces/translator-source-form.interface';


@Component({
  selector: 'mt-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatorComponent implements OnInit {

  public sourceForm: ITranslatorSourceForm | null = null;

  public get sourceFormIsValid(): boolean {
    return !!this.sourceForm?.language && !!this.sourceForm.source;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
