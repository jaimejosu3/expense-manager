import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './expense-chart.component.html',
  styleUrl: './expense-chart.component.scss'
})
export class ExpenseChartComponent implements OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @Input() data: any;
  @Input() type: 'line' | 'bar' | 'pie' = 'line';
  @Input() title = 'Gastos';

  private chart?: Chart;

  ngOnChanges(): void {
    this.initChart();
  }

  private initChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}