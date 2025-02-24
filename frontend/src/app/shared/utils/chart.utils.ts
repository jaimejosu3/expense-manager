import { ChartData } from '../models/chart-data.model';

export const generateChartColors = (count: number): string[] => {
    const colors = [
        '#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0',
        '#00BCD4', '#FF5722', '#795548', '#607D8B', '#3F51B5'
    ];

    return Array(count).fill('').map((_, i) => colors[i % colors.length]);
};

export const prepareChartData = (labels: string[], data: number[]): ChartData => {
    return {
        labels,
        datasets: [{
            label: 'Datos',
            data,
            backgroundColor: generateChartColors(data.length)
        }]
    };
};