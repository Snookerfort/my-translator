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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { TranslateApiService } from './services/translate-api.service';
import { TranslateApiMockService } from './services/translate-api-mock.service';
import { TranslatorComponent } from './components/translator/translator.component';
import { TranslatorSourceComponent } from './components/translator/translator-source/translator-source.component';
import { TranslatorTargetComponent } from './components/translator/translator-target/translator-target.component';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';


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
    { provide: TranslateApiService, useClass: TranslateApiMockService },
  ],
})
export class AppModule {
}
