import { ComponentFixture } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';

export async function runOnPushChangeDetection(fixture: ComponentFixture<any>): Promise<void> {
  const changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
  changeDetectorRef.detectChanges();
  return fixture.whenStable();
}
