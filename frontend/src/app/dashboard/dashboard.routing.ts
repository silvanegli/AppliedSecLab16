import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../ca-api/auth-guard.service';

const homeRoutes: Routes = [
    {path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] }
];

export const routing = RouterModule.forChild(homeRoutes);