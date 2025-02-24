import { NumbersOnlyDirective } from './numbers-only.directive';
import { ElementRef } from '@angular/core';

describe('NumbersOnlyDirective', () => {
  it('should create', () => {
    const elementRef = new ElementRef(document.createElement('input'));
    const directive = new NumbersOnlyDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
