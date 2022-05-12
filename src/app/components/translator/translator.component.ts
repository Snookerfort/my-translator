import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ITranslatorSourceForm } from './interfaces/translator-source-form.interface';


@Component({
  selector: 'mt-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatorComponent implements OnInit {

  public source: ITranslatorSourceForm | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
