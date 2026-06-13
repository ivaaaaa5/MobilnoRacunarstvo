import { Routes } from '@angular/router';
import { clientGuard, adminGuard, employeeGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/employee/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage),
    canActivate: [clientGuard],
  },
  {
    path: 'new-reservation',
    loadComponent: () =>
      import('./pages/employee/new-reservation.page').then(m => m.NewReservationPage),
    canActivate: [clientGuard],
  },
  {
    path: 'reservations',
    loadComponent: () =>
      import('./pages/employee/my-reservations.page').then(m => m.MyReservationsPage),
    canActivate: [clientGuard],
  },
  {
    path: 'employee-reservations',
    loadComponent: () =>
      import('./pages/employee/employee-reservations.page').then(m => m.EmployeeReservationsPage),
    
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/employee/admin/admin.page').then(m => m.AdminPage),
    canActivate: [adminGuard],
  },
  {
  path: 'timeslots',
  loadComponent: () =>
    import('./pages/employee/admin/timeslots.page').then(m => m.TimeSlotsPage),
  canActivate: [adminGuard],
},
];