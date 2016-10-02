import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../ca-api/auth-guard.service';

const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forChild(dashboardRoutes);