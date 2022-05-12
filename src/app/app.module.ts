import { NgModule } from '@angular/core';
import {
  TuiSvgModule,
  TuiRootModule,
  TuiHintModule,
  TuiAlertModule,
  TuiButtonModule,
  TuiLoaderModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TuiIslandModule,
  TuiSelectModule,
  TuiTextAreaModule,
  TuiLineClampModule,
  TuiDataListWrapperModule,
} from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { TranslateApiService } from './services/translate-api.service';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { TranslatorComponent } from './components/translator/translator.component';
import { DeepTranslateApiService } from './services/deep-translate/deep-translate-api.service';
import { TranslatorSourceComponent } from './components/translator/translator-source/translator-source.component';
import { TranslatorTargetComponent } from './components/translator/translator-target/translator-target.component';


@NgModule({
  declarations: [
    AppComponent,
    TranslatorComponent,
    TranslatorSourceComponent,
    TranslatorTargetComponent,
  ],
  imports: [
    FormsModule,
    TuiLetModule,
    TuiSvgModule,
    BrowserModule,
    TuiRootModule,
    TuiHintModule,
    TuiAlertModule,
    TuiLoaderModule,
    TuiButtonModule,
    TuiSelectModule,
    TuiIslandModule,
    TuiTextAreaModule,
    HttpClientModule,
    TuiDataListModule,
    TuiLineClampModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: TranslateApiService, useClass: DeepTranslateApiService },
  ],
})
export class AppModule {
}
