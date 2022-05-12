import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorTargetComponent } from './translator-target.component';

describe('TranslatorTargetComponent', () => {
  let component: TranslatorTargetComponent;
  let fixture: ComponentFixture<TranslatorTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslatorTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
