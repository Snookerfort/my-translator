import { finalize } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ITranslatorSourceForm } from './interfaces/translator-source-form.interface';
import { TranslateApiService } from '../../services/translate-api.service';


@Component({
  selector: 'mt-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatorComponent implements OnInit {

  public loading = false;
  public sourceForm: ITranslatorSourceForm | null = null;
  public translation: string = ''

  public get sourceFormIsValid(): boolean {
    return !!this.sourceForm?.language && !!this.sourceForm.source;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translateApiService: TranslateApiService,
  ) { }

  ngOnInit(): void {
  }

  public translate(): void {
    this.loading = true;
    this.translateApiService.translate(this.sourceForm!.source!, this.sourceForm!.language!).pipe(
      finalize(() => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      }),
    ).subscribe(result => this.translation = result.text);
  }

}
