import { Routes } from '@angular/router';
import { ReportDashboardComponent } from './pages/report-dashboard/report-dashboard.component';
import { authGuard } from '../../core/guards/auth.guard';

export const REPORT_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ReportDashboardComponent,
                title: 'Reportes'
            }
        ],
        canActivate: [authGuard]
    }
];