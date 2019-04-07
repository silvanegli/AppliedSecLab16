import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../ca-api/auth-guard.service';
import { ProfileComponent } from './profile.component';

const profileRoutes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forChild(profileRoutes);
