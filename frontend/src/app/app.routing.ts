import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const appRoutes: Routes = [
    {path: '**', component: NotFoundComponent}
];

export const routing = RouterModule.forRoot(appRoutes);