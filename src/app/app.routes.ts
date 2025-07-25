import { Routes } from '@angular/router';
import {Clients} from './features/clients/pages/clients/clients';
import {Movements} from './features/movements/pages/movements/movements';
import {Accounts} from './features/accounts/pages/accounts/accounts';
import {Reports} from './features/reports/pages/reports/reports';
import {Layout} from './common/components/layout/layout';
import {ClientForm} from './features/clients/pages/client-form/client-form';
import {MovementForm} from './features/movements/pages/movement-form/movement-form';
import {AccountForm} from './features/accounts/pages/account-form/account-form';

export const routes: Routes = [
  {
    path:'',
    redirectTo: 'clients',
    pathMatch: 'full'
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'clients',
        children: [
          {
            path: '',
            component: Clients
          },
          {
            path: 'create',
            component: ClientForm
          },
          {
            path: ':clientId',
            children: [
              {
                path: '',
                component: ClientForm
              },
              {
                path: 'accounts',
                children: [
                  {
                    path: '',
                    component: AccountForm
                  },
                  {
                    path: ':accountId',
                    children: [
                      {
                        path: '',
                        component: AccountForm,
                      },
                      {
                        path: 'movements',
                        component: MovementForm
                      },
                    ]
                  },
                ]
              },
            ]
          },
        ]
      },
    ]
  }
];
