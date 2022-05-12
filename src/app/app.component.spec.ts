import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

@Component({selector: 'tui-root', template: ''})
class TuiRootStubComponent {}

@Component({selector: 'mt-translator', template: ''})
class TranslatorStubComponent {
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TuiRootStubComponent,
        TranslatorStubComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
