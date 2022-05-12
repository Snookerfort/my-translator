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
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { TranslatorComponent } from './components/translator/translator.component';
import { TranslatorFormComponent } from './components/translator-form/translator-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TranslatorComponent,
    TranslatorFormComponent,
  ],
  imports: [
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
