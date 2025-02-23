import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    template: `
    @if (loading$ | async) {
      <div class="loading-overlay">
        <mat-spinner></mat-spinner>
      </div>
    }
  `,
    styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class LoadingComponent {
    loading$: Observable<boolean>;

    constructor(private loadingService: LoadingService) {
        this.loading$ = this.loadingService.loading$;
    }
}