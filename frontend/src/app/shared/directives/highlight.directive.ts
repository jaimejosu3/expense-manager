import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[highlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges {
  @Input() highlight = '';
  @Input() highlightColor = 'yellow';

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    if (this.highlight) {
      this.el.nativeElement.style.backgroundColor = this.highlightColor;
    } else {
      this.el.nativeElement.style.backgroundColor = null;
    }
  }
}