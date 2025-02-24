export interface ChartConfiguration {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
    }[];
    options?: any;
}
