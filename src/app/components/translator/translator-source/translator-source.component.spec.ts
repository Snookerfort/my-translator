import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorSourceComponent } from './translator-source.component';

describe('TranslatorSourceComponent', () => {
  let component: TranslatorSourceComponent;
  let fixture: ComponentFixture<TranslatorSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslatorSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
