import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Home } from './pages/home/home';
import { Short } from './pages/short/short';
import { Store } from './pages/store/store';

export const routes: Routes = [
    {
        path:'',
        component: MainLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home').then(m => m.Home),
                title: 'The Strongest | Inicio'
            },
            {
                path: 'store',
                loadComponent: () => import('./pages/store/store').then(m => m.Store),
                title: 'The Strongest | Tienda'
            },
            {
                path: 'stadium',
                loadComponent: () => import('./pages/stadium/stadium').then(m => m.Stadium),
                title: 'The Strongest | Stadium'
            }
        ]
    },
    {
        path: 'short/:id',
        loadComponent: () =>  import('./pages/short/short').then(m => m.Short),
        title: 'The Strongest | Video'
    },
    { path: '**', redirectTo: '' }
];