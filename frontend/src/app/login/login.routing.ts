import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { NotAuthGuard } from '../ca-api/not-auth.guard.service';

const loginRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotAuthGuard]
    }
];

export const routing = RouterModule.forChild(loginRoutes);