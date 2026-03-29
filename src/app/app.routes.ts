import { Routes } from '@angular/router';

import { Detail } from '@app/pages/detail/detail';
import { Home } from '@app/pages/home/home';

import { MainLayout } from '@layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
        children: [
          {
            path: ':id',
            component: Detail,
          },
        ],
      },
    ],
  },
];
