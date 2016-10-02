import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../ca-api/auth-guard.service';
import { CertificatesComponent } from './certificates.component';

const certificatesRoutes: Routes = [
    {
        path: 'certificates',
        component: CertificatesComponent,
        // canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forChild(certificatesRoutes);
